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
        this.setupComingSoonLinks();
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

        const langSpan = langToggle.querySelector('span');
        const storageKey = 'humanaid-language';
        const legacyKey = 'chon-language';
        const legacyLang = localStorage.getItem(legacyKey);
        const savedLang = localStorage.getItem(storageKey) || legacyLang || 'ko';
        const initialLang = savedLang === 'en' ? 'en' : 'ko';

        if (legacyLang && !localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, initialLang);
        }

        // 저장된 언어로 초기화
        this.changeLanguage(initialLang);
        if (langSpan) {
            langSpan.textContent = initialLang === 'en' ? 'KO' : 'EN';
        }

        langToggle.addEventListener('click', () => {
            const nextLang = document.documentElement.lang === 'en' ? 'ko' : 'en';

            // 언어 변경 로직
            this.changeLanguage(nextLang);

            // UI 업데이트
            if (langSpan) {
                langSpan.textContent = nextLang === 'en' ? 'KO' : 'EN';
            }

            // 로컬스토리지에 저장
            localStorage.setItem(storageKey, nextLang);
        });
    }

    // 언어 변경 처리
    changeLanguage(lang) {
        console.log(`%c언어 변경: ${lang}`, 'color: #10b981; font-weight: bold;');
        
        this.updateMenuLanguage(lang);

        // data-ko, data-en 속성을 가진 요소들에 대해 텍스트 변경
        const elements = document.querySelectorAll('[data-ko][data-en]');
        
        console.log(`%c번역 대상 요소 수: ${elements.length}`, 'color: #3b82f6;');
        
        elements.forEach(element => {
            if (lang === 'en') {
                element.innerHTML = element.getAttribute('data-en');
            } else {
                element.innerHTML = element.getAttribute('data-ko');
            }
        });

        // HTML lang 속성 변경
        document.documentElement.lang = lang === 'en' ? 'en' : 'ko';
        
        console.log(`%c✓ 언어 변경 완료: ${lang}`, 'color: #10b981; font-weight: bold;');
    }

    updateMenuLanguage(lang) {
        const menuTranslations = {
            ko: {
                'about.html#company': '회사 소개',
                'about.html#vision': '비전',
                'ceo.html': 'CEO 메시지',
                'technology.html#overview': '핵심 플랫폼 기술',
                'technology.html#technology': 'DID 기술',
                'service.html#service': 'AI 솔루션',
                'service.html#smartfarm': '스마트팜 (Coming Soon)'
            },
            en: {
                'about.html#company': 'Company Info',
                'about.html#vision': 'Vision',
                'ceo.html': 'CEO Message',
                'technology.html#overview': 'Core Platform Technology',
                'technology.html#technology': 'DID Technology',
                'service.html#service': 'AI Solution',
                'service.html#smartfarm': 'Smart Farm (Coming Soon)'
            }
        };

        // 과거 앵커 키(레거시)도 함께 지원해 링크 구조 변경 시에도 번역이 깨지지 않도록 함
        const legacyAliases = {
            'technology.html#did': 'technology.html#technology',
            'technology.html#ai': 'technology.html#overview',
            'service.html#human-did': 'service.html#service',
            'service.html#makeit': 'service.html#service'
        };

        const normalizeHref = (href) => {
            if (!href) return '';

            try {
                const parsed = new URL(href, window.location.href);
                const fileName = parsed.pathname.split('/').pop() || '';
                const normalized = `${fileName}${parsed.hash}`;
                return legacyAliases[normalized] || normalized;
            } catch (error) {
                return legacyAliases[href] || href;
            }
        };

        // 드롭다운 메뉴 아이템만 선택 (메인 메뉴 제외)
        const menuItems = document.querySelectorAll('.dropdown-menu a');
        menuItems.forEach(item => {
            const href = normalizeHref(item.getAttribute('href'));
            const translation = menuTranslations[lang]?.[href];
            if (translation) {
                // textContent 대신 innerText 사용하여 더 안정적으로 업데이트
                item.innerText = translation;
            }
        });
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

    setupComingSoonLinks() {
        document.querySelectorAll('[data-coming-soon]').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const message = link.getAttribute('data-coming-soon') || '준비 중입니다.';
                alert(message);
            });
        });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new Interactions();
});

export default Interactions;
