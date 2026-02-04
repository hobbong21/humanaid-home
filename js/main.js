// Performance Optimizations - Debounce function (moved to top)
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        // Close all open dropdowns when closing mobile menu
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Enhanced Mobile Dropdown Toggle
document.querySelectorAll('.dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('click', function(e) {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            const dropdown = this.parentElement;
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown.active').forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
        navMenu?.classList.remove('active');
        const icon = mobileMenuToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        // Close all dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Close mobile menu when clicking on dropdown links
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 968) {
            navMenu?.classList.remove('active');
            const icon = mobileMenuToggle?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// Optimized Navbar scroll effect with debouncing
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

const handleScroll = debounce(() => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// Optimized Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Use requestAnimationFrame for smooth animations
            requestAnimationFrame(() => {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50); // Reduced stagger for better performance
            });
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards with performance optimization
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('section, .service-card, .feature-card, .problem-box, .solution-box, .stat-box, .visual-card');
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
        observer.observe(element);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
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

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link style
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-menu a.active {
        color: var(--primary-color);
    }
    
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);

// Progress bar animation on scroll
const progressBar = document.querySelector('.progress-fill');
if (progressBar) {
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBar.style.animation = 'progressAnimate 2s ease-out forwards';
            }
        });
    }, { threshold: 0.5 });
    
    progressObserver.observe(progressBar.parentElement);
}

// Console message
console.log('%c🔗 CHON - Preserving human history on the blockchain', 'font-size: 16px; font-weight: bold; color: #667eea;');
console.log('%cVersion 1.0', 'font-size: 12px; color: #64748b;');

