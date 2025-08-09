(function() {
  'use strict';
  window.EPS = window.EPS || {};

  const DOM = {
    find: (selector) => document.querySelector(selector),
    findAll: (selector) => document.querySelectorAll(selector),
    create: (tag, className) => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      return el;
    },
    insertAfter: (newNode, referenceNode) => {
      if (!referenceNode || !referenceNode.parentNode) return;
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    remove: (selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    },
    waitForElement: (selector, timeout = 10000, interval = 300) => {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          const el = document.querySelector(selector);
          if (el) return resolve(el);
          if (Date.now() - start >= timeout) return reject(new Error(`Element not found: ${selector}`));
          setTimeout(check, interval);
        };
        check();
      });
    }
  };

  const Events = {
    on: (el, evt, handler) => el && el.addEventListener && el.addEventListener(evt, handler),
    off: (el, evt, handler) => el && el.removeEventListener && el.removeEventListener(evt, handler),
    trigger: (el, type) => {
      if (!el) return;
      const ev = new Event(type, { bubbles: true });
      el.dispatchEvent(ev);
    }
  };

  window.EPS.DOM = DOM;
  window.EPS.Events = Events;
})();
