// Encar Power Search - Content Script
// 엔카 페이지에 무사고 차량 필터 버튼을 추가하고 URL을 조작합니다.

(function() {
    'use strict';
    
    console.log('Encar Power Search content script loaded');
    
    // 페이지 로드 완료 후 초기화
    function init() {
        if (!isEncarSearchPage()) return;
        
        // 필터 버튼 추가
        addAccidentFilterButton();
    }
    
    // 엔카 검색 페이지 여부 확인
    function isEncarSearchPage() {
        return window.location.hostname === 'www.encar.com' && 
               (window.location.pathname.includes('carsearchlist') || 
                window.location.pathname.includes('searchList'));
    }
    
    // 무사고 필터 버튼 추가
    function addAccidentFilterButton() {
        // 가격 필터 영역 찾기
        const priceFilter = document.querySelector('.schset.price');
        if (!priceFilter) {
            console.log('Price filter not found, retrying...');
            setTimeout(addAccidentFilterButton, 1000);
            return;
        }
        
        // 이미 버튼이 추가되었는지 확인
        if (document.querySelector('.schset.accident')) {
            return;
        }
        
        // 사고유무 필터 버튼 생성
        const accidentFilter = createAccidentFilterElement();
        
        // 가격 필터 바로 아래에 추가
        priceFilter.parentNode.insertBefore(accidentFilter, priceFilter.nextSibling);
        
        console.log('Encar Power Search: 무사고 필터 버튼이 추가되었습니다.');
    }
    
    // 사고유무 필터 DOM 요소 생성
    function createAccidentFilterElement() {
        const div = document.createElement('div');
        div.className = 'schset accident';
        
        // 현재 URL에서 사고 필터 상태 확인
        const accidentStatus = getCurrentAccidentStatus();
        
        div.innerHTML = `
            <h5 class="icon slideopen">
                <a href="javascript:;" id="encar-accident-header" data-enlog-dt-eventnamegroup="필터">
                    사고유무
                    <span class="ic_bul"></span>
                </a>
            </h5>
            <div id="schAccident" class="depthpreant" style="display: none;">
                <div class="deparea">
                    <ul class="deplist">
                        <li>
                            <input type="checkbox" class="checkbox" id="schAccident_0" data-enlog-dt-eventnamegroup="필터" ${accidentStatus === 'N' ? 'checked="checked"' : ''}>
                            <label for="schAccident_0">무사고</label>
                            <em>-</em>
                        </li>
                        <li>
                            <input type="checkbox" class="checkbox" id="schAccident_1" data-enlog-dt-eventnamegroup="필터" ${accidentStatus === 'Y' ? 'checked="checked"' : ''}>
                            <label for="schAccident_1">사고 있음</label>
                            <em>-</em>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        // 드롭다운 토글 이벤트
        const headerLink = div.querySelector('#encar-accident-header');
        headerLink.addEventListener('click', toggleAccidentDropdown);
        
        // 체크박스 이벤트
        const checkboxes = div.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => handleAccidentCheckboxChange(e, index));
        });
        
        return div;
    }
    
    // 현재 사고 필터 상태 확인
    function getCurrentAccidentStatus() {
        try {
            const hash = window.location.hash;
            if (!hash || !hash.startsWith('#!')) return 'none';
            
            // URL 디코딩
            const encodedData = hash.substring(2); // #! 제거
            const decodedData = decodeURIComponent(encodedData);
            
            // JSON 파싱
            const searchData = JSON.parse(decodedData);
            
            if (!searchData.action) return 'none';
            
            // 사고 필터 상태 확인
            if (searchData.action.includes('_.Accident.N.')) {
                return 'N'; // 무사고
            } else if (searchData.action.includes('_.Accident.Y.')) {
                return 'Y'; // 사고 있음
            } else {
                return 'none'; // 전체
            }
        } catch (error) {
            console.log('URL 파싱 오류:', error);
            return 'none';
        }
    }
    
    // URL에서 무사고 필터 상태 확인 (이전 버전 호환)
    function checkAccidentFilterInURL() {
        return getCurrentAccidentStatus() === 'N';
    }
    
    // 드롭다운 토글
    function toggleAccidentDropdown(event) {
        event.preventDefault();
        
        const dropdown = document.querySelector('#schAccident');
        if (dropdown) {
            const isVisible = dropdown.style.display !== 'none';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            // 아이콘 상태 변경
            const parent = event.target.closest('.schset');
            if (isVisible) {
                parent.classList.remove('open');
            } else {
                parent.classList.add('open');
            }
        }
    }
    
    // 체크박스 변경 처리
    function handleAccidentCheckboxChange(event, index) {
        const checkbox = event.target;
        const checkboxes = document.querySelectorAll('#schAccident input[type="checkbox"]');
        
        if (checkbox.checked) {
            // 체크된 경우: 다른 체크박스들 해제
            checkboxes.forEach((cb, i) => {
                if (i !== index) {
                    cb.checked = false;
                }
            });
            
            // 필터 적용
            let filterType;
            switch (index) {
                case 0: // 무사고
                    filterType = 'N';
                    break;
                case 1: // 사고 있음
                    filterType = 'Y';
                    break;
            }
            
            updateAccidentFilter(filterType);
        } else {
            // 체크 해제된 경우: 필터 제거 (전체로 되돌림)
            updateAccidentFilter('none');
        }
    }
    
    // 사고 필터 업데이트
    function updateAccidentFilter(filterType) {
        try {
            const hash = window.location.hash;
            let searchData = {};
            
            // 기존 URL 데이터 파싱
            if (hash && hash.startsWith('#!')) {
                const encodedData = hash.substring(2);
                const decodedData = decodeURIComponent(encodedData);
                searchData = JSON.parse(decodedData);
            }
            
            // action 초기화
            if (!searchData.action) {
                searchData.action = '(And.Hidden.N.)';
            }
            
            // 기존 사고 필터 제거
            searchData.action = searchData.action
                .replace(/\._\.Accident\.N\._\./g, '._.')
                .replace(/\._\.Accident\.Y\._\./g, '._.')
                .replace(/\._\.Accident\.N\./g, '')
                .replace(/\._\.Accident\.Y\./g, '');
            
            // 새 필터 추가
            if (filterType !== 'none') {
                const accidentFilter = `_.Accident.${filterType}.`;
                
                if (searchData.action.includes('Hidden.N._.')) {
                    searchData.action = searchData.action.replace('Hidden.N._.', `Hidden.N.${accidentFilter}_.`);
                } else if (searchData.action.includes('Hidden.N.')) {
                    searchData.action = searchData.action.replace('Hidden.N.', `Hidden.N.${accidentFilter}`);
                } else {
                    searchData.action = searchData.action.replace('(And.', `(And.Hidden.N.${accidentFilter}`);
                }
            }
            
            // 페이지를 1로 리셋
            searchData.page = 1;
            
            // URL 업데이트
            const newEncodedData = encodeURIComponent(JSON.stringify(searchData));
            const newURL = window.location.pathname + window.location.search + '#!' + newEncodedData;
            
            console.log('사고 필터 업데이트:', filterType);
            
            // 페이지 리로드
            window.location.href = newURL;
            
        } catch (error) {
            console.error('사고 필터 업데이트 오류:', error);
        }
    }

    // 무사고 필터 토글 (이전 버전 호환)
    function toggleAccidentFilter(event) {
        event.preventDefault();
        
        try {
            const hash = window.location.hash;
            let searchData = {};
            
            // 기존 URL 데이터 파싱
            if (hash && hash.startsWith('#!')) {
                const encodedData = hash.substring(2);
                const decodedData = decodeURIComponent(encodedData);
                searchData = JSON.parse(decodedData);
            }
            
            // action 초기화
            if (!searchData.action) {
                searchData.action = '(And.Hidden.N.)';
            }
            
            // 무사고 필터 토글
            if (searchData.action.includes('_.Accident.N.')) {
                // 제거 - _.Accident.N._ 패턴 제거
                searchData.action = searchData.action.replace(/\._\.Accident\.N\._\./g, '._.');
                console.log('무사고 필터 제거');
            } else {
                // 추가 - Hidden.N._.XXX 패턴에서 Hidden.N._.Accident.N._.XXX로 변경
                if (searchData.action.includes('Hidden.N._.')) {
                    searchData.action = searchData.action.replace('Hidden.N._.', 'Hidden.N._.Accident.N._.');
                } else if (searchData.action.includes('Hidden.N.')) {
                    searchData.action = searchData.action.replace('Hidden.N.', 'Hidden.N._.Accident.N.');
                } else {
                    searchData.action = searchData.action.replace('(And.', '(And.Hidden.N._.Accident.N._.');
                }
                console.log('무사고 필터 추가');
            }
            
            // 페이지를 1로 리셋
            searchData.page = 1;
            
            // URL 업데이트
            const newEncodedData = encodeURIComponent(JSON.stringify(searchData));
            const newURL = window.location.pathname + window.location.search + '#!' + newEncodedData;
            
            // 페이지 리로드
            window.location.href = newURL;
            
        } catch (error) {
            console.error('무사고 필터 토글 오류:', error);
            // 오류 발생 시 간단한 방법으로 처리
            fallbackToggleAccidentFilter();
        }
    }
    
    // 대체 토글 방법 (오류 시)
    function fallbackToggleAccidentFilter() {
        const currentURL = window.location.href;
        const isActive = currentURL.includes('_.Accident.N.');
        
        if (isActive) {
            // 제거
            const newURL = currentURL.replace(/\._\.Accident\.N\./g, '');
            window.location.href = newURL;
        } else {
            // 추가 - 간단한 방법으로 URL에 추가
            const hash = window.location.hash || '#!{"action":"(And.Hidden.N.)","page":1}';
            const newURL = currentURL.replace(hash, '') + hash.replace('Hidden.N.', 'Hidden.N._.Accident.N.');
            window.location.href = newURL;
        }
    }
    
    // 초기화 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM이 이미 로드된 경우
        setTimeout(init, 500);
    }
    
    // URL 변경 감지 (SPA 방식 대응)
    let currentURL = window.location.href;
    setInterval(() => {
        if (currentURL !== window.location.href) {
            currentURL = window.location.href;
            setTimeout(init, 500);
        }
    }, 1000);
    
})();