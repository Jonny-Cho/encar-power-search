(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;
  const { selectors } = (window.EPS.CONSTS || {});
  const URL = window.EPS.URL;

  const isEncarSearchPage = () => {
    const hostOk = window.location.hostname === 'www.encar.com';
    const path = window.location.pathname || '';
    return hostOk && (path.includes('carsearchlist') || path.includes('searchList'));
  };

  const createElement = () => {
    const status = URL.getCurrentAccidentStatus();
    const div = DOM.create('div', 'schset accident');
    div.setAttribute('data-eps-source', 'module');
    div.classList.add('open');
    div.innerHTML = `
      <h5 class="icon slideopen">
        <a href="javascript:;" id="encar-accident-header" data-enlog-dt-eventnamegroup="필터">
          사고유무
          <span class="ic_bul"></span>
        </a>
      </h5>
      <div id="schAccident" class="depthpreant" style="display: block;">
        <div class="deparea">
          <ul class="deplist">
            <li>
              <input type="checkbox" class="checkbox" id="schAccident_0" data-enlog-dt-eventnamegroup="필터" ${status === 'N' ? 'checked="checked"' : ''}>
              <label for="schAccident_0">무사고</label>
              <em>-</em>
            </li>
            <li>
              <input type="checkbox" class="checkbox" id="schAccident_1" data-enlog-dt-eventnamegroup="필터" ${status === 'F' ? 'checked="checked"' : ''}>
              <label for="schAccident_1">단순수리</label>
              <em>-</em>
            </li>
            <li>
              <input type="checkbox" class="checkbox" id="schAccident_2" data-enlog-dt-eventnamegroup="필터" ${status === 'Y' ? 'checked="checked"' : ''}>
              <label for="schAccident_2">사고 있음</label>
              <em>-</em>
            </li>
          </ul>
        </div>
      </div>`;

    // 이벤트 바인딩
    const header = div.querySelector('#encar-accident-header');
    if (header) header.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = div.querySelector('#schAccident');
      if (!dropdown) return;
      const visible = dropdown.style.display !== 'none';
      dropdown.style.display = visible ? 'none' : 'block';
      if (visible) {
        div.classList.remove('open');
      } else {
        div.classList.add('open');
      }
    });

    const checkboxes = div.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      checkbox.addEventListener('change', (evt) => {
        const cb = evt.target;
        const all = div.querySelectorAll('#schAccident input[type="checkbox"]');
        if (cb.checked) {
          all.forEach((other, i) => { if (i !== index) other.checked = false; });
          let type = 'none';
          if (index === 0) type = 'N';
          else if (index === 1) type = 'F';
          else if (index === 2) type = 'Y';
          URL.updateAccidentFilter(type);
        } else {
          URL.updateAccidentFilter('none');
        }
      });
    });

    return div;
  };

  const mount = async () => {
    if (!isEncarSearchPage()) return;
    try {
      const priceFilter = await DOM.waitForElement(selectors && selectors.priceFilter ? selectors.priceFilter : '.schset.price');
      // 이미 존재하면 마킹만 하고 동기화
      const existing = DOM.find(selectors && selectors.accidentFilter ? selectors.accidentFilter : '.schset.accident');
      if (existing) {
        if (!existing.getAttribute('data-eps-source')) {
          existing.setAttribute('data-eps-source', 'legacy');
          try { console.log('EPS(module): 기존 사고유무 필터 감지 → legacy로 마킹'); } catch (_) {}
        }
        syncFromURL();
        return;
      }
      const el = createElement();
      DOM.insertAfter(el, priceFilter);
      try { console.log('EPS(module): 사고유무 필터 생성 완료'); } catch (_) {}
      // 초기 싱크
      syncFromURL();
    } catch (_) { /* no-op */ }
  };

  const syncFromURL = () => {
    const status = URL.getCurrentAccidentStatus();
    const container = DOM.find(selectors && selectors.accidentFilter ? selectors.accidentFilter : '.schset.accident');
    if (!container) return;
    const inputs = container.querySelectorAll('#schAccident input[type="checkbox"]');
    if (inputs.length < 3) return;
    inputs[0].checked = status === 'N';
    inputs[1].checked = status === 'F';
    inputs[2].checked = status === 'Y';
    if (status === 'none') {
      inputs.forEach((i) => (i.checked = false));
    }
  };

  const AccidentFilter = {
    async init() { await mount(); },
    onSettingsChanged() { /* unused */ },
    onRouteChange() { syncFromURL(); }
  };

  window.EPS.Modules.AccidentFilter = AccidentFilter;
})();
