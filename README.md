# 🚗 Encar Power Search

> 엔카 무사고 차량 필터링 및 고급 검색을 위한 Chrome 확장 프로그램

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?style=flat-square&logo=google-chrome)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)](LICENSE)

엔카(encar.com)에서 중고차를 검색할 때 **무사고 차량만 빠르게 필터링**할 수 있는 Chrome 확장 프로그램입니다.

## ✨ 주요 기능

🔍 **스마트 필터링**
- 무사고 차량만 원클릭으로 필터링
- 사고 이력 차량 자동 숨김/표시
- 실시간 필터링 결과 표시

⚙️ **사용자 설정**
- 필터 상태 자동 저장
- 자동 필터 적용 옵션
- 알림 표시 설정

🎨 **직관적인 UI**
- 엔카 사이트와 자연스러운 통합
- 모바일 반응형 디자인
- 접근성 고려 설계

## 📋 프로젝트 구조

```
encar-power-search/
├── manifest.json           # Chrome Extension 설정 파일
├── content.js             # 엔카 페이지 DOM 조작 스크립트
├── popup.html             # Extension 클릭시 나타나는 팝업
├── popup.js               # 팝업 기능 스크립트
├── styles.css             # 스타일 정의
├── background.js          # Service Worker
└── icons/                 # Extension 아이콘들
    └── README.md          # 아이콘 가이드라인
```


## ⚙️ 기술 스택

| 분야 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **Extension** | Manifest V3 | 3.0 | Chrome Extension 표준 |
| **언어** | Vanilla JavaScript | ES6+ | 가벼운 성능과 빠른 로딩 |
| **스타일** | CSS3 | - | 모던한 UI 스타일링 |
| **저장소** | Chrome Storage API | - | 설정 데이터 저장 |
| **빌드** | 없음 | - | 순수 JavaScript (번들링 불필요) |

## 📊 개발 진행 상태

### ✅ 완료된 작업
- [x] **프로젝트 구조 설정** - 폴더 구조 및 기본 파일 생성
- [x] **Manifest V3 설정** - Chrome Extension 메타데이터 정의
- [x] **팝업 UI 구현** - 설정 인터페이스 및 토글 스위치
- [x] **스타일링 시스템** - CSS 변수, 반응형 디자인, 다크모드 대응
- [x] **Background Script** - Service Worker 및 탭 상태 관리
- [x] **Git 저장소 초기화** - 버전 관리 시스템 설정

### 🚧 진행 중인 작업
- [ ] **Content Script 구현** - 엔카 페이지 DOM 조작 로직
- [ ] **필터링 알고리즘** - 무사고 차량 식별 및 필터링
- [ ] **아이콘 디자인** - 16px, 48px, 128px 크기별 아이콘

### 📋 예정된 작업
- [ ] **테스트 및 디버깅** - 다양한 엔카 페이지에서 동작 검증
- [ ] **성능 최적화** - DOM 조작 최적화 및 메모리 사용량 개선
- [ ] **사용자 피드백 반영** - 실제 사용 시 발견되는 이슈 수정

## 🛠️ 개발 환경

### 필수 도구
- **Chrome 브라우저** (v88+) - Manifest V3 지원
- **코드 에디터** - VS Code, WebStorm 등
- **Chrome Developer Tools** - 디버깅 및 성능 분석

### 권장 확장 프로그램 (VS Code)
```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## 🤝 기여하기

### 🐛 버그 리포트
이슈를 발견하셨나요? [Issue](https://github.com/Jonny-Cho/encar-power-search/issues)를 생성해 주세요.

### 💡 기능 제안
새로운 기능 아이디어가 있으시면 언제든 제안해 주세요!

### 🔧 개발 참여
1. 이 저장소를 Fork
2. 새 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

```
MIT License

Copyright (c) 2025 Encar Power Search

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## ⚠️ 면책 조항

- 🏢 **공식 서비스 아님**: 이 확장 프로그램은 엔카(Encar) 공식 서비스가 아닙니다
- 🔄 **사이트 변경 대응**: 엔카 사이트 구조 변경 시 일시적으로 동작하지 않을 수 있습니다
- 👤 **개인 사용 목적**: 개인적인 편의를 위해 제작된 도구입니다
- 📊 **데이터 수집 없음**: 사용자 데이터를 수집하거나 외부로 전송하지 않습니다

---

<p align="center">
  Made with ❤️ for better car shopping experience
</p>