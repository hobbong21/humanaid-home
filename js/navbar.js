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
        this.navSearchForm = document.querySelector('#navSearchForm');
        this.navSearchInput = document.querySelector('#navSearchInput');
        this.navSearchResults = document.querySelector('#navSearchResults');
        this.activeSearchIndex = -1;
        this.searchRoutes = [
            { label: '비전', keywords: ['비전', 'vision'], target: '#vision', type: 'section', icon: 'fa-compass' },
            { label: '서비스', keywords: ['서비스', 'service', 'ai', '솔루션'], target: '#services', type: 'section', icon: 'fa-layer-group' },
            { label: '문의하기', keywords: ['문의', 'contact', '문의하기'], target: '#contact', type: 'section', icon: 'fa-envelope' },
            { label: '뉴스', keywords: ['뉴스', 'news'], target: 'news.html', type: 'page', icon: 'fa-newspaper' },
            { label: '기술', keywords: ['기술', 'technology', 'did'], target: 'technology.html', type: 'page', icon: 'fa-microchip' },
            { label: '회사', keywords: ['회사', 'about'], target: 'about.html', type: 'page', icon: 'fa-building' }
        ];
        
        this.init();
    }

    init() {
        this.setupMobileMenuToggle();
        this.setupDropdownMenus();
        this.setupNavSearch();
        this.setupOutsideClickHandler();
        this.setupNavbarScrollEffect();
        console.log('%c✓ Navigation Module Initialized', 'color: #2563eb; font-weight: bold;');
    }

    setupNavSearch() {
        this.navSearchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNavSearch();
        });

        this.navSearchInput?.addEventListener('input', () => {
            this.renderSearchSuggestions();
        });

        this.navSearchInput?.addEventListener('focus', () => {
            this.renderSearchSuggestions();
        });

        this.navSearchInput?.addEventListener('keydown', (e) => {
            const items = this.navSearchResults?.querySelectorAll('.nav-search-result-item') || [];
            if (!items.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.activeSearchIndex = (this.activeSearchIndex + 1) % items.length;
                this.updateActiveSearchItem(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.activeSearchIndex = (this.activeSearchIndex - 1 + items.length) % items.length;
                this.updateActiveSearchItem(items);
            } else if (e.key === 'Enter' && this.activeSearchIndex >= 0) {
                e.preventDefault();
                const target = items[this.activeSearchIndex].dataset.target;
                if (target) window.location.href = target;
            } else if (e.key === 'Escape') {
                this.hideSearchSuggestions();
            }
        });
    }

    handleNavSearch() {
        const rawQuery = this.navSearchInput?.value || '';
        const query = rawQuery.trim().toLowerCase();
        if (!query) return;

        const matched = this.searchRoutes.find(route => route.keywords.some(keyword => query.includes(keyword)) || route.label.includes(query));
        if (matched) {
            window.location.href = matched.target;
            return;
        }

        if (query.startsWith('#')) {
            window.location.href = query;
        }
    }

    renderSearchSuggestions() {
        if (!this.navSearchInput || !this.navSearchResults) return;

        const query = this.navSearchInput.value.trim().toLowerCase();
        const filtered = query
            ? this.searchRoutes.filter(route => route.label.toLowerCase().includes(query) || route.keywords.some(keyword => keyword.includes(query)))
            : this.searchRoutes.slice(0, 4);

        this.navSearchResults.innerHTML = '';
        this.activeSearchIndex = -1;

        if (!filtered.length) {
            this.hideSearchSuggestions();
            return;
        }

        filtered.forEach(route => {
            const item = document.createElement('li');
            item.className = 'nav-search-result-item';
            item.setAttribute('role', 'option');
            item.dataset.target = route.target;
            const typeLabel = route.type === 'section' ? '섹션' : '페이지';
            item.innerHTML = `
                <span class="nav-search-result-main">
                    <i class="fas ${route.icon}" aria-hidden="true"></i>
                    <span>${route.label}</span>
                </span>
                <span class="nav-search-result-type">${typeLabel}</span>
            `;
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                window.location.href = route.target;
            });
            this.navSearchResults.appendChild(item);
        });

        addClass(this.navSearchResults, 'show');
        this.navSearchInput.setAttribute('aria-expanded', 'true');
    }

    updateActiveSearchItem(items) {
        items.forEach((item, index) => {
            if (index === this.activeSearchIndex) {
                addClass(item, 'active');
            } else {
                removeClass(item, 'active');
            }
        });
    }

    hideSearchSuggestions() {
        if (!this.navSearchResults || !this.navSearchInput) return;
        removeClass(this.navSearchResults, 'show');
        this.navSearchInput.setAttribute('aria-expanded', 'false');
        this.activeSearchIndex = -1;
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

            if (!e.target.closest('#navSearchForm')) {
                this.hideSearchSuggestions();
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
        this.hideSearchSuggestions();
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
