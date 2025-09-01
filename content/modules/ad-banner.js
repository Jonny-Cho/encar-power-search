(function() {
  'use strict';

  window.EPS = window.EPS || {};
  window.EPS.Modules = window.EPS.Modules || {};

  window.EPS.Modules.AdBanner = {
    initialized: false,
    adContainer: null,

    init() {
      if (this.initialized) return;
      this.initialized = true;
      this.insertAdBanner();
      this.observePageChanges();
    },

    insertAdBanner() {
      // 우리 광고 새로 삽입 (기존 광고는 건드리지 않음)
      this.insertNewAd();
    },

    insertNewAd() {
      // 이미 광고가 삽입되어 있으면 return
      if (document.querySelector('.eps-ad-banner')) {
        return;
      }

      const resultContainer = document.querySelector('#rySch_result');
      if (!resultContainer) {
        return;
      }

      // 사진우대 영역 찾기
      const photoSection = resultContainer.querySelector('.section.list.special');
      if (!photoSection) {
        return;
      }

      // 광고 컨테이너 생성
      const adContainer = document.createElement('div');
      adContainer.className = 'eps-ad-banner';
      adContainer.innerHTML = `
        <div class="eps-ad-content">
          <iframe src="https://ads-partners.coupang.com/widgets.html?id=905333&template=carousel&trackingCode=AF3983944&subId=&width=840&height=90&tsource=" width="840" height="90" frameborder="0" scrolling="no" referrerpolicy="unsafe-url"></iframe>
        </div>
      `;

      // 사진우대 영역 앞에 광고 삽입
      photoSection.parentNode.insertBefore(adContainer, photoSection);

      this.adContainer = adContainer;
      this.addStyles();
    },

    addStyles() {
      if (document.querySelector('#eps-ad-banner-styles')) {
        return;
      }

      const style = document.createElement('style');
      style.id = 'eps-ad-banner-styles';
      style.textContent = `
        .eps-ad-banner {
          margin: 0 0;
          text-align: center;
          background: #fff;
          border: 0px solid #e5e5e5;
          border-radius: 4px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .eps-ad-content {
          display: inline-block;
          max-width: 100%;
        }

        .eps-ad-content iframe {
          max-width: 100%;
          height: auto;
          border: none;
          border-radius: 4px;
        }

        /* 반응형 */
        @media (max-width: 768px) {
          .eps-ad-banner {
            margin: 15px 0;
            padding: 10px;
          }
        }

        @media (max-width: 480px) {
          .eps-ad-banner {
            margin: 10px 0;
            padding: 8px;
          }
        }
      `;

      document.head.appendChild(style);
    },

    observePageChanges() {
      // URL 변경이나 동적 컨텐츠 로드를 감지하여 광고 재삽입
      const observer = new MutationObserver((mutations) => {
        let shouldReinsert = false;

        mutations.forEach((mutation) => {
          // 검색 결과가 새로 로드되었는지 확인
          if (mutation.type === 'childList') {
            const resultContainer = document.querySelector('#rySch_result');
            if (resultContainer && mutation.target.contains(resultContainer)) {
              shouldReinsert = true;
            }
          }
        });

        if (shouldReinsert) {
          setTimeout(() => {
            // 우리 광고가 사라졌으면 다시 삽입
            if (!document.querySelector('.eps-ad-banner')) {
              this.insertAdBanner();
            }
          }, 100);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    onRouteChange() {
      // 라우트 변경 시 광고 재삽입
      setTimeout(() => {
        if (!document.querySelector('.eps-ad-banner')) {
          this.insertAdBanner();
        }
      }, 500);
    },

    onSettingsChanged(settings) {
      // 설정 변경 시 필요한 로직 (현재는 없음)
    }
  };
})();
