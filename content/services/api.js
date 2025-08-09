(function() {
  'use strict';
  window.EPS = window.EPS || {};

  const calculateNoInsuranceMonths = (periodString) => {
    try {
      if (!periodString || typeof periodString !== 'string') return 0;
      const parts = periodString.split('~');
      if (parts.length !== 2) return 0;
      const sy = parseInt(parts[0].slice(0, 4));
      const sm = parseInt(parts[0].slice(4, 6));
      const ey = parseInt(parts[1].slice(0, 4));
      const em = parseInt(parts[1].slice(4, 6));
      if ([sy, sm, ey, em].some(isNaN)) return 0;
      const months = (ey - sy) * 12 + (em - sm) + 1;
      return Math.max(0, months);
    } catch (e) { return 0; }
  };

  const extractVehicleId = (img) => {
    if (!img) return null;
    let m = img.src && img.src.match(/pic\d+\/(\d+)_\d+\.jpg/);
    if (m) return m[1];
    const ds = img.getAttribute && img.getAttribute('data-src');
    if (ds) {
      m = ds.match(/pic\d+\/(\d+)_\d+\.jpg/);
      if (m) return m[1];
    }
    return null;
  };

  const fetchVehicleHistory = async (vehicleId) => {
    try {
      const apiUrl = `https://api.encar.com/v1/readside/record/vehicle/${vehicleId}/open`;
      const res = await fetch(apiUrl);
      if (!res.ok) return [];
      const data = await res.json();
      const labels = [];
      const use = Array.isArray(data.carInfoUse1s) ? data.carInfoUse1s : [];
      if (use.some((c) => ['3', '4'].includes(c))) labels.push({ text: '사용이력있음', type: 'usage' });
      const my = (data.accidents || []).filter((a) => a.type === '1' || a.type === '2');
      if (my.length > 0) {
        const total = my.reduce((s, a) => s + (a.partCost || 0) + (a.laborCost || 0) + (a.paintingCost || 0), 0);
        labels.push({ text: `내차 보험사고 ${my.length}회 / ${total.toLocaleString()}원`, type: 'insurance' });
      }
      const oc = data.ownerChanges;
      if (Array.isArray(oc) && oc.length > 0) labels.push({ text: `소유자 변경 ${oc.length}회`, type: 'owner' });
      const periods = [data.notJoinDate1, data.notJoinDate2, data.notJoinDate3, data.notJoinDate4, data.notJoinDate5].filter((p) => p && p.trim() !== '');
      if (periods.length > 0) {
        const months = periods.reduce((sum, p) => sum + calculateNoInsuranceMonths(p), 0);
        if (months > 0) labels.push({ text: `보험 미가입 ${months}개월`, type: 'noinsurance' });
      }
      return labels;
    } catch (e) { return []; }
  };

  const processBatch = async (items, batchSize, processor, delay = 500) => {
    const out = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const results = await Promise.all(batch.map((item, idx) => processor(item, i + idx).catch(() => ({ success: false }))));
      out.push(...results);
      if (i + batchSize < items.length) await new Promise((r) => setTimeout(r, delay));
    }
    return out;
  };

  window.EPS.API = { calculateNoInsuranceMonths, extractVehicleId, fetchVehicleHistory, processBatch };
})();
