/**
 * Navigation Module
 * 네비게이션 메뉴 및 모바일 토글 기능
 */

import { debounce, toggleClass, addClass, removeClass, setAriaExpanded } from './utils.js';

class Navigation {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navbar = document.querySelector('.navbar');
        this.dropdownLinks = document.querySelectorAll('.dropdown > a');
        
        this.init();
    }

    init() {
        this.setupMobileMenuToggle();
        this.setupDropdownMenus();
        this.setupOutsideClickHandler();
        this.setupNavbarScrollEffect();
        console.log('%c✓ Navigation Module Initialized', 'color: #2563eb; font-weight: bold;');
    }

    // 모바일 메뉴 토글
    setupMobileMenuToggle() {
        this.mobileMenuToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }

    toggleMobileMenu() {
        toggleClass(this.navMenu, 'active');
        toggleClass(this.mobileMenuToggle, 'active');
        
        const isOpen = this.navMenu.classList.contains('active');
        setAriaExpanded(this.mobileMenuToggle, isOpen);
        
        const icon = this.mobileMenuToggle.querySelector('i');
        if (isOpen) {
            removeClass(icon, 'fa-bars');
            addClass(icon, 'fa-times');
        } else {
            removeClass(icon, 'fa-times');
            addClass(icon, 'fa-bars');
            this.closeAllDropdowns();
        }
    }

    // 드롭다운 메뉴 설정
    setupDropdownMenus() {
        this.dropdownLinks.forEach(dropdownLink => {
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 968) {
                    e.preventDefault();
                    const dropdown = dropdownLink.parentElement;
                    
                    // 다른 드롭다운 닫기
                    document.querySelectorAll('.dropdown.active').forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            removeClass(otherDropdown, 'active');
                        }
                    });
                    
                    // 현재 드롭다운 토글
                    toggleClass(dropdown, 'active');
                }
            });
        });
    }

    // 드롭다운 내 링크 클릭 시 메뉴 닫기
    setupOutsideClickHandler() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });

        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 968) {
                    this.closeMenu();
                }
            });
        });
    }

    closeMenu() {
        removeClass(this.navMenu, 'active');
        removeClass(this.mobileMenuToggle, 'active');
        const icon = this.mobileMenuToggle?.querySelector('i');
        if (icon) {
            removeClass(icon, 'fa-times');
            addClass(icon, 'fa-bars');
        }
        this.closeAllDropdowns();
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            removeClass(dropdown, 'active');
        });
    }

    // 네비게이션 바 스크롤 효과
    setupNavbarScrollEffect() {
        const handleScroll = debounce(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                addClass(this.navbar, 'scrolled');
            } else {
                removeClass(this.navbar, 'scrolled');
            }
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

export default Navigation;
