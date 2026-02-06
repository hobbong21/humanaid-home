/**
 * Interactions Module
 * 일반적인 사용자 상호작용 (스크롤, 클릭 등)
 */

class Interactions {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupSmoothScroll();
        this.setupLanguageToggle();
        this.setupProgressBar();
        console.log('%c✓ Interactions Module Initialized', 'color: #ec4899; font-weight: bold;');
    }

    // Smooth Scroll Navigation
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // 네비게이션 토글이 아닌 경우만 처리
                if (href !== '#' && !href.startsWith('#!')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // 언어 토글 기능
    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        if (!langToggle) return;

        langToggle.addEventListener('click', () => {
            const currentLang = langToggle.querySelector('span').textContent;
            const newLang = currentLang === 'EN' ? 'KO' : 'EN';
            
            // 언어 변경 로직
            this.changeLanguage(newLang);
            
            // UI 업데이트
            langToggle.querySelector('span').textContent = newLang;
            
            // 로컬스토리지에 저장
            localStorage.setItem('language', newLang);
        });

        // 저장된 언어 설정 복원
        const savedLang = localStorage.getItem('language') || 'EN';
        langToggle.querySelector('span').textContent = savedLang;
    }

    // 언어 변경 처리
    changeLanguage(lang) {
        // data-ko, data-en 속성을 가진 요소들에 대해 텍스트 변경
        const elements = document.querySelectorAll('[data-ko][data-en]');
        
        elements.forEach(element => {
            if (lang === 'EN') {
                element.textContent = element.getAttribute('data-en');
            } else {
                element.textContent = element.getAttribute('data-ko');
            }
        });

        // HTML lang 속성 변경
        document.documentElement.lang = lang === 'EN' ? 'en' : 'ko';
    }

    // 진행률 바 애니메이션
    setupProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        if (!progressBar) return;

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.style.animation = 'progressAnimate 2s ease-out forwards';
                }
            });
        }, { threshold: 0.5 });
        
        progressObserver.observe(progressBar.parentElement);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new Interactions();
});

export default Interactions;
