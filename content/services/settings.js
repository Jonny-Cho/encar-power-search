(function() {
  'use strict';
  window.EPS = window.EPS || {};

  const DEFAULTS = (window.EPS.CONSTS && window.EPS.CONSTS.defaultSettings) || {
    hidePhotoSection: false,
    hidePrioritySection: false,
    showUsageHistory: true,
    showInsuranceHistory: true,
    showOwnerHistory: true,
    showNoInsuranceHistory: true,
    pagerowValue: '500'
  };

  let cache = null;
  const subscribers = new Set();

  const load = () => new Promise((resolve) => {
    const storage = chrome && chrome.storage && chrome.storage.sync;
    if (!storage) {
      cache = { ...DEFAULTS };
      return resolve(cache);
    }
    storage.get(Object.keys(DEFAULTS), (result) => {
      cache = { ...DEFAULTS, ...(result || {}) };
      resolve(cache);
    });
  });

  const init = async () => {
    await load();
    if (chrome && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        cache = { ...cache };
        Object.keys(changes).forEach((k) => {
          cache[k] = changes[k].newValue;
        });
        subscribers.forEach((fn) => {
          try { fn({ ...cache }); } catch (_) {}
        });
      });
    }
  };

  const getAll = async () => {
    if (!cache) await load();
    return { ...cache };
  };

  const subscribe = (fn) => {
    if (typeof fn === 'function') subscribers.add(fn);
    return () => subscribers.delete(fn);
  };

  const set = async (updates) => {
    const storage = chrome && chrome.storage && chrome.storage.sync;
    if (!storage) {
      cache = { ...cache, ...updates };
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      storage.set(updates, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          cache = { ...cache, ...updates };
          resolve();
        }
      });
    });
  };

  window.EPS.Settings = { init, getAll, subscribe, set };
})();