// Hero Slider Functionality - 완전히 새로 작성
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.hero-nav-dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 2000; // 2초
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0 || this.dots.length === 0) {
            console.log('히어로 슬라이드 또는 네비게이션 도트를 찾을 수 없습니다.');
            return;
        }
        
        console.log(`히어로 슬라이더 초기화: ${this.slides.length}개 슬라이드, ${this.dots.length}개 도트`);
        
        // 초기 상태 설정 - 첫 번째 슬라이드만 활성화
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
                slide.style.transform = 'translateY(0)';
                slide.style.position = 'relative';
                slide.style.display = 'flex';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                slide.style.transform = 'translateY(30px)';
                slide.style.position = 'absolute';
                slide.style.display = 'none';
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
                console.log(`도트 ${index} 클릭됨`);
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
                console.log('히어로 섹션 마우스 진입 - 자동재생 일시정지');
                this.pauseAutoPlay();
            });
            heroSection.addEventListener('mouseleave', () => {
                console.log('히어로 섹션 마우스 나감 - 자동재생 재시작');
                this.startAutoPlay();
            });
        }
    }
    
    goToSlide(index) {
        if (index === this.currentSlide || this.isTransitioning) {
            return;
        }
        
        if (index < 0 || index >= this.slides.length) {
            console.log(`잘못된 슬라이드 인덱스: ${index}`);
            return;
        }
        
        console.log(`슬라이드 ${this.currentSlide}에서 ${index}로 이동`);
        this.isTransitioning = true;
        
        // 현재 슬라이드 숨기기
        const currentSlide = this.slides[this.currentSlide];
        currentSlide.classList.remove('active');
        currentSlide.style.opacity = '0';
        currentSlide.style.visibility = 'hidden';
        currentSlide.style.transform = 'translateY(30px)';
        
        // 현재 도트 비활성화
        this.dots[this.currentSlide].classList.remove('active');
        
        // 새 슬라이드 표시
        this.currentSlide = index;
        const newSlide = this.slides[this.currentSlide];
        
        // 새 슬라이드를 먼저 표시하고 애니메이션 적용
        setTimeout(() => {
            // 이전 슬라이드 완전히 숨기기
            this.slides.forEach((slide, i) => {
                if (i !== this.currentSlide) {
                    slide.style.display = 'none';
                    slide.style.position = 'absolute';
                }
            });
            
            // 새 슬라이드 표시
            newSlide.style.display = 'flex';
            newSlide.style.position = 'relative';
            newSlide.classList.add('active');
            
            // 약간의 지연 후 애니메이션 적용
            setTimeout(() => {
                newSlide.style.opacity = '1';
                newSlide.style.visibility = 'visible';
                newSlide.style.transform = 'translateY(0)';
                
                // 새 도트 활성화
                this.dots[this.currentSlide].classList.add('active');
                
                // 전환 완료 후 플래그 리셋
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 500);
            }, 50);
        }, 100);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        console.log(`다음 슬라이드로 이동: ${nextIndex}`);
        this.goToSlide(nextIndex);
    }
    
    startAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        
        console.log(`자동재생 시작 (${this.autoPlayDelay}ms 간격)`);
    }
    
    pauseAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
            console.log('자동재생 일시정지');
        }
    }
    
    resetAutoPlay() {
        console.log('자동재생 재설정');
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// 히어로 슬라이더 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료 - 히어로 슬라이더 초기화');
    // 약간의 지연을 두어 모든 요소가 완전히 로드되도록 함
    setTimeout(() => {
        // 모든 슬라이드를 먼저 숨기기
        const allSlides = document.querySelectorAll('.hero-slide');
        const allDots = document.querySelectorAll('.hero-nav-dot');
        
        allSlides.forEach((slide, index) => {
            if (index === 0) {
                // 첫 번째 슬라이드만 표시
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
                slide.style.transform = 'translateY(0)';
                slide.style.position = 'relative';
                slide.style.display = 'flex';
            } else {
                // 나머지 슬라이드는 숨기기
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                slide.style.transform = 'translateY(30px)';
                slide.style.position = 'absolute';
                slide.style.display = 'none';
            }
        });
        
        allDots.forEach((dot, index) => {
            if (index === 0) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 히어로 슬라이더 인스턴스 생성
        window.heroSlider = new HeroSlider();
    }, 300);
});

// Enhanced Card Hover Effects
document.querySelectorAll('.service-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth Scroll with Offset for Fixed Header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Language Toggle with Menu Translation and Full Page Translation
const langToggle = document.getElementById('langToggle');
let currentLang = 'ko'; // Default Korean

const translations = {
    ko: {
        // Navigation
        about: 'About',
        technology: 'Technology',
        service: 'Service',
        news: 'News',
        ir: 'IR',
        companyInfo: '회사 소개',
        vision: '비전',
        ceoMessage: 'CEO 인사말',
        teamInfo: '팀 소개',
        chonDid: 'CHON DID',
        identityTech: '신원 인증 기술',
        appDownload: '앱 다운로드',
        smartGenealogy: 'Smart Genealogy',
        historyPreservation: '역사 보존',
        blockchainRecord: '블록체인 기록',
        
        // Common elements
        home: 'Home',
        contact: 'Contact',
        contactUs: '문의하기',
        learnMore: '더 알아보기',
        getStarted: '지금 시작하세요',
        
        // Hero section
        heroTitle1: 'Relationship is Identity',
        heroSubtitle1: '관계가 곧 신원이다',
        heroDesc1: '가족, 친구, 동료와의 관계를 통해<br>진정한 신원을 증명하는 새로운 패러다임',
        heroTitle2: 'CHON DID App',
        heroSubtitle2: '탈중앙화 신원 인증',
        heroDesc2: '자기 주권 신원 증명 기술로<br>개인정보를 완벽하게 보호하는 DID 플랫폼',
        
        // Main sections
        latestNews: '주요 뉴스',
        latestNewsDesc: 'CHON의 최신 소식을 확인하세요',
        companyVision: '우리의 비전',
        mainServices: '핵심 서비스',
        partners: '파트너사',
        partnersDesc: 'CHON과 함께하는 신뢰할 수 있는 파트너들입니다',
        
        // Vision section
        visionTitle: 'CHON은 인간 관계를 핵심으로 하는',
        visionDesc: '차세대 탈중앙화 신원 인증 플랫폼(DID, Decentralized Identity)으로, 메타버스 시대를 위한 새로운 신원 인프라를 구축합니다',
        immutability: '불변성',
        selfSovereign: '자기주권',
        decentralization: '탈중앙화',
        
        // Services
        coretech: 'Core Technology',
        mainService: 'Main Service',
        decentralizedIdentity: 'Decentralized Identity',
        smartGenealogy: '스마트 족보',
        didDesc: '자기 주권 신원 증명 기술을 통해 개인 정보의 주권을 사용자에게 돌려주는 탈중앙화 신원 인증 플랫폼입니다.',
        genealogyDesc: '세대와 세대를 잇는 디지털 족보 서비스로, 가족의 역사와 데이터를 체계적으로 관리합니다.',
        didAuth: '탈중앙화 신원 인증',
        selfSovereignProof: '자기 주권 신원 증명',
        secureDataMgmt: '안전한 개인정보 관리',
        digitalGenealogy: '디지털 족보 관리',
        familyHistory: '가족 역사 기록',
        systematicDataMgmt: '데이터 체계적 관리',
        
        // News
        featuredNews: '주요 뉴스',
        moreNews: '더 많은 뉴스 보기',
        mediaCoverage: '언론 보도',
        mediaCoverageDesc: 'CHON에 대한 주요 언론사의 보도 내용을 확인하세요',
        
        // Page titles and descriptions
        aboutChon: 'About CHON',
        aboutDesc: '메타버스 시대를 위한 새로운 신원 인프라를 구축합니다',
        newsTitle: '뉴스',
        newsDesc: 'CHON의 최신 소식과 언론 보도를 확인하세요',
        
        // Footer
        footerTagline: 'Relationship is Identity | 관계가 곧 신원이다',
        footerDesc: '가계도에서 커뮤니티까지 연결하는 신뢰 네트워크',
        services: '서비스',
        company: '회사',
        platforms: 'Contact',
        investmentInfo: '투자 정보',
        faq: 'FAQ',
        privacyPolicy: '개인정보 처리방침',
        termsOfService: '이용약관',
        copyright: '© 2026 CHON. All rights reserved.'
    },
    en: {
        // Navigation
        about: 'About',
        technology: 'Technology',
        service: 'Service',
        news: 'News',
        ir: 'IR',
        companyInfo: 'Company Info',
        vision: 'Vision',
        ceoMessage: 'CEO Message',
        teamInfo: 'Team Info',
        chonDid: 'CHON DID',
        identityTech: 'Identity Technology',
        appDownload: 'App Download',
        smartGenealogy: 'Smart Genealogy',
        historyPreservation: 'History Preservation',
        blockchainRecord: 'Blockchain Record',
        
        // Common elements
        home: 'Home',
        contact: 'Contact',
        contactUs: 'Contact Us',
        learnMore: 'Learn More',
        getStarted: 'Get Started Now',
        
        // Hero section
        heroTitle1: 'Relationship is Identity',
        heroSubtitle1: 'Building Trust Through Connections',
        heroDesc1: 'A new paradigm that proves true identity<br>through relationships with family, friends, and colleagues',
        heroTitle2: 'CHON DID App',
        heroSubtitle2: 'Decentralized Identity',
        heroDesc2: 'A DID platform that perfectly protects personal information<br>with self-sovereign identity technology',
        
        // Main sections
        latestNews: 'Latest News',
        latestNewsDesc: 'Stay updated with CHON\'s latest developments',
        companyVision: 'Our Vision',
        mainServices: 'Core Services',
        partners: 'Partners',
        partnersDesc: 'Trusted partners working together with CHON',
        
        // Vision section
        visionTitle: 'CHON is a next-generation platform centered on human relationships',
        visionDesc: 'A Decentralized Identity (DID) platform that builds new identity infrastructure for the metaverse era',
        immutability: 'Immutability',
        selfSovereign: 'Self-Sovereign',
        decentralization: 'Decentralization',
        
        // Services
        coretech: 'Core Technology',
        mainService: 'Main Service',
        decentralizedIdentity: 'Decentralized Identity',
        smartGenealogy: 'Smart Genealogy',
        didDesc: 'A decentralized identity authentication platform that returns personal data sovereignty to users through self-sovereign identity technology.',
        genealogyDesc: 'A digital genealogy service that connects generations, systematically managing family history and data.',
        didAuth: 'Decentralized Identity Authentication',
        selfSovereignProof: 'Self-Sovereign Identity Proof',
        secureDataMgmt: 'Secure Personal Data Management',
        digitalGenealogy: 'Digital Genealogy Management',
        familyHistory: 'Family History Recording',
        systematicDataMgmt: 'Systematic Data Management',
        
        // News
        featuredNews: 'Featured News',
        moreNews: 'View More News',
        mediaCoverage: 'Media Coverage',
        mediaCoverageDesc: 'Check out major media coverage about CHON',
        
        // Page titles and descriptions
        aboutChon: 'About CHON',
        aboutDesc: 'Building new identity infrastructure for the metaverse era',
        newsTitle: 'News',
        newsDesc: 'Check out the latest news and media coverage about CHON',
        
        // Footer
        footerTagline: 'Relationship is Identity | Building Trust Networks',
        footerDesc: 'Connecting living trust networks from family trees to communities',
        services: 'Services',
        company: 'Company',
        platforms: 'Contact',
        investmentInfo: 'Investment Info',
        faq: 'FAQ',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        copyright: '© 2026 CHON. All rights reserved.'
    }
};

function updateMenuLanguage(lang) {
    const menuItems = document.querySelectorAll('.dropdown-menu a');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        
        // Update dropdown menu items based on href
        if (href === 'about.html#company') {
            item.textContent = translations[lang].companyInfo;
        } else if (href === 'about.html#vision') {
            item.textContent = translations[lang].vision;
        } else if (href === 'ceo.html') {
            item.textContent = translations[lang].ceoMessage;
        } else if (href === 'about.html#team') {
            item.textContent = translations[lang].teamInfo;
        } else if (href === 'technology.html#overview') {
            item.textContent = translations[lang].chonDid;
        } else if (href === 'technology.html#technology') {
            item.textContent = translations[lang].identityTech;
        } else if (href === 'service.html#service') {
            item.textContent = translations[lang].smartGenealogy;
        } else if (href === 'service.html#preservation') {
            item.textContent = translations[lang].historyPreservation;
        } else if (href === 'service.html#blockchain') {
            item.textContent = translations[lang].blockchainRecord;
        } else if (href === 'service.html#download') {
            item.textContent = translations[lang].appDownload;
        }
    });
}

