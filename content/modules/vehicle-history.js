(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;
  const { fetchVehicleHistory, extractVehicleId, processBatch } = window.EPS.API;

  // 차량별 라벨 캐시 (행이 교체되어도 복구 가능)
  const labelCache = new Map(); // key: vehicleId, value: labels array

  const addVehicleLabelsToRow = (serviceLabelList, vehicleLabels) => {
    // 기존 라벨 제거
    const existing = serviceLabelList.querySelectorAll('.usage-history-label, .insurance-history-label, .owner-change-label, .noinsurance-label');
    existing.forEach((el) => el.remove());
    // 추가
    vehicleLabels.forEach((labelData) => {
      const span = document.createElement('span');
      switch (labelData.type) {
        case 'usage': span.className = 'usage-history-label'; break;
        case 'insurance': span.className = 'insurance-history-label'; break;
        case 'owner': span.className = 'owner-change-label'; break;
        case 'noinsurance': span.className = 'noinsurance-label'; break;
        default: span.className = 'vehicle-history-label';
      }
      span.textContent = labelData.text;
      serviceLabelList.appendChild(span);
    });
  };

  // 라벨이 내부 렌더링 변경으로 제거될 때 재주입을 보장
  const attachLabelPersistence = (hostElement, serviceLabelList, vehicleLabels) => {
    try {
      // 캐시해두어 재주입 시 API 재호출 없이 사용
      hostElement._epsVehicleLabels = vehicleLabels;
      if (hostElement._epsLabelObserver) return;
      const observer = new MutationObserver(() => {
        const container = hostElement.querySelector('.service_label_list');
        if (!container) return; // 컨테이너 자체가 아직 없으면 대기
        const hasAny = container.querySelector(
          '.usage-history-label, .insurance-history-label, .owner-change-label, .noinsurance-label'
        );
        if (!hasAny) {
          addVehicleLabelsToRow(container, hostElement._epsVehicleLabels || []);
        }
      });
      // 행 전체를 관찰하여 컨테이너 교체/자식 변경 모두 대응
      observer.observe(hostElement, { childList: true, subtree: true });
      hostElement._epsLabelObserver = observer;
    } catch (_) { /* no-op */ }
  };

  const processElement = async (element) => {
    try {
      const isPhotoArea = element.tagName === 'LI';
      const img = isPhotoArea ? element.querySelector('img.thumb') : element.querySelector('td.img img.thumb');
      if (!img) return { success: false, reason: 'no_image' };
      const vehicleId = extractVehicleId(img);
      if (!vehicleId) {
        element.setAttribute('data-usage-processed', 'true');
        return { success: false, reason: 'no_vehicle_id' };
      }
      const vehicleLabels = await fetchVehicleHistory(vehicleId);
      let serviceLabelList = null;
      if (isPhotoArea) serviceLabelList = element.querySelector('.service_label_list');
      else serviceLabelList = element.querySelector('td.inf .service_label_list');
      if (serviceLabelList && vehicleLabels.length > 0) {
        // 캐시 및 식별자 저장 (행 교체 시 복구용)
        try {
          labelCache.set(vehicleId, vehicleLabels);
          element.setAttribute('data-eps-vehicle-id', vehicleId);
        } catch (_) {}
        addVehicleLabelsToRow(serviceLabelList, vehicleLabels);
        attachLabelPersistence(element, serviceLabelList, vehicleLabels);
        element.setAttribute('data-usage-processed', 'true');
        return { success: true, count: vehicleLabels.length };
      }
      element.setAttribute('data-usage-processed', 'true');
      return { success: true, count: 0 };
    } catch (e) {
      return { success: false, error: e?.message };
    }
  };

  const processUsageHistory = async () => {
    try {
      const rows = DOM.findAll('tr[data-index]');
      const photoRows = DOM.findAll('#sr_photo li[data-index]');
      const all = [...Array.from(rows), ...Array.from(photoRows)];
      if (all.length === 0) return;
      const pending = all.filter((el) => !el.hasAttribute('data-usage-processed'));
      if (pending.length === 0) return;
      await processBatch(pending, 200, processElement, 500);
    } catch (e) { /* no-op */ }
  };

  const VehicleHistory = {
    init() {
      // 전역 관찰자: 행이 통째로 교체되어도 라벨 복구
      try {
        if (!window._epsVhGlobalObserver) {
          const globalObserver = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
              // 새로 추가되거나 변경된 노드들에서 라벨 컨테이너를 찾는다
              const nodes = [];
              if (m.type === 'childList') {
                nodes.push(...m.addedNodes);
                if (m.target) nodes.push(m.target);
              }
              nodes.forEach((n) => {
                if (!(n instanceof HTMLElement)) return;
                // 각 행 스코프에서 vehicleId 추출
                const row = n.closest ? n.closest('tr[data-index], li[data-index]') : null;
                if (!row) return;
                const container = row.querySelector('.service_label_list');
                if (!container) return;
                // 라벨이 없고 캐시가 있으면 복구
                const hasAny = container.querySelector('.usage-history-label, .insurance-history-label, .owner-change-label, .noinsurance-label');
                if (hasAny) return;
                // vehicleId는 이미지에서 다시 추출
                const isPhotoArea = row.tagName === 'LI';
                const img = isPhotoArea ? row.querySelector('img.thumb') : row.querySelector('td.img img.thumb');
                const vid = extractVehicleId(img);
                if (vid && labelCache.has(vid)) {
                  addVehicleLabelsToRow(container, labelCache.get(vid));
                }
              });
            });
          });
          globalObserver.observe(document.body, { childList: true, subtree: true });
          window._epsVhGlobalObserver = globalObserver;
        }
      } catch (_) { /* no-op */ }
      setTimeout(processUsageHistory, 1000);
    },
    onSettingsChanged() { /* CSS 클래스로 표시/숨김 제어이므로 재처리 불필요 */ },
    onRouteChange() { setTimeout(processUsageHistory, 500); }
  };

  window.EPS.Modules.VehicleHistory = VehicleHistory;
})();
