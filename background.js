// Encar Power Search - Background Script (Service Worker)
// Chrome Extension의 백그라운드 처리

// Extension 설치 시 초기화
chrome.runtime.onInstalled.addListener(() => {
    console.log('Encar Power Search extension installed');
});

// 탭 업데이트 시 아이콘 상태 변경
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('encar.com')) {
        // 엔카 페이지에서 확장 아이콘 활성화
        chrome.action.setBadgeText({
            text: 'ON',
            tabId: tabId
        });
        chrome.action.setBadgeBackgroundColor({
            color: '#ff6b35',
            tabId: tabId
        });
    } else {
        // 다른 페이지에서는 뱃지 제거
        chrome.action.setBadgeText({
            text: '',
            tabId: tabId
        });
    }
});