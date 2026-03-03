/**
 * Hero Slider Module
 * 히어로 섹션 슬라이더 기능
 */

class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-nav-dot');
        this.heroNav = document.querySelector('.hero-nav');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.desktopDelayBounds = { min: 10000, max: 18000 };
        this.mobileDelayBounds = { min: 12000, max: 20000 };
        this.minAutoPlayDelay = this.desktopDelayBounds.min;
        this.maxAutoPlayDelay = this.desktopDelayBounds.max;
        this.autoPlayDelay = this.minAutoPlayDelay;
        this.firstSlideAutoDelay = 20000;
        this.firstSlideAdvanceTimeout = null;
        this.transitionDuration = 500;
        this.isTransitioning = false;
        this.pendingSlideIndex = null;
        this.isMediaPlaying = false;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0 || this.dots.length === 0) {
            console.log('히어로 슬라이드 또는 네비게이션 도트를 찾을 수 없습니다.');
            return;
        }

        this.updateDelayBoundsByViewport();
        this.bindAdaptiveDelayEvents();
        
        console.log(`%c✓ Hero Slider Initialized: ${this.slides.length}개 슬라이드, ${this.dots.length}개 도트`, 'color: #06b6d4; font-weight: bold;');
        
        // 초기 상태 설정 - 첫 번째 슬라이드만 활성화
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.hidden = false;
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
                slide.style.transform = 'translateY(0)';
                slide.style.position = 'relative';
                slide.style.pointerEvents = 'auto';
            } else {
                slide.hidden = true;
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                slide.style.transform = 'translateY(30px)';
                slide.style.position = 'absolute';
                slide.style.pointerEvents = 'none';
            }
        });
        
        this.dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === 0) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
                dot.setAttribute('tabindex', '0');
            } else {
                dot.setAttribute('aria-selected', 'false');
                dot.setAttribute('tabindex', '-1');
            }
        });

        this.setupMediaAwareAutoplay();
        this.scheduleFirstSlideAdvance();

        if (this.heroNav) {
            this.heroNav.addEventListener('click', (event) => {
                const targetDot = event.target.closest('.hero-nav-dot');
                if (!targetDot) {
                    return;
                }

                event.preventDefault();
                const slideIndex = Number(targetDot.dataset.slide);
                if (Number.isNaN(slideIndex)) {
                    return;
                }

                this.goToSlide(slideIndex);
                this.resetAutoPlay();
            });
        }
        
        // 도트 클릭 이벤트 추가
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`%c도트 ${index} 클릭됨`, 'color: #10b981;');
                this.goToSlide(index);
                this.resetAutoPlay();
            });

            dot.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.goToSlide(index);
                    this.resetAutoPlay();
                }
            });
        });
        
        // 자동 재생 시작
        if (!this.prefersReducedMotion.matches) {
            this.startAutoPlay();
            console.log(`%c자동 재생 시작 (${this.autoPlayDelay / 1000}초 간격)`, 'color: #f59e0b;');
        } else {
            console.log('%c자동 재생 비활성화 (사용자 모션 최소화 설정)', 'color: #f59e0b;');
        }
        
        // 마우스 호버 시 일시정지
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            heroSection.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }

    updateDelayBoundsByViewport() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const nextBounds = isMobile ? this.mobileDelayBounds : this.desktopDelayBounds;

        this.minAutoPlayDelay = nextBounds.min;
        this.maxAutoPlayDelay = nextBounds.max;
        this.autoPlayDelay = Math.min(this.maxAutoPlayDelay, Math.max(this.minAutoPlayDelay, this.autoPlayDelay));
    }

    bindAdaptiveDelayEvents() {
        window.addEventListener('resize', () => {
            this.updateDelayBoundsByViewport();
            this.resetAutoPlay();
            this.scheduleFirstSlideAdvance();
        });

        const onMotionPreferenceChange = () => {
            if (this.prefersReducedMotion.matches) {
                this.pauseAutoPlay();
                return;
            }

            this.startAutoPlay();
        };

        if (typeof this.prefersReducedMotion.addEventListener === 'function') {
            this.prefersReducedMotion.addEventListener('change', onMotionPreferenceChange);
        } else {
            this.prefersReducedMotion.addListener(onMotionPreferenceChange);
        }
    }

    clearFirstSlideAdvance() {
        if (this.firstSlideAdvanceTimeout) {
            clearTimeout(this.firstSlideAdvanceTimeout);
            this.firstSlideAdvanceTimeout = null;
        }
    }

    scheduleFirstSlideAdvance() {
        this.clearFirstSlideAdvance();

        if (this.slides.length < 2 || this.prefersReducedMotion.matches) {
            return;
        }

        this.firstSlideAdvanceTimeout = setTimeout(() => {
            if (this.currentSlide === 0 && !this.isTransitioning) {
                this.goToSlide(1);
                this.resetAutoPlay();
            }
        }, this.firstSlideAutoDelay);
    }

    setupMediaAwareAutoplay() {
        const heroVideo = document.querySelector('.hero-video-container video');

        if (!heroVideo) {
            return;
        }

        const applyAdaptiveDelay = () => {
            if (!Number.isFinite(heroVideo.duration) || heroVideo.duration <= 0) {
                return;
            }

            const computedDelay = Math.min(
                this.maxAutoPlayDelay,
                Math.max(this.minAutoPlayDelay, Math.round((heroVideo.duration + 2) * 1000))
            );

            if (computedDelay !== this.autoPlayDelay) {
                this.autoPlayDelay = computedDelay;
                this.resetAutoPlay();
                console.log(`%c자동 재생 간격 조정: ${Math.round(this.autoPlayDelay / 1000)}초`, 'color: #0ea5e9;');
            }
        };

        if (heroVideo.readyState >= 1) {
            applyAdaptiveDelay();
        } else {
            heroVideo.addEventListener('loadedmetadata', applyAdaptiveDelay, { once: true });
        }

        heroVideo.addEventListener('play', () => {
            this.isMediaPlaying = true;
            this.pauseAutoPlay();
        });

        heroVideo.addEventListener('ended', () => {
            this.isMediaPlaying = false;
            this.nextSlide();
            this.startAutoPlay();
        });

        heroVideo.addEventListener('pause', () => {
            this.isMediaPlaying = false;
            this.startAutoPlay();
        });
    }
    
    goToSlide(index) {
        if (index === this.currentSlide) {
            return;
        }

        if (this.isTransitioning) {
            this.pendingSlideIndex = index;
            return;
        }
        
        if (index < 0 || index >= this.slides.length) {
            console.log(`%c잘못된 슬라이드 인덱스: ${index}`, 'color: #ef4444;');
            return;
        }

        if (index !== 0) {
            this.clearFirstSlideAdvance();
        }
        
        console.log(`%c슬라이드 전환: ${this.currentSlide} → ${index}`, 'color: #8b5cf6; font-weight: bold;');
        this.isTransitioning = true;
        
        // 현재 슬라이드 숨기기
        const currentSlide = this.slides[this.currentSlide];
        const currentVideo = currentSlide.querySelector('video');
        if (currentVideo && !currentVideo.paused) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
            this.isMediaPlaying = false;
        }

        currentSlide.hidden = false;
        currentSlide.classList.remove('active');
        currentSlide.style.opacity = '0';
        currentSlide.style.visibility = 'hidden';
        currentSlide.style.transform = 'translateY(30px)';
        currentSlide.style.pointerEvents = 'none';
        
        // 현재 도트 비활성화
        this.dots[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].setAttribute('aria-selected', 'false');
        this.dots[this.currentSlide].setAttribute('tabindex', '-1');
        
        // 새 슬라이드로 변경
        this.currentSlide = index;
        const newSlide = this.slides[this.currentSlide];
        
        // 새 슬라이드 표시 준비
        newSlide.hidden = false;
        newSlide.style.position = 'relative';
        newSlide.style.pointerEvents = 'auto';
        newSlide.classList.add('active');

        setTimeout(() => {
            newSlide.style.opacity = '1';
            newSlide.style.visibility = 'visible';
            newSlide.style.transform = 'translateY(0)';

            // 새 도트 활성화
            this.dots[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].setAttribute('aria-selected', 'true');
            this.dots[this.currentSlide].setAttribute('tabindex', '0');
        }, 50);

        // 전환 완료 후 비활성 슬라이드를 완전히 숨김
        setTimeout(() => {
            currentSlide.hidden = true;
            currentSlide.style.position = 'absolute';
            this.isTransitioning = false;

            if (this.currentSlide === 0) {
                this.scheduleFirstSlideAdvance();
            }

            if (this.pendingSlideIndex !== null && this.pendingSlideIndex !== this.currentSlide) {
                const queuedIndex = this.pendingSlideIndex;
                this.pendingSlideIndex = null;
                this.goToSlide(queuedIndex);
                return;
            }

            this.pendingSlideIndex = null;
        }, this.transitionDuration + 60);
    }
    
    nextSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }

        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);

        if (!this.prefersReducedMotion.matches && !this.isMediaPlaying) {
            this.startAutoPlay();
        }
    }

    getCurrentSlideDelay() {
        if (this.currentSlide === 0) {
            return this.firstSlideAutoDelay;
        }

        return this.autoPlayDelay;
    }
    
    startAutoPlay() {
        if (this.isMediaPlaying || this.prefersReducedMotion.matches) {
            return;
        }

        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.getCurrentSlideDelay());
    }
    
    pauseAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});

export default HeroSlider;
