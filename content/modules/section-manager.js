(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;

  const togglePhotoSection = (hide) => {
    const el = DOM.find('.section.list.special');
    if (!el) {
      // 재시도 (로딩 지연 대응)
      setTimeout(() => togglePhotoSection(hide), 1000);
      return;
    }
    el.style.display = hide ? 'none' : 'block';
  };

  const togglePrioritySection = (hide) => {
    const el = DOM.find('.section.list[data-bind*="specialSearchResults"]:not(.special)');
    if (!el) {
      setTimeout(() => togglePrioritySection(hide), 1000);
      return;
    }
    el.style.display = hide ? 'none' : 'block';
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
      togglePhotoSection(!!s.hidePhotoSection);
      togglePrioritySection(!!s.hidePrioritySection);
      updateVehicleHistoryVisibility(
        s.showUsageHistory !== false,
        s.showInsuranceHistory !== false,
        s.showOwnerHistory !== false,
        s.showNoInsuranceHistory !== false
      );
    } catch (_) { /* no-op */ }
  };

  const SectionManager = {
    async init() {
      await applySettings();
    },
    async onSettingsChanged() {
      await applySettings();
    },
    async onRouteChange() {
      await applySettings();
    }
  };

  window.EPS.Modules.SectionManager = SectionManager;
})();
