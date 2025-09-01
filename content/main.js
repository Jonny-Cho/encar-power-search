(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const modules = [
    'AccidentFilter',
    'AdvancedFilterPanel',
    'SectionManager',
    'PagerowExtension',
    'VehicleHistory',
    'LabelFilter',
    'AdBanner'
  ].map((name) => (window.EPS.Modules && window.EPS.Modules[name]) || null).filter(Boolean);

  const boot = async () => {
    try {
      if (window.EPS.Settings && window.EPS.Settings.init) {
        await window.EPS.Settings.init();
      }
      if (window.EPS.Router && window.EPS.Router.init) {
        window.EPS.Router.init();
      }
      // 초기화 (현재 모듈은 no-op)
      modules.forEach((m) => { try { m.init(); } catch (_) {} });

      // 설정 변경 반영
      if (window.EPS.Settings && window.EPS.Settings.subscribe) {
        window.EPS.Settings.subscribe((s) => {
          modules.forEach((m) => { try { m.onSettingsChanged && m.onSettingsChanged(s); } catch (_) {} });
        });
      }
      // 라우트 변경 반영
      if (window.EPS.Router && window.EPS.Router.subscribe) {
        window.EPS.Router.subscribe((state) => {
          modules.forEach((m) => { try { m.onRouteChange && m.onRouteChange(state); } catch (_) {} });
        });
      }
    } catch (_) {
      // no-op
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