function updatePageContent(lang) {
    // Update all elements with data attributes
    const elementsWithDataAttrs = document.querySelectorAll('[data-ko][data-en]');
    elementsWithDataAttrs.forEach(element => {
        const koText = element.getAttribute('data-ko');
        const enText = element.getAttribute('data-en');
        
        if (koText && enText) {
            if (lang === 'ko') {
                element.innerHTML = koText;
            } else {
                element.innerHTML = enText;
            }
        }
    });
    
    // Update form placeholders
    const textareaWithPlaceholder = document.querySelector('textarea[data-placeholder-ko][data-placeholder-en]');
    if (textareaWithPlaceholder) {
        const koPlaceholder = textareaWithPlaceholder.getAttribute('data-placeholder-ko');
        const enPlaceholder = textareaWithPlaceholder.getAttribute('data-placeholder-en');
        
        if (lang === 'ko') {
            textareaWithPlaceholder.placeholder = koPlaceholder;
        } else {
            textareaWithPlaceholder.placeholder = enPlaceholder;
        }
    }
    
    // Update input placeholders
    const inputsWithPlaceholder = document.querySelectorAll('input[data-placeholder-ko][data-placeholder-en]');
    inputsWithPlaceholder.forEach(input => {
        const koPlaceholder = input.getAttribute('data-placeholder-ko');
        const enPlaceholder = input.getAttribute('data-placeholder-en');
        
        if (lang === 'ko') {
            input.placeholder = koPlaceholder;
        } else {
            input.placeholder = enPlaceholder;
        }
    });
    
    // Update select options
    const selectOptions = document.querySelectorAll('option[data-ko][data-en]');
    selectOptions.forEach(option => {
        const koText = option.getAttribute('data-ko');
        const enText = option.getAttribute('data-en');
        
        if (koText && enText) {
            if (lang === 'ko') {
                option.textContent = koText;
            } else {
                option.textContent = enText;
            }
        }
    });
    
    // Update hero section if exists
    const heroTitle1 = document.querySelector('.hero-slide:first-child .hero-title');
    const heroSubtitle1 = document.querySelector('.hero-slide:first-child .hero-subtitle');
    const heroTitle2 = document.querySelector('.hero-slide:nth-child(2) .hero-title');
    const heroSubtitle2 = document.querySelector('.hero-slide:nth-child(2) .hero-subtitle');
    
    if (heroTitle1) {
        if (lang === 'en') {
            heroTitle1.innerHTML = `${translations[lang].heroTitle1}<br><span class="highlight">${translations[lang].heroSubtitle1}</span>`;
            heroSubtitle1.innerHTML = translations[lang].heroDesc1;
        } else {
            heroTitle1.innerHTML = `${translations[lang].heroTitle1}<br><span class="highlight">${translations[lang].heroSubtitle1}</span>`;
            heroSubtitle1.innerHTML = translations[lang].heroDesc1;
        }
    }
    
    if (heroTitle2) {
        if (lang === 'en') {
            heroTitle2.innerHTML = `${translations[lang].heroTitle2}<br><span class="highlight">${translations[lang].heroSubtitle2}</span>`;
            heroSubtitle2.innerHTML = translations[lang].heroDesc2;
        } else {
            heroTitle2.innerHTML = `${translations[lang].heroTitle2}<br><span class="highlight">${translations[lang].heroSubtitle2}</span>`;
            heroSubtitle2.innerHTML = translations[lang].heroDesc2;
        }
    }
    
    // Update section headers
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionDescriptions = document.querySelectorAll('.section-description');
    
    sectionSubtitles.forEach(subtitle => {
        if (subtitle.textContent.includes('LATEST NEWS')) {
            subtitle.textContent = lang === 'ko' ? 'LATEST NEWS' : 'LATEST NEWS';
        } else if (subtitle.textContent.includes('COMPANY VISION')) {
            subtitle.textContent = lang === 'ko' ? 'COMPANY VISION' : 'COMPANY VISION';
        } else if (subtitle.textContent.includes('MAIN SERVICES')) {
            subtitle.textContent = lang === 'ko' ? 'MAIN SERVICES' : 'CORE SERVICES';
        } else if (subtitle.textContent.includes('PARTNERS')) {
            subtitle.textContent = lang === 'ko' ? 'PARTNERS' : 'PARTNERS';
        } else if (subtitle.textContent.includes('MEDIA COVERAGE')) {
            subtitle.textContent = lang === 'ko' ? 'MEDIA COVERAGE' : 'MEDIA COVERAGE';
        }
    });
    
    sectionTitles.forEach(title => {
        if (title.textContent.includes('주요 뉴스') || title.textContent.includes('Latest News')) {
            title.textContent = translations[lang].latestNews;
        } else if (title.textContent.includes('우리의 비전') || title.textContent.includes('Our Vision')) {
            title.textContent = translations[lang].companyVision;
        } else if (title.textContent.includes('핵심 서비스') || title.textContent.includes('Core Services')) {
            title.textContent = translations[lang].mainServices;
        } else if (title.textContent.includes('파트너사') || title.textContent.includes('Partners')) {
            title.textContent = translations[lang].partners;
        } else if (title.textContent.includes('언론 보도') || title.textContent.includes('Media Coverage')) {
            title.textContent = translations[lang].mediaCoverage;
        }
    });
    
    sectionDescriptions.forEach(desc => {
        if (desc.textContent.includes('CHON의 최신 소식') || desc.textContent.includes('Stay updated')) {
            desc.textContent = translations[lang].latestNewsDesc;
        } else if (desc.textContent.includes('신뢰할 수 있는 파트너') || desc.textContent.includes('Trusted partners')) {
            desc.textContent = translations[lang].partnersDesc;
        } else if (desc.textContent.includes('주요 언론사의 보도') || desc.textContent.includes('major media coverage')) {
            desc.textContent = translations[lang].mediaCoverageDesc;
        }
    });
    
    // Update vision section
    const visionTitle = document.querySelector('.vision-main h3');
    const visionDesc = document.querySelector('.vision-description');
    if (visionTitle) {
        visionTitle.textContent = translations[lang].visionTitle;
    }
    if (visionDesc) {
        visionDesc.textContent = translations[lang].visionDesc;
    }
    
    // Update feature buttons
    const featureButtons = document.querySelectorAll('.feature-button span');
    featureButtons.forEach((button, index) => {
        if (index === 0) button.textContent = translations[lang].immutability;
        if (index === 1) button.textContent = translations[lang].selfSovereign;
        if (index === 2) button.textContent = translations[lang].decentralization;
    });
    
    // Update service cards
    const serviceBadges = document.querySelectorAll('.service-badge');
    serviceBadges.forEach(badge => {
        if (badge.textContent.includes('Core Technology')) {
            badge.textContent = translations[lang].coretech;
        } else if (badge.textContent.includes('Main Service')) {
            badge.textContent = translations[lang].mainService;
        }
    });
    
    const serviceSubtitles = document.querySelectorAll('.service-subtitle');
    serviceSubtitles.forEach(subtitle => {
        if (subtitle.textContent.includes('Decentralized Identity')) {
            subtitle.textContent = translations[lang].decentralizedIdentity;
        } else if (subtitle.textContent.includes('스마트 족보')) {
            subtitle.textContent = translations[lang].smartGenealogy;
        }
    });
    
    const serviceDescriptions = document.querySelectorAll('.service-description');
    serviceDescriptions.forEach(desc => {
        if (desc.textContent.includes('자기 주권 신원 증명 기술')) {
            desc.textContent = translations[lang].didDesc;
        } else if (desc.textContent.includes('세대와 세대를 잇는')) {
            desc.textContent = translations[lang].genealogyDesc;
        }
    });
    
    // Update feature items
    const featureItems = document.querySelectorAll('.feature-item span, .service-features-list .feature-item span');
    featureItems.forEach(item => {
        const text = item.textContent.trim();
        if (text.includes('탈중앙화 신원 인증') || text.includes('Decentralized Identity Authentication')) {
            item.textContent = translations[lang].didAuth;
        } else if (text.includes('자기 주권 신원 증명') || text.includes('Self-Sovereign Identity Proof')) {
            item.textContent = translations[lang].selfSovereignProof;
        } else if (text.includes('안전한 개인정보 관리') || text.includes('Secure Personal Data Management')) {
            item.textContent = translations[lang].secureDataMgmt;
        } else if (text.includes('디지털 족보 관리') || text.includes('Digital Genealogy Management')) {
            item.textContent = translations[lang].digitalGenealogy;
        } else if (text.includes('가족 역사 기록') || text.includes('Family History Recording')) {
            item.textContent = translations[lang].familyHistory;
        } else if (text.includes('데이터 체계적 관리') || text.includes('Systematic Data Management')) {
            item.textContent = translations[lang].systematicDataMgmt;
        }
    });
    
    // Update news badges and buttons
    const newsBadges = document.querySelectorAll('.news-badge');
    newsBadges.forEach(badge => {
        if (badge.textContent.includes('주요 뉴스') || badge.textContent.includes('Featured News')) {
            badge.textContent = translations[lang].featuredNews;
        }
    });
    
    const moreNewsButtons = document.querySelectorAll('.news-action a, .btn');
    moreNewsButtons.forEach(button => {
        if (button.textContent.includes('더 많은 뉴스') || button.textContent.includes('View More News')) {
            button.innerHTML = `<i class="fas fa-newspaper"></i> ${translations[lang].moreNews}`;
        }
    });
    
    // Update footer
    const footerTagline = document.querySelector('.footer-brand p:first-of-type');
    const footerDesc = document.querySelector('.footer-brand p:last-of-type');
    const footerCopyright = document.querySelector('.footer-bottom .copyright');
    
    if (footerTagline) footerTagline.textContent = translations[lang].footerTagline;
    if (footerDesc) footerDesc.textContent = translations[lang].footerDesc;
    if (footerCopyright) footerCopyright.textContent = translations[lang].copyright;
    
    // Update footer column headers
    const footerColumns = document.querySelectorAll('.footer-column h4');
    if (footerColumns.length >= 3) {
        footerColumns[0].textContent = translations[lang].services;
        footerColumns[1].textContent = translations[lang].company;
        footerColumns[2].textContent = translations[lang].platforms;
    }
    
    // Update footer links
    const footerLinks = document.querySelectorAll('.footer-column a');
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === 'ir.html') {
            link.textContent = translations[lang].investmentInfo;
        } else if (href === 'contact.html#faq') {
            link.textContent = translations[lang].faq;
        } else if (href === 'privacy-policy.html') {
            link.textContent = translations[lang].privacyPolicy;
        }
    });
    
    // Update breadcrumb home link
    const breadcrumbHome = document.querySelector('.breadcrumb a');
    if (breadcrumbHome) {
        breadcrumbHome.innerHTML = `<i class="fas fa-home"></i> ${translations[lang].home}`;
    }
    
    // Update CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-content a');
    ctaButtons.forEach(button => {
        if (button.textContent.includes('문의') || button.textContent.includes('Contact')) {
            button.innerHTML = `<i class="fas fa-paper-plane"></i> ${translations[lang].contactUs}`;
        } else if (button.textContent.includes('지금 시작') || button.textContent.includes('Get Started')) {
            button.textContent = translations[lang].getStarted;
        }
    });
    
    // Update page titles and descriptions
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    
    if (pageTitle) {
        if (pageTitle.textContent.includes('About CHON')) {
            pageTitle.textContent = translations[lang].aboutChon;
        } else if (pageTitle.textContent.includes('뉴스') || pageTitle.textContent.includes('News')) {
            pageTitle.textContent = translations[lang].newsTitle;
        }
    }
    
    if (pageSubtitle) {
        if (pageSubtitle.textContent.includes('메타버스 시대를 위한') || pageSubtitle.textContent.includes('Building new identity')) {
            pageSubtitle.textContent = translations[lang].aboutDesc;
        } else if (pageSubtitle.textContent.includes('최신 소식과 언론') || pageSubtitle.textContent.includes('latest news and media')) {
            pageSubtitle.textContent = translations[lang].newsDesc;
        }
    }
    
    // Update partner cards
    const partnerCards = document.querySelectorAll('.partner-card p');
    partnerCards.forEach(card => {
        const text = card.textContent.trim();
        if (text.includes('블록체인 미디어') || text.includes('Blockchain Media')) {
            card.textContent = lang === 'ko' ? '블록체인 미디어 파트너' : 'Blockchain Media Partner';
        } else if (text.includes('클라우드 인프라') || text.includes('Cloud Infrastructure')) {
            card.textContent = lang === 'ko' ? '클라우드 인프라 파트너' : 'Cloud Infrastructure Partner';
        } else if (text.includes('클라우드 서비스') || text.includes('Cloud Service')) {
            card.textContent = lang === 'ko' ? '클라우드 서비스 파트너' : 'Cloud Service Partner';
        }
    });
    
    // Update CTA section content
    const ctaTitle = document.querySelector('.cta-content h2');
    const ctaDesc = document.querySelector('.cta-content p');
    if (ctaTitle) {
        if (ctaTitle.textContent.includes('지금 시작') || ctaTitle.textContent.includes('Get Started')) {
            ctaTitle.textContent = translations[lang].getStarted;
        }
    }
    if (ctaDesc) {
        if (ctaDesc.textContent.includes('메타버스 시대') || ctaDesc.textContent.includes('metaverse era')) {
            ctaDesc.textContent = lang === 'ko' ? 
                '메타버스 시대를 위한 새로운 신원 인프라를 경험하세요' : 
                'Experience the new identity infrastructure for the metaverse era';
        }
    }
}

if (langToggle) {
    langToggle.addEventListener('click', function() {
        const currentLangSpan = this.querySelector('span');
        if (currentLangSpan.textContent === 'EN') {
            currentLangSpan.textContent = 'KO';
            currentLang = 'en';
            updateMenuLanguage('en');
            updatePageContent('en');
            document.documentElement.lang = 'en';
        } else {
            currentLangSpan.textContent = 'EN';
            currentLang = 'ko';
            updateMenuLanguage('ko');
            updatePageContent('ko');
            document.documentElement.lang = 'ko';
        }
        
        // Save language preference
        localStorage.setItem('chon-language', currentLang);
    });
}

// Load saved language preference
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('chon-language');
    if (savedLang && savedLang !== currentLang) {
        const langSpan = langToggle?.querySelector('span');
        if (savedLang === 'en') {
            if (langSpan) langSpan.textContent = 'KO';
            currentLang = 'en';
            updateMenuLanguage('en');
            updatePageContent('en');
            document.documentElement.lang = 'en';
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
    
    // Set initial hero section as visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }
});
