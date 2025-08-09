(function() {
  'use strict';
  window.EPS = window.EPS || {};

  const listeners = new Set();
  let lastHref = '';

  const getState = () => ({ href: window.location.href, hashData: (window.EPS.URL && window.EPS.URL.parseHashData()) || {} });

  const notify = () => {
    const state = getState();
    listeners.forEach((fn) => { try { fn(state); } catch (_) {} });
  };

  const onChange = () => {
    if (lastHref !== window.location.href) {
      lastHref = window.location.href;
      notify();
    }
  };

  const init = () => {
    lastHref = window.location.href;
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    // 폴백 주기적 체크 (SPA 전환 대응)
    setInterval(onChange, 1000);
  };

  const subscribe = (fn) => {
    if (typeof fn === 'function') listeners.add(fn);
    return () => listeners.delete(fn);
  };

  window.EPS.Router = { init, subscribe, getState };
})();
