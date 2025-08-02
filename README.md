# 🚗 Encar Power Search

> 엔카 무사고 차량 필터링 및 고급 검색을 위한 Chrome 확장 프로그램

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?style=flat-square&logo=google-chrome)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)](LICENSE)

엔카(encar.com)에서 중고차를 검색할 때 **사고유무별 차량 필터링**과 **고급 검색 기능**을 제공하는 Chrome 확장 프로그램입니다.

## ✨ 주요 기능

🔍 **3단계 사고유무 필터링**
- **무사고**: 사고 이력이 전혀 없는 차량
- **단순수리**: 외판부위(후드, 휀더, 도어, 트렁크)만 수리한 차량
- **사고있음**: 사고 이력이 있는 차량
- 원클릭으로 원하는 조건의 차량만 표시

⚙️ **검색결과 최적화**
- 사진우대 섹션 숨기기/표시 설정
- 우대등록 섹션 숨기기/표시 설정
- 설정값 자동 저장 및 복원
- 실시간 필터링 적용

🎨 **직관적인 UI**
- 엔카 기존 UI와 자연스러운 통합
- 엔카 디자인 시스템 준수
- 접근성 고려한 사용자 경험

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

### ✅ v1.0.3 완료된 기능
- [x] **3단계 사고유무 필터링** - 무사고/단순수리/사고있음 구분
- [x] **엔카 URL 파라미터 조작** - Accident.N/F/Y 필터 적용
- [x] **사진우대 섹션 제어** - 표시/숨김 토글 기능
- [x] **우대등록 섹션 제어** - 표시/숨김 토글 기능
- [x] **Chrome Storage 연동** - 설정값 자동 저장/복원
- [x] **팝업 UI 완성** - 상태 표시 및 설정 인터페이스
- [x] **엔카 디자인 통합** - 기존 UI와 자연스러운 조화
- [x] **실시간 필터링** - 페이지 리로드 없는 즉시 적용

### 🔧 기술적 완성도
- [x] **Manifest V3 완전 지원** - 최신 Chrome Extension 표준 준수
- [x] **Vanilla JavaScript** - 경량화된 순수 자바스크립트
- [x] **엔카 API 분석 완료** - URL 구조 및 필터 파라미터 해석
- [x] **크로스 브라우저 호환성** - Chrome 기반 브라우저 전체 지원
- [x] **에러 핸들링** - 예외 상황 대응 및 fallback 메커니즘


## 🚀 사용법
1. 엔카 검색 페이지(www.encar.com) 방문
2. 검색 필터 영역에서 **"사고유무"** 드롭다운 클릭
3. 원하는 옵션 선택:
   - **무사고**: 사고 이력 없음
   - **단순수리**: 외판부위만 수리
   - **사고있음**: 사고 이력 있음
4. 확장 프로그램 아이콘 클릭하여 추가 설정 조정

### 🔧 개발 환경
- **Chrome 브라우저** (v88+) - Manifest V3 지원
- **Node.js** (선택사항) - 개발 도구용
- **Chrome Developer Tools** - 디버깅

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

## 🔒 개인정보 보호

이 확장 프로그램은 **사용자의 개인정보를 수집하지 않습니다**.
- 📊 **데이터 수집 없음**: 어떠한 개인정보도 수집하거나 전송하지 않습니다
- 🔐 **로컬 동작**: 모든 기능이 사용자의 브라우저 내에서만 실행됩니다
- 📖 **투명성**: 모든 소스 코드가 공개되어 있습니다

자세한 내용은 [개인정보 보호정책](PRIVACY.md)을 참조하세요.

## ⚠️ 면책 조항

- 🏢 **공식 서비스 아님**: 이 확장 프로그램은 엔카(Encar) 공식 서비스가 아닙니다
- 🔄 **사이트 변경 대응**: 엔카 사이트 구조 변경 시 일시적으로 동작하지 않을 수 있습니다
- 👤 **개인 사용 목적**: 개인적인 편의를 위해 제작된 도구입니다

---

<p align="center">
  Made with ❤️ for better car shopping experience
</p>