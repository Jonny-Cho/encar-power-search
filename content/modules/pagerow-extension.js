(function() {
  'use strict';
  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  const { DOM } = window.EPS;

  /**
   * 페이지당 표시 개수 선택 엘리먼트 찾기
   * 여러 선택자를 순차적으로 시도하여 찾음
   */
  const findPagerowSelect = async () => {
    // 우선순위 1: ID
    let el = DOM.find('#pagerow');
    if (el) return el;
    // 우선순위 2: data-bind
    el = DOM.find('select[data-bind*="normalSearchResults().limit"]');
    if (el) return el;
    // 우선순위 3: options 패턴
    el = DOM.find('select[data-bind*="options: [20, 30, 40, 50]"]');
    if (el) return el;
    // 재시도
    await new Promise((r) => setTimeout(r, 1000));
    return findPagerowSelect();
  };


  /**
   * 페이지당 표시 개수 옵션 확장 및 기본값 설정
   * - 기본 옵션: [20, 30, 40, 50]
   * - 확장 옵션: [100, 200, 300, 400, 500] 추가
   * - 기본값: 500개 (첫 사용자) 또는 저장된 값
   */
  const extendPagerowOptions = async () => {
    const select = await findPagerowSelect();
    if (!select) return;
    
    const isExtended = select.hasAttribute('data-extended');
    const isInitialized = select.hasAttribute('data-pagerow-initialized');
    
    // 옵션 확장이 필요한 경우에만 실행
    if (!isExtended) {
      // data-bind 속성 확장
      try {
        const db = select.getAttribute('data-bind');
        if (db && db.includes('options: [20, 30, 40, 50]')) {
          const replaced = db.replace(
            'options: [20, 30, 40, 50]',
            'options: [20, 30, 40, 50, 100, 200, 300, 400, 500]'
          );
          select.setAttribute('data-bind', replaced);
        }
      } catch (_) {}
      
      // 정적 옵션 추가
      [100, 200, 300, 400, 500].forEach((value) => {
        if (!select.querySelector(`option[value="${value}"]`)) {
          const opt = document.createElement('option');
          opt.value = value;
          opt.textContent = `${value}개씩 보기`;
          select.appendChild(opt);
        }
      });
      
      select.setAttribute('data-extended', 'true');
    }
    
    // 최초 1회만 값 설정 (이미 초기화된 경우 건너뜀)
    if (!isInitialized) {
      // 저장된 값 복원 또는 기본값(500) 설정
      setTimeout(async () => {
        try {
          const settings = await window.EPS.Settings.getAll();
          const targetValue = settings.pagerowValue || '500';
          
          // 현재 값과 다르면 변경
          if (select.value !== targetValue) {
            select.value = targetValue;
            
            // 변경 이벤트 발생
            const changeEvent = new Event('change', { bubbles: true });
            select.dispatchEvent(changeEvent);
          }
          
          // 초기화 완료 표시
          select.setAttribute('data-pagerow-initialized', 'true');
        } catch (error) {
          console.error('EPS: Failed to restore pagerow value', error);
        }
      }, 500);
    }
    
    // 사용자가 값을 변경할 때 Chrome Storage에 저장 (이벤트 중복 방지)
    if (!select.hasAttribute('data-change-listener')) {
      select.addEventListener('change', async (e) => {
        try {
          await window.EPS.Settings.set({ pagerowValue: e.target.value });
        } catch (error) {
          console.error('EPS: Failed to save pagerow value', error);
        }
      });
      select.setAttribute('data-change-listener', 'true');
    }
  };

  const PagerowExtension = {
    async init() { 
      await extendPagerowOptions(); 
    },
    async onSettingsChanged() { 
      // 설정 변경 시에도 실행 (현재는 no-op)
    },
    async onRouteChange() { 
      await extendPagerowOptions(); 
    }
  };

  window.EPS.Modules.PagerowExtension = PagerowExtension;
})();
