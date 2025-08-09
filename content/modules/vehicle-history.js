(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;
  const { fetchVehicleHistory, extractVehicleId, processBatch } = window.EPS.API;

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
        addVehicleLabelsToRow(serviceLabelList, vehicleLabels);
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
    init() { setTimeout(processUsageHistory, 1000); },
    onSettingsChanged() { /* CSS 클래스로 표시/숨김 제어이므로 재처리 불필요 */ },
    onRouteChange() { setTimeout(processUsageHistory, 500); }
  };

  window.EPS.Modules.VehicleHistory = VehicleHistory;
})();
