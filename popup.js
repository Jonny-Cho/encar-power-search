// Encar Power Search - Popup Script
// Extension 팝업 UI 제어

document.addEventListener('DOMContentLoaded', function() {
    const noAccidentToggle = document.getElementById('noAccidentToggle');
    const autoFilterToggle = document.getElementById('autoFilterToggle');
    const notificationToggle = document.getElementById('notificationToggle');
    const saveStateToggle = document.getElementById('saveStateToggle');
    const applyBtn = document.getElementById('applyBtn');
    const statusElement = document.getElementById('status');
    
    // 설정 로드
    loadSettings();
    
    // 토글 스위치 이벤트 리스너
    noAccidentToggle.addEventListener('click', () => toggleSwitch(noAccidentToggle));
    autoFilterToggle.addEventListener('click', () => toggleSwitch(autoFilterToggle));
    notificationToggle.addEventListener('click', () => toggleSwitch(notificationToggle));
    saveStateToggle.addEventListener('click', () => toggleSwitch(saveStateToggle));
    
    // 적용 버튼 이벤트
    applyBtn.addEventListener('click', applySettings);
    
    // 토글 스위치 상태 변경
    function toggleSwitch(toggle) {
        toggle.classList.toggle('active');
        updateStatus();
    }
    
    // 설정 로드
    function loadSettings() {
        chrome.storage.local.get([
            'noAccidentFilter',
            'autoFilter',
            'showNotifications',
            'saveState'
        ], function(result) {
            if (result.noAccidentFilter) {
                noAccidentToggle.classList.add('active');
            }
            if (result.autoFilter) {
                autoFilterToggle.classList.add('active');
            }
            if (result.showNotifications !== false) { // 기본값 true
                notificationToggle.classList.add('active');
            }
            if (result.saveState !== false) { // 기본값 true
                saveStateToggle.classList.add('active');
            }
            
            updateStatus();
        });
    }
    
    // 설정 적용
    function applySettings() {
        const settings = {
            noAccidentFilter: noAccidentToggle.classList.contains('active'),
            autoFilter: autoFilterToggle.classList.contains('active'),
            showNotifications: notificationToggle.classList.contains('active'),
            saveState: saveStateToggle.classList.contains('active')
        };
        
        // 설정 저장
        chrome.storage.local.set(settings, function() {
            console.log('Settings saved:', settings);
            
            // 현재 탭에 설정 변경 알림
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && tabs[0].url.includes('encar.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: settings
                    });
                }
            });
            
            // 성공 피드백
            showFeedback('설정이 저장되었습니다!');
        });
    }
    
    // 상태 업데이트
    function updateStatus() {
        const isActive = noAccidentToggle.classList.contains('active');
        
        if (isActive) {
            statusElement.textContent = '무사고 필터가 활성화되어 있습니다';
            statusElement.className = 'status active';
        } else {
            statusElement.textContent = '필터가 비활성화되어 있습니다';
            statusElement.className = 'status inactive';
        }
    }
    
    // 피드백 표시
    function showFeedback(message) {
        const originalText = applyBtn.textContent;
        applyBtn.textContent = message;
        applyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            applyBtn.textContent = originalText;
            applyBtn.style.background = '#ff6b35';
        }, 2000);
    }
    
    // 현재 페이지 상태 확인
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url.includes('encar.com')) {
            // 엔카 페이지에서 실행 중
            statusElement.style.display = 'block';
        } else {
            // 다른 페이지
            statusElement.textContent = '엔카 페이지에서 사용 가능합니다';
            statusElement.className = 'status inactive';
        }
    });
});