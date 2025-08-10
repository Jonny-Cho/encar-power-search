(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;
  const { selectors } = (window.EPS.CONSTS || {});

  const isEncarSearchPage = () => {
    const hostOk = window.location.hostname === 'www.encar.com';
    const path = window.location.pathname || '';
    return hostOk && (path.includes('carsearchlist') || path.includes('searchList'));
  };

  const formatMoney = (n) => (Number(n || 0)).toLocaleString();

  const syncInputs = async (root) => {
    try {
      const s = await window.EPS.Settings.getAll();
      const $ = (id) => root.querySelector(id);
      if ($('#eps-th-myacc-cnt')) $('#eps-th-myacc-cnt').value = Number(s.thresholdMyAccidentCount || 0);
      if ($('#eps-th-myacc-cost')) $('#eps-th-myacc-cost').value = formatMoney(s.thresholdMyAccidentCost);
      if ($('#eps-th-owner')) $('#eps-th-owner').value = Number(s.thresholdOwnerChanges || 0);
      if ($('#eps-th-noins-months')) $('#eps-th-noins-months').value = Number(s.thresholdNoInsuranceMonths || 0);
      const usageChk = $('#eps-hide-usage');
      if (usageChk) usageChk.checked = !!s.hideIfUsage;

      // enable toggles and bodies
      const bindState = (cbId, enabled, liSel) => {
        const cb = $(cbId);
        if (cb) cb.checked = !!enabled;
        const li = cb && cb.closest('li');
        if (li) toggleFieldBody(li, !!enabled);
      };
      bindState('#eps-enable-acc-cnt', s.enableAccidentCount, 'li');
      bindState('#eps-enable-acc-cost', s.enableAccidentCost, 'li');
      bindState('#eps-enable-owner', s.enableOwnerChanges, 'li');
      bindState('#eps-enable-noins', s.enableNoInsuranceMonths, 'li');
    } catch (_) {}
  };

  const persist = (key, value) => {
    try { chrome.storage.sync.set({ [key]: value }); } catch (_) {}
  };

  const toggleFieldBody = (root, checked, inputSelector) => {
    const body = root.querySelector('.eps-field-body');
    if (!body) return;
    body.style.display = checked ? 'block' : 'none';
    if (checked && inputSelector) {
      const input = root.querySelector(inputSelector);
      if (input) input.focus();
    }
  };

  const createPanel = () => {
    const div = DOM.create('div', 'schset encar-advanced');
    div.setAttribute('data-eps-source', 'advanced');
    div.classList.add('open');
    div.innerHTML = `
      <h5 class="icon slideopen">
        <a href="javascript:;" id="eps-adv-header" data-enlog-dt-eventnamegroup="필터">
          이력 숨김 조건
          <span class="ic_bul"></span>
        </a>
      </h5>
      <div id="eps-adv-body" class="depthpreant" style="display: block;">
        <div class="deparea">
          <ul class="deplist">
            <li class="eps-check">
              <input type="checkbox" class="checkbox" id="eps-hide-usage" data-enlog-dt-eventnamegroup="필터">
              <label for="eps-hide-usage">사용이력 있으면 숨김</label>
              <em>-</em>
            </li>
            <li class="eps-field">
              <input type="checkbox" class="checkbox" id="eps-enable-acc-cnt" data-enlog-dt-eventnamegroup="필터">
              <label for="eps-enable-acc-cnt">내차 보험사고 횟수</label>
              <em>-</em>
              <div class="eps-field-body" style="display:none; margin-top:6px;">
                <input type="number" id="eps-th-myacc-cnt" min="0" placeholder="예) 3">
                <div class="eps-helper">회 이상 숨김</div>
              </div>
            </li>
            <li class="eps-field">
              <input type="checkbox" class="checkbox" id="eps-enable-acc-cost" data-enlog-dt-eventnamegroup="필터">
              <label for="eps-enable-acc-cost">내차 보험사고 금액</label>
              <em>-</em>
              <div class="eps-field-body" style="display:none; margin-top:6px;">
                <input type="text" id="eps-th-myacc-cost" inputmode="numeric" placeholder="예) 10000000">
                <div class="eps-helper">원 이상 숨김</div>
              </div>
            </li>
            <li class="eps-field">
              <input type="checkbox" class="checkbox" id="eps-enable-owner" data-enlog-dt-eventnamegroup="필터">
              <label for="eps-enable-owner">소유자 변경 횟수</label>
              <em>-</em>
              <div class="eps-field-body" style="display:none; margin-top:6px;">
                <input type="number" id="eps-th-owner" min="0" placeholder="예) 5">
                <div class="eps-helper">회 이상 숨김</div>
              </div>
            </li>
            <li class="eps-field">
              <input type="checkbox" class="checkbox" id="eps-enable-noins" data-enlog-dt-eventnamegroup="필터">
              <label for="eps-enable-noins">보험 미가입 기간</label>
              <em>-</em>
              <div class="eps-field-body" style="display:none; margin-top:6px;">
                <input type="number" id="eps-th-noins-months" min="0" placeholder="예) 12">
                <div class="eps-helper">개월 이상 숨김</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    `;

    const header = div.querySelector('#eps-adv-header');
    if (header) header.addEventListener('click', (e) => {
      e.preventDefault();
      const body = div.querySelector('#eps-adv-body');
      if (!body) return;
      const visible = body.style.display !== 'none';
      body.style.display = visible ? 'none' : 'block';
      div.classList.toggle('open', !visible);
    });

    const onNumberChange = (el, key) => {
      if (!el) return;
      el.addEventListener('input', () => {
        const v = Math.max(0, parseInt(el.value || '0', 10) || 0);
        el.value = v;
        persist(key, v);
      });
    };
    const onMoneyChange = (el, key) => {
      if (!el) return;
      el.addEventListener('input', () => {
        const digits = (el.value || '').replace(/[^\d]/g, '');
        const v = Math.max(0, parseInt(digits || '0', 10) || 0);
        el.value = formatMoney(v);
        persist(key, v);
      });
    };
    onNumberChange(div.querySelector('#eps-th-myacc-cnt'), 'thresholdMyAccidentCount');
    onMoneyChange(div.querySelector('#eps-th-myacc-cost'), 'thresholdMyAccidentCost');
    onNumberChange(div.querySelector('#eps-th-owner'), 'thresholdOwnerChanges');
    onNumberChange(div.querySelector('#eps-th-noins-months'), 'thresholdNoInsuranceMonths');

    const bindUsageCheckbox = (root) => {
      const usageChk = root && root.querySelector && root.querySelector('#eps-hide-usage');
      if (usageChk && !usageChk._epsBound) {
        usageChk.addEventListener('change', () => {
          persist('hideIfUsage', !!usageChk.checked);
        });
        usageChk._epsBound = true;
      }
    };
    bindUsageCheckbox(div);

    // Enable toggles per field
    const bindEnable = (id, key, inputSel) => {
      const li = div.querySelector(id)?.closest('li');
      const cb = div.querySelector(id);
      if (!cb || !li) return;
      cb.addEventListener('change', () => {
        persist(key, !!cb.checked);
        toggleFieldBody(li, cb.checked, inputSel);
      });
    };
    bindEnable('#eps-enable-acc-cnt', 'enableAccidentCount', '#eps-th-myacc-cnt');
    bindEnable('#eps-enable-acc-cost', 'enableAccidentCost', '#eps-th-myacc-cost');
    bindEnable('#eps-enable-owner', 'enableOwnerChanges', '#eps-th-owner');
    bindEnable('#eps-enable-noins', 'enableNoInsuranceMonths', '#eps-th-noins-months');

    // reset 버튼 제거: UI 단순화

    setTimeout(() => { syncInputs(div); }, 0);
    return div;
  };

  const mount = async () => {
    if (!isEncarSearchPage()) return;
    try {
      const accident = await DOM.waitForElement(selectors && selectors.accidentFilter ? selectors.accidentFilter : '.schset.accident');
      const existing = DOM.find('.schset.encar-advanced');
      if (existing) {
        // 새 요소(사용이력 토글)가 없으면 주입
        if (!existing.querySelector('#eps-hide-usage')) {
          const ul = existing.querySelector('.deplist');
          if (ul) {
            const li = document.createElement('li');
            li.innerHTML = `
              <label for="eps-hide-usage">사용이력</label>
              <div>
                <input type="checkbox" id="eps-hide-usage">
                <span style="margin-left:6px;">사용이력 있으면 숨김</span>
              </div>
            `;
            ul.appendChild(li);
            // 바인딩
            const usageChk = li.querySelector('#eps-hide-usage');
            if (usageChk) {
              usageChk.addEventListener('change', () => {
                persist('hideIfUsage', !!usageChk.checked);
              });
            }
          }
        }
        await syncInputs(existing);
        return;
      }
      const panel = createPanel();
      DOM.insertAfter(panel, accident);
    } catch (_) {}
  };

  const AdvancedFilterPanel = {
    async init() { await mount(); },
    async onSettingsChanged() { await mount(); },
    async onRouteChange() { await mount(); }
  };

  window.EPS.Modules.AdvancedFilterPanel = AdvancedFilterPanel;
})();


