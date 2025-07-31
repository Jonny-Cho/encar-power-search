# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 엔카 파워 서치 - Chrome 확장 프로그램 개발 가이드

## 📋 프로젝트 개요

**Encar Power Search**는 엔카(encar.com) 사이트에서 무사고 차량만 필터링할 수 있는 Chrome 확장 프로그램입니다.

## 🎯 핵심 목표

- 엔카 검색 결과에서 사고 이력 차량 필터링
- 원클릭으로 무사고 차량만 표시
- 기존 엔카 UI와 자연스러운 통합
- 가벼운 성능 (Vanilla JS 사용)

## 🛠️ 기술 스택

- **Chrome Extension**: Manifest V3
- **언어**: Vanilla JavaScript (ES6+)
- **스타일**: CSS3
- **저장소**: Chrome Storage API
- **빌드**: 없음 (순수 JS)

## 🔧 개발 명령어

### 확장 프로그램 테스트
```bash
# Chrome에서 확장 프로그램 로드
# 1. chrome://extensions/ 접속
# 2. 개발자 모드 활성화
# 3. "압축해제된 확장 프로그램 로드" 클릭
# 4. 프로젝트 폴더 선택
```

### 개발 중 확장 프로그램 새로고침
```bash
# 코드 변경 후:
# 1. chrome://extensions/ 접속
# 2. 확장 프로그램의 새로고침 버튼 클릭
# 3. encar.com 페이지 새로고침하여 변경사항 테스트
```

### 디버그 콘솔 접근
```bash
# content script 디버깅:
# F12 -> 콘솔 (encar.com 페이지에서)

# popup 디버깅:
# 확장 프로그램 아이콘 우클릭 -> 팝업 검사

# background script 디버깅:
# chrome://extensions/ -> 세부정보 -> 뷰 검사: 백그라운드 페이지
```

## 📁 프로젝트 구조

```
encar-power-search/
├── manifest.json           # Extension 설정
├── content.js             # 엔카 페이지 DOM 조작 (메인 로직)
├── popup.html/js          # 설정 UI
├── background.js          # Service Worker
├── styles.css             # UI 스타일
└── icons/                 # Extension 아이콘
```

## 🚧 현재 상태

### ✅ 완료된 작업
- [x] 프로젝트 구조 및 기본 파일 생성
- [x] Manifest V3 설정
- [x] 팝업 UI 구현 (토글 스위치, 설정)
- [x] CSS 스타일링 (반응형, 다크모드 대응)
- [x] Background Script (Service Worker)
- [x] GitHub 저장소 생성 및 첫 커밋

## 🏗️ 핵심 아키텍처

