// Encar Power Search - Popup Script
// Extension 팝업 UI 제어

document.addEventListener('DOMContentLoaded', function() {
    const currentPageElement = document.getElementById('currentPage');
    const extensionStatusElement = document.getElementById('extensionStatus');
    const versionInfoElement = document.getElementById('versionInfo');
    const hidePhotoToggle = document.getElementById('hidePhotoSection');
    const hidePriorityToggle = document.getElementById('hidePrioritySection');
    const showUsageHistoryToggle = document.getElementById('showUsageHistory');
    const showInsuranceHistoryToggle = document.getElementById('showInsuranceHistory');
    const showOwnerHistoryToggle = document.getElementById('showOwnerHistory');
    const showNoInsuranceHistoryToggle = document.getElementById('showNoInsuranceHistory');
  const openReviewLinkBtn = document.getElementById('openReviewLink');
    
    // 초기화
    loadVersionInfo();
    checkPageStatus();
    loadPhotoSectionSettings();
    loadPrioritySectionSettings();
    loadUsageHistorySettings();
    loadInsuranceHistorySettings();
    loadOwnerHistorySettings();
    loadNoInsuranceHistorySettings();
    
    // 사진우대 섹션 토글 이벤트
    hidePhotoToggle.addEventListener('change', function() {
        savePhotoSectionSettings(this.checked);
        updateActiveTab();
    });
    
    // 우대등록 섹션 토글 이벤트
    hidePriorityToggle.addEventListener('change', function() {
        savePrioritySectionSettings(this.checked);
        updateActiveTab();
    });
    
    // 사용이력 표시 토글 이벤트
    showUsageHistoryToggle.addEventListener('change', function() {
        saveUsageHistorySettings(this.checked);
        updateActiveTab();
    });
    
    // 보험사고 이력 표시 토글 이벤트
    showInsuranceHistoryToggle.addEventListener('change', function() {
        saveInsuranceHistorySettings(this.checked);
        updateActiveTab();
    });
    
    // 소유자 변경이력 표시 토글 이벤트
    showOwnerHistoryToggle.addEventListener('change', function() {
        saveOwnerHistorySettings(this.checked);
        updateActiveTab();
    });
    
    // 보험 미가입기간 표시 토글 이벤트
    showNoInsuranceHistoryToggle.addEventListener('change', function() {
        saveNoInsuranceHistorySettings(this.checked);
        updateActiveTab();
    });

  // 리뷰 링크 열기
  if (openReviewLinkBtn) {
    openReviewLinkBtn.addEventListener('click', function() {
      const url = 'https://chromewebstore.google.com/detail/encar-power-search/fekacphpglpdpebddjfbjdcpljhdaoge/reviews';
      // 새 탭으로 오픈
      chrome.tabs.create({ url });
    });
  }
    
    // 페이지 상태 확인
    function checkPageStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                const currentTab = tabs[0];
                
                if (currentTab.url.includes('encar.com')) {
                    // 엔카 페이지
                    currentPageElement.textContent = '엔카 (encar.com)';
                    currentPageElement.className = 'status-value active';
                    extensionStatusElement.textContent = '활성화';
                    extensionStatusElement.className = 'status-value active';
                    
                    // 검색 페이지인지 확인
                    if (currentTab.url.includes('carsearchlist') || currentTab.url.includes('searchList')) {
                        currentPageElement.textContent = '엔카 검색 페이지';
                    }
                } else {
                    // 다른 페이지
                    currentPageElement.textContent = '엔카 외 페이지';
                    currentPageElement.className = 'status-value inactive';
                    extensionStatusElement.textContent = '대기 중';
                    extensionStatusElement.className = 'status-value inactive';
                }
            } else {
                currentPageElement.textContent = '페이지 확인 불가';
                currentPageElement.className = 'status-value inactive';
            }
        });
    }
    
    // 버전 정보 로드
    function loadVersionInfo() {
        const manifest = chrome.runtime.getManifest();
        versionInfoElement.textContent = `${manifest.name} v${manifest.version}`;
    }
    
    // 사진우대 섹션 설정 로드
    function loadPhotoSectionSettings() {
        chrome.storage.sync.get(['hidePhotoSection'], function(result) {
            const isHidden = result.hidePhotoSection || false;
            hidePhotoToggle.checked = isHidden;
        });
    }
    
    // 사진우대 섹션 설정 저장
    function savePhotoSectionSettings(isHidden) {
        chrome.storage.sync.set({
            hidePhotoSection: isHidden
        }, function() {
            console.log('Photo section setting saved:', isHidden);
        });
    }
    
    // 우대등록 섹션 설정 로드
    function loadPrioritySectionSettings() {
        chrome.storage.sync.get(['hidePrioritySection'], function(result) {
            const isHidden = result.hidePrioritySection || false;
            hidePriorityToggle.checked = isHidden;
        });
    }
    
    // 우대등록 섹션 설정 저장
    function savePrioritySectionSettings(isHidden) {
        chrome.storage.sync.set({
            hidePrioritySection: isHidden
        }, function() {
            console.log('Priority section setting saved:', isHidden);
        });
    }
    
    // 사용이력 표시 설정 로드
    function loadUsageHistorySettings() {
        chrome.storage.sync.get(['showUsageHistory'], function(result) {
            const isEnabled = result.showUsageHistory !== false; // 기본값 true
            showUsageHistoryToggle.checked = isEnabled;
        });
    }
    
    // 사용이력 표시 설정 저장
    function saveUsageHistorySettings(isEnabled) {
        chrome.storage.sync.set({
            showUsageHistory: isEnabled
        }, function() {
            console.log('Usage history setting saved:', isEnabled);
        });
    }
    
    // 보험사고 이력 표시 설정 로드
    function loadInsuranceHistorySettings() {
        chrome.storage.sync.get(['showInsuranceHistory'], function(result) {
            const isEnabled = result.showInsuranceHistory !== false; // 기본값 true
            showInsuranceHistoryToggle.checked = isEnabled;
        });
    }
    
    // 보험사고 이력 표시 설정 저장
    function saveInsuranceHistorySettings(isEnabled) {
        chrome.storage.sync.set({
            showInsuranceHistory: isEnabled
        }, function() {
            console.log('Insurance history setting saved:', isEnabled);
        });
    }
    
    // 소유자 변경이력 표시 설정 로드
    function loadOwnerHistorySettings() {
        chrome.storage.sync.get(['showOwnerHistory'], function(result) {
            const isEnabled = result.showOwnerHistory !== false; // 기본값 true
            showOwnerHistoryToggle.checked = isEnabled;
        });
    }
    
    // 소유자 변경이력 표시 설정 저장
    function saveOwnerHistorySettings(isEnabled) {
        chrome.storage.sync.set({
            showOwnerHistory: isEnabled
        }, function() {
            console.log('Owner history setting saved:', isEnabled);
        });
    }
    
    // 보험 미가입기간 표시 설정 로드
    function loadNoInsuranceHistorySettings() {
        chrome.storage.sync.get(['showNoInsuranceHistory'], function(result) {
            const isEnabled = result.showNoInsuranceHistory !== false; // 기본값 true
            showNoInsuranceHistoryToggle.checked = isEnabled;
        });
    }
    
    // 보험 미가입기간 표시 설정 저장
    function saveNoInsuranceHistorySettings(isEnabled) {
        chrome.storage.sync.set({
            showNoInsuranceHistory: isEnabled
        }, function() {
            console.log('No insurance history setting saved:', isEnabled);
        });
    }
    
    // 활성 탭에 메시지 전송
    function updateActiveTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const tab = tabs && tabs[0];
            if (!tab || !tab.id || !tab.url || !tab.url.includes('encar.com')) return;
            // 콜백을 명시해 Promise 반환을 막고, 수신자가 없을 때의 오류를 삼킵니다
            chrome.tabs.sendMessage(tab.id, {
                action: 'toggleSections',
                hidePhotoSection: hidePhotoToggle.checked,
                hidePrioritySection: hidePriorityToggle.checked,
                showUsageHistory: showUsageHistoryToggle.checked,
                showInsuranceHistory: showInsuranceHistoryToggle.checked,
                showOwnerHistory: showOwnerHistoryToggle.checked,
                showNoInsuranceHistory: showNoInsuranceHistoryToggle.checked
            }, function() {
                // 수신자가 없으면 lastError가 설정됩니다
                if (chrome.runtime && chrome.runtime.lastError) {
                    // 필요시 디버그용으로만 남깁니다
                    // console.debug('No receiver for message:', chrome.runtime.lastError.message);
                }
            });
        });
    }
});