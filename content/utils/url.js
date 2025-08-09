(function() {
  'use strict';
  window.EPS = window.EPS || {};

  const parseHashData = () => {
    try {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#!')) return {};
      const encoded = hash.substring(2);
      const decoded = decodeURIComponent(encoded);
      return JSON.parse(decoded);
    } catch (e) {
      return {};
    }
  };

  const updateHashData = (data) => {
    try {
      const encoded = encodeURIComponent(JSON.stringify(data));
      const newURL = window.location.pathname + window.location.search + '#!' + encoded;
      window.location.href = newURL;
    } catch (e) {
      // no-op
    }
  };

  const getCurrentAccidentStatus = () => {
    try {
      const data = parseHashData();
      const action = data.action || '';
      if (action.includes('_.Accident.N.')) return 'N';
      if (action.includes('_.Accident.F.')) return 'F';
      if (action.includes('_.Accident.Y.')) return 'Y';
      return 'none';
    } catch (e) {
      return 'none';
    }
  };

  const updateAccidentFilter = (filterType) => {
    try {
      const data = parseHashData();
      if (!data.action) data.action = '(And.Hidden.N.)';
      data.action = data.action
        .replace(/\._\.Accident\.N\._\./g, '._.')
        .replace(/\._\.Accident\.F\._\./g, '._.')
        .replace(/\._\.Accident\.Y\._\./g, '._.')
        .replace(/\._\.Accident\.N\./g, '')
        .replace(/\._\.Accident\.F\./g, '')
        .replace(/\._\.Accident\.Y\./g, '');

      if (filterType !== 'none') {
        const frag = `_.Accident.${filterType}.`;
        if (data.action.includes('Hidden.N._.')) {
          data.action = data.action.replace('Hidden.N._.', `Hidden.N.${frag}_.`);
        } else if (data.action.includes('Hidden.N.')) {
          data.action = data.action.replace('Hidden.N.', `Hidden.N.${frag}`);
        } else {
          data.action = data.action.replace('(And.', `(And.Hidden.N.${frag}`);
        }
      }
      data.page = 1;
      updateHashData(data);
    } catch (e) {
      // no-op
    }
  };

  window.EPS.URL = { parseHashData, updateHashData, getCurrentAccidentStatus, updateAccidentFilter };
})();