### 주요 구성 요소
- **content.js**: 엔카 검색 페이지에 사고유무 필터 UI를 주입하고, URL 해시 파라미터를 조작하여 필터링 수행
- **popup.js**: 확장 프로그램 상태 표시 및 설정, background script와 통신
- **background.js**: 확장 프로그램 상태 관리, 탭 업데이트 처리, 뱃지 표시기 설정
- **URL 조작 방식**: 엔카의 해시 기반 검색 파라미터(#!{JSON}) 구조를 활용한 필터 적용

### 엔카 URL 구조 이해
```javascript
// 엔카 검색 URL 예시
// https://www.encar.com/searchList#!{"action":"(And.Hidden.N._.Accident.N._.)","page":1}

// 무사고 필터: _.Accident.N._
// 사고차량 필터: _.Accident.Y._
// 필터 제거: action에서 _.Accident.* 패턴 제거
```

### 🔄 다음 작업
- [x] **content.js 구현** (핵심 기능 완료)
  - [x] 엔카 페이지 DOM 구조 분석
  - [x] 무사고 필터 버튼 추가
  - [x] 사고 이력 차량 식별 로직
  - [x] 필터링 기능 구현
- [x] 아이콘 파일 추가 (16px, 48px, 128px)
- [ ] 실제 엔카 사이트에서 테스트 및 버그 수정

## 🎨 UI/UX 가이드라인

### 색상 팔레트
- **주색상**: #ff6b35 (엔카 오렌지)
- **보조색상**: #28a745 (성공/활성 상태)
- **배경**: #f8f9fa (연한 회색)

### 버튼 디자인
- 그라디언트 배경
- 아이콘 + 텍스트 조합
- 호버 애니메이션 (translateY)
- 둥근 모서리 (6px border-radius)

## 🔍 엔카 사이트 분석 필요사항

### DOM 구조 파악 필요
1. **검색 결과 컨테이너** 선택자 찾기
2. **개별 차량 아이템** 선택자 찾기
3. **사고 이력 표시** 요소 찾기
4. **필터 영역** 위치 파악

### 사고 이력 식별 키워드
- "사고", "교환", "수리", "침수", "전손"
- "무사고", "무교환" (제외 조건)
- 특정 CSS 클래스나 아이콘

## ⚠️ 중요 주의사항

### Git 커밋/PR 규칙
- **커밋 컨벤션**: Angular Commit Message Convention 사용
- **Co-Author 금지**: Claude 관련 내용 제거
- **메시지 형식**: 
  ```
  <type>(<scope>): <subject>
  
  <body>
  
  <footer>
  ```

#### 커밋 타입 (Type)
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드 스크립트, 패키지 매니저 설정 등

#### 스코프 (Scope) - 선택사항
- **content**: content.js 관련
- **popup**: popup UI 관련  
- **background**: background.js 관련
- **styles**: CSS 스타일 관련
- **manifest**: manifest.json 관련

#### 언어 규칙
- **타입, 스코프, 제목**: 영어 사용
- **본문(body)**: 한글 사용 가능
- **제목은 50자 이내**, 본문은 72자마다 줄바꿈

#### 예시
```bash
feat(content): add no-accident filter button to search results

엔카 검색 결과 페이지에 무사고 차량 필터링 버튼을 추가합니다.
- 기존 필터 영역에 자연스럽게 통합
- 클릭 시 사고 이력 차량 숨김/표시 토글
- 필터 상태를 Chrome Storage에 저장

fix(popup): resolve toggle switch state persistence issue

토글 스위치 상태가 저장되지 않던 문제를 수정합니다.
팝업을 다시 열었을 때 이전 설정이 유지되도록 개선하였습니다.

docs: update CLAUDE.md commit convention

CLAUDE.md에 Angular 커밋 컨벤션 규칙을 추가했습니다.

style(content): improve button hover animations

버튼 호버 효과를 더 부드럽게 개선하고 접근성을 향상시켰습니다.
```

### 개발 규칙
- **Vanilla JS만 사용** (프레임워크 금지)
- **!important 최소화** (CSS에서)
- **엔카 기존 스타일과 충돌 방지**
- **성능 최적화** (DOM 조작 최소화)

### 보안 고려사항
- 사용자 데이터 수집 금지
- 외부 서버 통신 금지
- Chrome Storage API만 사용

## 🧪 테스트 체크리스트

### Chrome Extension 로드
1. `chrome://extensions/` 접속
2. 개발자 모드 활성화
3. "압축해제된 확장 프로그램 로드" 클릭
4. 프로젝트 폴더 선택

### 기능 테스트
- [ ] 엔카 사이트에서 extension 로드 확인
- [ ] 필터 버튼 표시 확인
- [ ] 무사고 필터링 동작 확인
- [ ] 팝업 설정 동작 확인
- [ ] 설정 저장/로드 확인

## 🔧 개발 환경

### VS Code 권장 확장
- ESLint
- Prettier
- Chrome Extension Development

### 디버깅 도구
- Chrome Developer Tools
- Extension 개발자 도구
- Console 로그 활용

## 📚 참고 자료

### Chrome Extension 개발
- [Manifest V3 공식 문서](https://developer.chrome.com/docs/extensions/mv3/)
- [Content Scripts 가이드](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

### 엔카 사이트
- 메인: https://www.encar.com
- 검색: https://www.encar.com/searchList

## 🚀 배포 계획

1. **로컬 테스트 완료**
2. **아이콘 및 스크린샷 준비**
3. **Chrome Web Store 등록 고려**
4. **사용자 피드백 수집**

---

💡 **개발 시 이 파일을 항상 참고하여 일관성 있는 개발을 진행하세요.**