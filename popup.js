// Encar Power Search - Popup Script
// Extension 팝업 UI 제어

document.addEventListener('DOMContentLoaded', function() {
    const currentPageElement = document.getElementById('currentPage');
    const extensionStatusElement = document.getElementById('extensionStatus');
    const versionInfoElement = document.getElementById('versionInfo');
    
    // 초기화
    loadVersionInfo();
    checkPageStatus();
    
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
});