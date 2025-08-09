// Encar Power Search - Background Script (Service Worker)
// Chrome Extension의 백그라운드 처리

// Extension 설치 시 초기화
chrome.runtime.onInstalled.addListener(() => {
    console.log('Encar Power Search extension installed');
});

// Promise 거부로 인한 에러를 억제하기 위한 안전 래퍼
function setBadgeTextSafe(params) {
    try {
        const maybePromise = chrome.action.setBadgeText(params);
        if (maybePromise && typeof maybePromise.catch === 'function') {
            maybePromise.catch(() => {});
        }
    } catch (_) {
        // 탭이 이미 닫혔거나 접근 불가한 경우 무시
    }
}

function setBadgeBackgroundColorSafe(params) {
    try {
        const maybePromise = chrome.action.setBadgeBackgroundColor(params);
        if (maybePromise && typeof maybePromise.catch === 'function') {
            maybePromise.catch(() => {});
        }
    } catch (_) {
        // 탭이 이미 닫혔거나 접근 불가한 경우 무시
    }
}

// 탭 업데이트 시 아이콘 상태 변경 (완료 시에만 처리)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') {
        return;
    }

    const isEncarPage = Boolean(tab && typeof tab.url === 'string' && tab.url.includes('encar.com'));

    if (isEncarPage) {
        setBadgeTextSafe({ text: 'ON', tabId });
        setBadgeBackgroundColorSafe({ color: '#ff6b35', tabId });
    } else {
        setBadgeTextSafe({ text: '', tabId });
    }
});