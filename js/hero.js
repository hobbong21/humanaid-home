/**
 * Hero Slider Module
 * 히어로 섹션 슬라이더 기능
 */

class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-nav-dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 10000; // 10초
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0 || this.dots.length === 0) {
            console.log('히어로 슬라이드 또는 네비게이션 도트를 찾을 수 없습니다.');
            return;
        }
        
        console.log(`%c✓ Hero Slider Initialized: ${this.slides.length}개 슬라이드`, 'color: #06b6d4; font-weight: bold;');
        
        // 초기 상태 설정 - 첫 번째 슬라이드만 활성화
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
                slide.style.transform = 'translateY(0)';
                slide.style.position = 'relative';
                slide.style.pointerEvents = 'auto';
            } else {
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
            }
        });
        
        // 도트 클릭 이벤트 추가
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });
        
        // 자동 재생 시작
        this.startAutoPlay();
        
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
    
    goToSlide(index) {
        if (index === this.currentSlide || this.isTransitioning) {
            return;
        }
        
        if (index < 0 || index >= this.slides.length) {
            return;
        }
        
        this.isTransitioning = true;
        
        // 현재 슬라이드 숨기기
        const currentSlide = this.slides[this.currentSlide];
        currentSlide.classList.remove('active');
        currentSlide.style.opacity = '0';
        currentSlide.style.visibility = 'hidden';
        currentSlide.style.transform = 'translateY(30px)';
        currentSlide.style.pointerEvents = 'none';
        
        // 현재 도트 비활성화
        this.dots[this.currentSlide].classList.remove('active');
        
        // 새 슬라이드로 변경
        this.currentSlide = index;
        const newSlide = this.slides[this.currentSlide];
        
        setTimeout(() => {
            // 모든 슬라이드 위치 설정
            this.slides.forEach((slide, i) => {
                if (i !== this.currentSlide) {
                    slide.style.position = 'absolute';
                    slide.style.visibility = 'hidden';
                    slide.style.pointerEvents = 'none';
                }
            });
            
            // 새 슬라이드 표시
            newSlide.style.position = 'relative';
            newSlide.style.pointerEvents = 'auto';
            newSlide.classList.add('active');
            
            setTimeout(() => {
                newSlide.style.opacity = '1';
                newSlide.style.visibility = 'visible';
                newSlide.style.transform = 'translateY(0)';
                
                // 새 도트 활성화
                this.dots[this.currentSlide].classList.add('active');
                
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 500);
            }, 50);
        }, 100);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    startAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
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
