/**
 * Animations Module
 * 스크롤 애니메이션 및 특수 효과
 */

import { debounce, throttle } from './utils.js';

class AnimationManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupCounterAnimation();
        this.setupActiveNavHighlight();
        console.log('%c✓ Animation Module Initialized', 'color: #f59e0b; font-weight: bold;');
    }

    // 스크롤 애니메이션 설정
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 50);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.addEventListener('DOMContentLoaded', () => {
            const elementsToAnimate = document.querySelectorAll(
                'section, .service-card, .feature-card, .problem-box, .solution-box, .stat-box, .visual-card'
            );
            
            elementsToAnimate.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                observer.observe(element);
            });
        });
    }

    // Parallax 효과 설정
    setupParallax() {
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, 10);

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // 카운터 애니메이션
    setupCounterAnimation() {
        document.addEventListener('DOMContentLoaded', () => {
            const counterElements = document.querySelectorAll('[data-counter]');
            
            counterElements.forEach(element => {
                const target = parseInt(element.getAttribute('data-counter'));
                const duration = parseInt(element.getAttribute('data-duration')) || 2000;
                
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        this.animateCounter(element, target, duration);
                        observer.unobserve(element);
                    }
                });
                
                observer.observe(element);
            });
        });
    }

    // 카운터 애니메이션 실행
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // 활성 네비게이션 링크 강조
    setupActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');

        const handleScroll = throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});

export default AnimationManager;
