(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;

  // 전역 스타일 주입으로 DOM 생성 타이밍과 무관하게 제어
  const ensureGlobalStyle = () => {
    if (document.getElementById('eps-section-style')) return;
    const style = document.createElement('style');
    style.id = 'eps-section-style';
    style.textContent = `
      .eps-hide-photo .section.list.special { display: none !important; }
      .eps-hide-priority .section.list[data-bind*="specialSearchResults"]:not(.special) { display: none !important; }
    `;
    document.head.appendChild(style);
  };

  const togglePhotoSection = async (hide) => {
    ensureGlobalStyle();
    const body = document.body; if (!body) return;
    if (hide) body.classList.add('eps-hide-photo');
    else body.classList.remove('eps-hide-photo');
  };

  const togglePrioritySection = async (hide) => {
    ensureGlobalStyle();
    const body = document.body; if (!body) return;
    if (hide) body.classList.add('eps-hide-priority');
    else body.classList.remove('eps-hide-priority');
  };

  const updateVehicleHistoryVisibility = (showUsage, showInsurance, showOwner, showNoInsurance) => {
    const body = document.body;
    if (!body) return;
    // usage
    if (showUsage) body.classList.remove('hide-usage-labels');
    else body.classList.add('hide-usage-labels');
    // insurance
    if (showInsurance) body.classList.remove('hide-insurance-labels');
    else body.classList.add('hide-insurance-labels');
    // owner
    if (showOwner) body.classList.remove('hide-owner-labels');
    else body.classList.add('hide-owner-labels');
    // no insurance
    if (showNoInsurance) body.classList.remove('hide-noinsurance-labels');
    else body.classList.add('hide-noinsurance-labels');
  };

  const applySettings = async () => {
    try {
      const s = (await window.EPS.Settings.getAll());
      await Promise.all([
        togglePhotoSection(!!s.hidePhotoSection),
        togglePrioritySection(!!s.hidePrioritySection)
      ]);
      updateVehicleHistoryVisibility(
        s.showUsageHistory !== false,
        s.showInsuranceHistory !== false,
        s.showOwnerHistory !== false,
        s.showNoInsuranceHistory !== false
      );
    } catch (_) { /* no-op */ }
  };

  const SectionManager = {
    async init() { await applySettings(); },
    async onSettingsChanged() { await applySettings(); },
    async onRouteChange() { await applySettings(); }
  };

  window.EPS.Modules.SectionManager = SectionManager;
})();
