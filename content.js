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
        
        // 섹션 표시/숨김 처리
        handleSectionDisplay();
        
        // Pagerow 확장 처리
        handlePagerowExtension();
        
        // 초기 사용이력 설정 확인하여 처리하지 않음 (handleSectionDisplay에서 처리)
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
        
        // 기본적으로 열린 상태로 설정
        accidentFilter.classList.add('open');
        
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
            <div id="schAccident" class="depthpreant" style="display: block;">
                <div class="deparea">
                    <ul class="deplist">
                        <li>
                            <input type="checkbox" class="checkbox" id="schAccident_0" data-enlog-dt-eventnamegroup="필터" ${accidentStatus === 'N' ? 'checked="checked"' : ''}>
                            <label for="schAccident_0">무사고</label>
                            <em>-</em>
                        </li>
                        <li>
                            <input type="checkbox" class="checkbox" id="schAccident_1" data-enlog-dt-eventnamegroup="필터" ${accidentStatus === 'F' ? 'checked="checked"' : ''}>
                            <label for="schAccident_1">단순수리</label>
                            <em>-</em>
                        </li>
                        <li>
                            <input type="checkbox" class="checkbox" id="schAccident_2" data-enlog-dt-eventnamegroup="필터" ${accidentStatus === 'Y' ? 'checked="checked"' : ''}>
                            <label for="schAccident_2">사고 있음</label>
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
            } else if (searchData.action.includes('_.Accident.F.')) {
                return 'F'; // 단순수리
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
                case 1: // 단순수리
                    filterType = 'F';
                    break;
                case 2: // 사고 있음
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
                .replace(/\._\.Accident\.F\._\./g, '._.')
                .replace(/\._\.Accident\.Y\._\./g, '._.')
                .replace(/\._\.Accident\.N\./g, '')
                .replace(/\._\.Accident\.F\./g, '')
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

    // 섹션 표시/숨김 처리
    function handleSectionDisplay() {
        chrome.storage.sync.get(['hidePhotoSection', 'hidePrioritySection', 'showUsageHistory', 'showInsuranceHistory', 'showOwnerHistory', 'showNoInsuranceHistory'], function(result) {
            const hidePhoto = result.hidePhotoSection || false;
            const hidePriority = result.hidePrioritySection || false;
            const showUsageHistory = result.showUsageHistory !== false; // 기본값 true
            const showInsuranceHistory = result.showInsuranceHistory !== false; // 기본값 true
            const showOwnerHistory = result.showOwnerHistory !== false; // 기본값 true
            const showNoInsuranceHistory = result.showNoInsuranceHistory !== false; // 기본값 true
            
            togglePhotoSection(hidePhoto);
            togglePrioritySection(hidePriority);
            
            // 차량 이력 표시/숨김을 CSS 클래스로 제어
            updateVehicleHistoryVisibility(showUsageHistory, showInsuranceHistory, showOwnerHistory, showNoInsuranceHistory);
            
            // 차량 이력 처리는 항상 실행
            setTimeout(() => {
                processUsageHistory();
            }, 1000);
        });
    }
    
    // 사진우대 섹션 토글
    function togglePhotoSection(hide) {
        const photoSection = document.querySelector('.section.list.special');
        if (photoSection) {
            photoSection.style.display = hide ? 'none' : 'block';
            console.log('사진우대 섹션', hide ? '숨김' : '표시');
        } else {
            // 섹션이 아직 로드되지 않은 경우 재시도
            setTimeout(() => togglePhotoSection(hide), 1000);
        }
    }
    
    // 우대등록 섹션 토글
    function togglePrioritySection(hide) {
        const prioritySection = document.querySelector('.section.list[data-bind*="specialSearchResults"]:not(.special)');
        if (prioritySection) {
            prioritySection.style.display = hide ? 'none' : 'block';
            console.log('우대등록 섹션', hide ? '숨김' : '표시');
        } else {
            // 섹션이 아직 로드되지 않은 경우 재시도
            setTimeout(() => togglePrioritySection(hide), 1000);
        }
    }
    
    // 차량 이력 표시/숨김을 CSS 클래스로 제어
    function updateVehicleHistoryVisibility(showUsage, showInsurance, showOwner, showNoInsurance) {
        const body = document.body;
        
        // 사용이력 라벨 표시/숨김
        if (showUsage) {
            body.classList.remove('hide-usage-labels');
        } else {
            body.classList.add('hide-usage-labels');
        }
        
        // 보험사고 라벨 표시/숨김
        if (showInsurance) {
            body.classList.remove('hide-insurance-labels');
        } else {
            body.classList.add('hide-insurance-labels');
        }
        
        // 소유자 변경이력 라벨 표시/숨김
        if (showOwner) {
            body.classList.remove('hide-owner-labels');
        } else {
            body.classList.add('hide-owner-labels');
        }
        
        // 보험 미가입기간 라벨 표시/숨김
        if (showNoInsurance) {
            body.classList.remove('hide-noinsurance-labels');
        } else {
            body.classList.add('hide-noinsurance-labels');
        }
    }
    
    // popup.js에서 오는 메시지 처리
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'toggleSections') {
            togglePhotoSection(request.hidePhotoSection);
            togglePrioritySection(request.hidePrioritySection);
            
            // 차량 이력 표시/숨김을 CSS 클래스로 제어
            updateVehicleHistoryVisibility(request.showUsageHistory, request.showInsuranceHistory, request.showOwnerHistory, request.showNoInsuranceHistory);
            
            // 차량 이력 처리는 항상 실행 (아직 처리되지 않은 경우에만)
            setTimeout(() => {
                processUsageHistory();
            }, 500);
            
            // Pagerow 확장 설정 처리
            if (request.extendPagerow) {
                extendPagerowOptions();
            } else {
                restorePagerowOptions();
            }
            
            sendResponse({success: true});
        }
    });
    
    // ==============================================
    // Pagerow 확장 기능 (500개까지 보기 옵션 추가)
    // ==============================================
    
    // Pagerow 확장 처리 메인 함수
    function handlePagerowExtension() {
        chrome.storage.sync.get(['extendPagerow'], function(result) {
            const extendPagerow = result.extendPagerow !== false; // 기본값 true
            
            if (extendPagerow) {
                extendPagerowOptions();
            } else {
                restorePagerowOptions();
            }
        });
    }
    
    // Pagerow 옵션 확장 함수
    function extendPagerowOptions() {
        const pagerowSelect = findPagerowSelect();
        if (!pagerowSelect) {
            // 페이지 로드가 완료되지 않은 경우 재시도
            setTimeout(extendPagerowOptions, 1000);
            return;
        }
        
        // 이미 확장되었는지 확인
        if (pagerowSelect.hasAttribute('data-extended')) {
            return;
        }
        
        try {
            // knockout.js data-bind 속성 확장
            const dataBind = pagerowSelect.getAttribute('data-bind');
            if (dataBind && dataBind.includes('options: [20, 30, 40, 50]')) {
                const newDataBind = dataBind.replace(
                    'options: [20, 30, 40, 50]',
                    'options: [20, 30, 40, 50, 100, 200, 300, 400, 500]'
                );
                pagerowSelect.setAttribute('data-bind', newDataBind);
            }
            
            // 정적 option 태그들 추가
            const additionalOptions = [100, 200, 300, 400, 500];
            additionalOptions.forEach(value => {
                // 이미 존재하는지 확인
                const existingOption = pagerowSelect.querySelector(`option[value="${value}"]`);
                if (!existingOption) {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = `${value}개씩 보기`;
                    pagerowSelect.appendChild(option);
                }
            });
            
            // 확장 완료 표시
            pagerowSelect.setAttribute('data-extended', 'true');
            
            console.log('Encar Power Search: 페이지당 최대 500개 보기 옵션이 추가되었습니다.');
            
        } catch (error) {
            console.error('Encar Power Search: Pagerow 확장 중 오류 발생:', error);
        }
    }
    
    // Pagerow 옵션 복원 함수 (토글 해제 시)
    function restorePagerowOptions() {
        const pagerowSelect = findPagerowSelect();
        if (!pagerowSelect) {
            return;
        }
        
        try {
            // 확장된 option 태그들 제거 (100, 200, 300, 400, 500)
            const extendedOptions = [100, 200, 300, 400, 500];
            extendedOptions.forEach(value => {
                const option = pagerowSelect.querySelector(`option[value="${value}"]`);
                if (option) {
                    option.remove();
                }
            });
            
            // knockout.js data-bind 속성 복원
            const dataBind = pagerowSelect.getAttribute('data-bind');
            if (dataBind && dataBind.includes('options: [20, 30, 40, 50, 100, 200, 300, 400, 500]')) {
                const restoredDataBind = dataBind.replace(
                    'options: [20, 30, 40, 50, 100, 200, 300, 400, 500]',
                    'options: [20, 30, 40, 50]'
                );
                pagerowSelect.setAttribute('data-bind', restoredDataBind);
            }
            
            // 현재 선택된 값이 확장 옵션인 경우 기본값으로 변경
            const currentValue = parseInt(pagerowSelect.value);
            if (extendedOptions.includes(currentValue)) {
                pagerowSelect.value = '20'; // 기본값으로 복원
                
                // 엔카의 updateLimit 함수 호출 (있는 경우)
                if (typeof window.updateLimit === 'function') {
                    window.updateLimit('20');
                } else {
                    // 페이지 새로고침으로 변경사항 반영
                    const event = new Event('change', { bubbles: true });
                    pagerowSelect.dispatchEvent(event);
                }
            }
            
            // 확장 상태 해제
            pagerowSelect.removeAttribute('data-extended');
            
            console.log('Encar Power Search: 페이지당 개수 옵션이 원래대로 복원되었습니다.');
            
        } catch (error) {
            console.error('Encar Power Search: Pagerow 복원 중 오류 발생:', error);
        }
    }
    
    // Pagerow select 요소 찾기
    function findPagerowSelect() {
        // 우선순위 1: ID 선택자
        let pagerowSelect = document.querySelector('#pagerow');
        if (pagerowSelect) {
            return pagerowSelect;
        }
        
        // 우선순위 2: data-bind 속성으로 찾기
        pagerowSelect = document.querySelector('select[data-bind*="normalSearchResults().limit"]');
        if (pagerowSelect) {
            return pagerowSelect;
        }
        
        // 우선순위 3: options 패턴으로 찾기
        pagerowSelect = document.querySelector('select[data-bind*="options: [20, 30, 40, 50]"]');
        if (pagerowSelect) {
            return pagerowSelect;
        }
        
        return null;
    }
    
    // ==============================================
    // 용도이력 표시 기능 (Usage History Labels)
    // ==============================================

    // ==============================================
    // 보험 미가입 기간 계산 함수
    // ==============================================
    
    function calculateNoInsuranceMonths(periodString) {
        try {
            // "202103~202503" 형태의 문자열을 파싱
            if (!periodString || typeof periodString !== 'string') {
                return 0;
            }
            
            const parts = periodString.split('~');
            if (parts.length !== 2) {
                return 0;
            }
            
            const startYearMonth = parts[0].trim();
            const endYearMonth = parts[1].trim();
            
            // YYYYMM 형태인지 확인
            if (startYearMonth.length !== 6 || endYearMonth.length !== 6) {
                return 0;
            }
            
            const startYear = parseInt(startYearMonth.substring(0, 4));
            const startMonth = parseInt(startYearMonth.substring(4, 6));
            const endYear = parseInt(endYearMonth.substring(0, 4));
            const endMonth = parseInt(endYearMonth.substring(4, 6));
            
            // 유효한 날짜인지 확인
            if (isNaN(startYear) || isNaN(startMonth) || isNaN(endYear) || isNaN(endMonth) ||
                startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
                return 0;
            }
            
            // 개월 수 계산
            const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
            return Math.max(0, monthsDiff);
            
        } catch (error) {
            return 0;
        }
    }
    
    // ==============================================
    // 차량 이력 API 호출 함수 (용도이력 + 보험사고 이력)
    // ==============================================
    
    async function fetchVehicleHistory(vehicleId) {
        try {
            const apiUrl = `https://api.encar.com/v1/readside/record/vehicle/${vehicleId}/open`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // 모든 HTTP 에러를 조용히 처리 (로그 없음)
                return [];
            }
            
            const data = await response.json();
            const allLabels = [];
            
            // 사용이력 확인 (항상 처리)
            const carInfoUse1s = data.carInfoUse1s || [];
            const hasUsageHistory = Array.isArray(carInfoUse1s) && 
                                  carInfoUse1s.some(code => ["3", "4"].includes(code));
            
            if (hasUsageHistory) {
                allLabels.push({
                    text: "사용이력있음",
                    type: "usage"
                });
            }
            
            // 보험사고 이력 확인 (항상 처리)
            const myAccidents = data.accidents?.filter(acc => acc.type === "1" || acc.type === "2") || [];
            if (myAccidents.length > 0) {
                const totalCost = myAccidents.reduce((sum, acc) => 
                    sum + (acc.partCost || 0) + (acc.laborCost || 0) + (acc.paintingCost || 0), 0
                );
                
                allLabels.push({
                    text: `내차 보험사고 ${myAccidents.length}회 / ${totalCost.toLocaleString()}원`,
                    type: "insurance"
                });
            }
            
            // 소유자 변경이력 확인 (항상 처리)
            const ownerChanges = data.ownerChanges;
            if (ownerChanges && Array.isArray(ownerChanges) && ownerChanges.length > 0) {
                allLabels.push({
                    text: `소유자 변경 ${ownerChanges.length}회`,
                    type: "owner"
                });
            }
            
            // 보험 미가입 기간 확인 (항상 처리)
            const noInsurancePeriods = [
                data.notJoinDate1,
                data.notJoinDate2,
                data.notJoinDate3,
                data.notJoinDate4,
                data.notJoinDate5
            ].filter(period => period && period.trim() !== '');
            
            if (noInsurancePeriods.length > 0) {
                let totalMonths = 0;
                
                noInsurancePeriods.forEach(period => {
                    const months = calculateNoInsuranceMonths(period);
                    totalMonths += months;
                });
                
                if (totalMonths > 0) {
                    allLabels.push({
                        text: `보험 미가입 ${totalMonths}개월`,
                        type: "noinsurance"
                    });
                }
            }
            
            return allLabels;
            
        } catch (error) {
            // 네트워크 오류도 조용히 처리 (로그 없음)
            return [];
        }
    }

    // ==============================================
    // 메인 처리 함수 (차량 이력 처리)
    // ==============================================

    async function processUsageHistory() {
        try {
            // 일반 검색 결과와 사진우대영역 차량들을 모두 가져오기
            const carRows = document.querySelectorAll('tr[data-index]');
            const photoRows = document.querySelectorAll('#sr_photo li[data-index]');
            
            // 두 NodeList를 배열로 합치기
            const allCarElements = [...Array.from(carRows), ...Array.from(photoRows)];
            
            if (allCarElements.length === 0) {
                return;
            }
            
            // 배치 처리 설정
            const batchSize = 200;
            const delay = 500;
            
            for (let i = 0; i < allCarElements.length; i += batchSize) {
                const batch = allCarElements.slice(i, i + batchSize);
                
                const promises = batch.map(async (element) => {
                    try {
                        // 일반 검색 결과인지 사진우대영역인지 구분
                        const isPhotoArea = element.tagName === 'LI';
                        let firstImg;
                        
                        if (isPhotoArea) {
                            // 사진우대영역: li > a > span.img > span > img.thumb
                            firstImg = element.querySelector('img.thumb');
                        } else {
                            // 일반 검색결과: tr > td.img > img.thumb
                            firstImg = element.querySelector('td.img img.thumb');
                        }
                        
                        if (!firstImg) return { success: false };
                        
                        // vehicleId 추출
                        let vehicleId = null;
                        let imgMatch = firstImg.src.match(/pic\d+\/(\d+)_\d+\.jpg/);
                        if (imgMatch) {
                            vehicleId = imgMatch[1];
                        } else {
                            const dataSrc = firstImg.getAttribute('data-src');
                            if (dataSrc) {
                                imgMatch = dataSrc.match(/pic\d+\/(\d+)_\d+\.jpg/);
                                if (imgMatch) {
                                    vehicleId = imgMatch[1];
                                }
                            }
                        }
                        
                        if (!vehicleId || element.hasAttribute('data-usage-processed')) {
                            return { success: false };
                        }
                        
                        const vehicleLabels = await fetchVehicleHistory(vehicleId);
                        
                        if (vehicleLabels.length > 0) {
                            let serviceLabelList;
                            
                            if (isPhotoArea) {
                                // 사진우대영역: li > a > span.service_label_list
                                serviceLabelList = element.querySelector('.service_label_list');
                            } else {
                                // 일반 검색결과: tr > td.inf > .service_label_list
                                serviceLabelList = element.querySelector('td.inf .service_label_list');
                            }
                            
                            if (serviceLabelList) {
                                addVehicleLabelsToRow(serviceLabelList, vehicleLabels);
                                element.setAttribute('data-usage-processed', 'true');
                                return { success: true, count: vehicleLabels.length };
                            }
                        } else {
                            element.setAttribute('data-usage-processed', 'true');
                        }
                        
                        return { success: true, count: 0 };
                    } catch (error) {
                        return { success: false };
                    }
                });
                
                await Promise.all(promises);
                
                // 배치 간 지연
                if (i + batchSize < allCarElements.length) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
        } catch (error) {
            console.error('Encar Power Search: 용도이력 처리 중 치명적 오류', error);
        }
    }
    
    // ==============================================
    // 차량 이력 라벨 추가 함수 (TR 단위 처리)
    // ==============================================
    
    function addVehicleLabelsToRow(serviceLabelList, vehicleLabels) {
        // 기존 차량 이력 라벨 제거 (중복 방지)
        const existingUsageLabels = serviceLabelList.querySelectorAll('.usage-history-label');
        const existingInsuranceLabels = serviceLabelList.querySelectorAll('.insurance-history-label');
        const existingOwnerLabels = serviceLabelList.querySelectorAll('.owner-change-label');
        const existingNoInsuranceLabels = serviceLabelList.querySelectorAll('.noinsurance-label');
        existingUsageLabels.forEach(label => label.remove());
        existingInsuranceLabels.forEach(label => label.remove());
        existingOwnerLabels.forEach(label => label.remove());
        existingNoInsuranceLabels.forEach(label => label.remove());
        
        // 각 차량 이력 라벨 생성
        vehicleLabels.forEach(labelData => {
            const label = document.createElement('span');
            
            // 타입에 따라 다른 CSS 클래스 적용
            if (labelData.type === 'usage') {
                label.className = 'usage-history-label';
            } else if (labelData.type === 'insurance') {
                label.className = 'insurance-history-label';
            } else if (labelData.type === 'owner') {
                label.className = 'owner-change-label';
            } else if (labelData.type === 'noinsurance') {
                label.className = 'noinsurance-label';
            }
            
            label.textContent = labelData.text;
            serviceLabelList.appendChild(label);
        });
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
