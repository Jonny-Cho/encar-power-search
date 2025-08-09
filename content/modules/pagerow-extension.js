(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;

  const findPagerowSelect = async () => {
    // 우선순위 1: ID
    let el = DOM.find('#pagerow');
    if (el) return el;
    // 우선순위 2: data-bind
    el = DOM.find('select[data-bind*="normalSearchResults().limit"]');
    if (el) return el;
    // 우선순위 3: options 패턴
    el = DOM.find('select[data-bind*="options: [20, 30, 40, 50]"]');
    if (el) return el;
    // 재시도
    await new Promise((r) => setTimeout(r, 1000));
    return findPagerowSelect();
  };

  const extendPagerowOptions = async () => {
    const select = await findPagerowSelect();
    if (!select || select.hasAttribute('data-extended')) return;
    // data-bind 확장
    try {
      const db = select.getAttribute('data-bind');
      if (db && db.includes('options: [20, 30, 40, 50]')) {
        const replaced = db.replace(
          'options: [20, 30, 40, 50]',
          'options: [20, 30, 40, 50, 100, 200, 300, 400, 500]'
        );
        select.setAttribute('data-bind', replaced);
      }
    } catch (_) {}
    // 정적 옵션 추가
    [100, 200, 300, 400, 500].forEach((value) => {
      if (!select.querySelector(`option[value="${value}"]`)) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = `${value}개씩 보기`;
        select.appendChild(opt);
      }
    });
    select.setAttribute('data-extended', 'true');
  };

  const restorePagerowOptions = async () => {
    const select = await findPagerowSelect();
    if (!select) return;
    // 확장 옵션 제거
    [100, 200, 300, 400, 500].forEach((value) => {
      const opt = select.querySelector(`option[value="${value}"]`);
      if (opt) opt.remove();
    });
    // data-bind 복원
    try {
      const db = select.getAttribute('data-bind');
      if (db && db.includes('options: [20, 30, 40, 50, 100, 200, 300, 400, 500]')) {
        const restored = db.replace(
          'options: [20, 30, 40, 50, 100, 200, 300, 400, 500]',
          'options: [20, 30, 40, 50]'
        );
        select.setAttribute('data-bind', restored);
      }
    } catch (_) {}
    // 현재 값이 확장 옵션이면 기본 20으로 변경
    const extendedValues = [100, 200, 300, 400, 500];
    const current = parseInt(select.value);
    if (extendedValues.includes(current)) {
      select.value = '20';
      if (typeof window.updateLimit === 'function') {
        window.updateLimit('20');
      } else {
        const ev = new Event('change', { bubbles: true });
        select.dispatchEvent(ev);
      }
    }
    select.removeAttribute('data-extended');
  };

  const apply = async () => {
    try {
      const s = await window.EPS.Settings.getAll();
      if (s.extendPagerow !== false) {
        await extendPagerowOptions();
      } else {
        await restorePagerowOptions();
      }
    } catch (_) {}
  };

  const PagerowExtension = {
    async init() { await apply(); },
    async onSettingsChanged() { await apply(); },
    async onRouteChange() { await apply(); }
  };

  window.EPS.Modules.PagerowExtension = PagerowExtension;
})();
