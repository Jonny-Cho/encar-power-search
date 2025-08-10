(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const HIDDEN_CLASS = 'eps-hidden-row';
  const SELECTOR_ROW = 'tr[data-index]';
  const SELECTOR_ROW_PHOTO = '#sr_photo li[data-index]';

  let TH = {
    myAccidentCount: 3,
    myAccidentCost: 10000000,
    ownerChanges: 5,
    noInsMonths: 0
  };
  let hideIfUsage = false;
  let EN = { count: false, cost: false, owner: false, noins: false };

  const loadThresholds = async () => {
    try {
      const s = await window.EPS.Settings.getAll();
      TH.myAccidentCount = Number(s.thresholdMyAccidentCount ?? 3);
      TH.myAccidentCost = Number(s.thresholdMyAccidentCost ?? 10000000);
      TH.ownerChanges = Number(s.thresholdOwnerChanges ?? 5);
      TH.noInsMonths = Number(s.thresholdNoInsuranceMonths ?? 0);
      hideIfUsage = !!s.hideIfUsage;
      EN.count = !!s.enableAccidentCount;
      EN.cost = !!s.enableAccidentCost;
      EN.owner = !!s.enableOwnerChanges;
      EN.noins = !!s.enableNoInsuranceMonths;
    } catch (_) {}
  };

  const parseStatsFromContainer = (container) => {
    if (!container) return { myCount: 0, myCost: 0, owner: 0, usage: false, noInsMonths: 0 };
    let myCount = 0, myCost = 0, owner = 0, usage = false, noInsMonths = 0;

    const insurance = Array.from(container.querySelectorAll('.insurance-history-label'))
      .map((el) => el.textContent || '')
      .find((t) => t.includes('내차 보험사고'));
    if (insurance) {
      const m = insurance.match(/내차 보험사고\s*(\d+)\s*회\s*\/\s*([\d,]+)\s*원/);
      if (m) {
        myCount = parseInt(m[1] || '0', 10) || 0;
        myCost = parseInt((m[2] || '0').replace(/,/g, ''), 10) || 0;
      }
    }

    const ownerText = Array.from(container.querySelectorAll('.owner-change-label'))
      .map((el) => el.textContent || '')
      .find((t) => t.includes('소유자 변경'));
    if (ownerText) {
      const m = ownerText.match(/소유자 변경\s*(\d+)\s*회/);
      if (m) owner = parseInt(m[1] || '0', 10) || 0;
    }

    const usageText = Array.from(container.querySelectorAll('.usage-history-label'))
      .map((el) => el.textContent || '')
      .find((t) => t.includes('사용이력'));
    if (usageText) usage = true;

    const noInsText = Array.from(container.querySelectorAll('.noinsurance-label'))
      .map((el) => el.textContent || '')
      .find((t) => t.includes('보험 미가입'));
    if (noInsText) {
      const m = noInsText.match(/보험 미가입\s*(\d+)\s*개월/);
      if (m) noInsMonths = parseInt(m[1] || '0', 10) || 0;
    }

    return { myCount, myCost, owner, usage, noInsMonths };
  };

  const shouldHide = ({ myCount, myCost, owner, usage, noInsMonths }) => {
    if (EN.count && myCount >= TH.myAccidentCount) return true;
    if (EN.cost && myCost >= TH.myAccidentCost) return true;
    if (EN.owner && owner >= TH.ownerChanges) return true;
    if (EN.noins && noInsMonths >= TH.noInsMonths && TH.noInsMonths > 0) return true;
    if (hideIfUsage && usage) return true;
    return false;
  };

  let rafToken = null;
  const applyFilter = () => {
    if (rafToken) cancelAnimationFrame(rafToken);
    rafToken = requestAnimationFrame(() => {
      const rows = [
        ...document.querySelectorAll(SELECTOR_ROW),
        ...document.querySelectorAll(SELECTOR_ROW_PHOTO)
      ];
      rows.forEach((row) => {
        const container = row.querySelector('.service_label_list');
        if (!container) { row.classList.remove(HIDDEN_CLASS); return; }
        const stats = parseStatsFromContainer(container);
        if (shouldHide(stats)) row.classList.add(HIDDEN_CLASS);
        else row.classList.remove(HIDDEN_CLASS);
      });
    });
  };

  const attachObserver = () => {
    if (window._epsLabelFilterObserver) return;
    const obs = new MutationObserver(() => { applyFilter(); });
    obs.observe(document.body, { childList: true, subtree: true });
    window._epsLabelFilterObserver = obs;
  };

  const LabelFilter = {
    async init() {
      await loadThresholds();
      attachObserver();
      setTimeout(applyFilter, 900);
      if (window.EPS.Settings && window.EPS.Settings.subscribe) {
        window.EPS.Settings.subscribe(async () => {
          await loadThresholds();
          applyFilter();
        });
      }
    },
    onRouteChange() { setTimeout(applyFilter, 600); },
    onSettingsChanged() { /* handled via subscribe */ }
  };

  window.EPS.Modules.LabelFilter = LabelFilter;
})();


