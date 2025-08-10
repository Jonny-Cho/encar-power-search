(function() {
  'use strict';

  window.EPS = window.EPS || {};
  window.EPS.CONSTS = {
    selectors: {
      priceFilter: '.schset.price',
      accidentFilter: '.schset.accident',
      accidentDropdown: '#schAccident',
      pagerowId: '#pagerow',
      pagerowDataBind: 'select[data-bind*="normalSearchResults().limit"]',
      pagerowOptionsPattern: 'select[data-bind*="options: [20, 30, 40, 50]"]',
      photoSection: '.section.list.special',
      prioritySection: '.section.list[data-bind*="specialSearchResults"]:not(.special)',
      carRow: 'tr[data-index]',
      photoRow: '#sr_photo li[data-index]'
    },
    defaultSettings: {
      hidePhotoSection: false,
      hidePrioritySection: false,
      showUsageHistory: true,
      showInsuranceHistory: true,
      showOwnerHistory: true,
      showNoInsuranceHistory: true,
      extendPagerow: true,
      thresholdMyAccidentCount: 3,
      thresholdMyAccidentCost: 10000000,
      thresholdOwnerChanges: 5,
      thresholdNoInsuranceMonths: 12,
      enableAccidentCount: false,
      enableAccidentCost: false,
      enableOwnerChanges: false,
      enableNoInsuranceMonths: false,
      hideIfUsage: false
    }
  };
})();
