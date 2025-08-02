// Encar Power Search - Popup Script
// Extension 팝업 UI 제어

document.addEventListener('DOMContentLoaded', function() {
    const currentPageElement = document.getElementById('currentPage');
    const extensionStatusElement = document.getElementById('extensionStatus');
    const versionInfoElement = document.getElementById('versionInfo');
    const hidePhotoToggle = document.getElementById('hidePhotoSection');
    
    // 초기화
    loadVersionInfo();
    checkPageStatus();
    loadPhotoSectionSettings();
    
    // 사진우대 섹션 토글 이벤트
    hidePhotoToggle.addEventListener('change', function() {
        savePhotoSectionSettings(this.checked);
        updateActiveTab();
    });
    
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
    
    // 활성 탭에 메시지 전송
    function updateActiveTab() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('encar.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'togglePhotoSection',
                    hidePhotoSection: hidePhotoToggle.checked
                });
            }
        });
    }
});