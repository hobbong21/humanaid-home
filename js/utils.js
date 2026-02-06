/**
 * Utility Functions
 * 재사용 가능한 유틸리티 함수들
 */

// Debounce - 연속 호출을 제한하는 함수
export const debounce = (func, wait) => {
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

// Throttle - 일정 시간 간격으로만 함수 실행
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// DOM 요소가 존재하는지 확인
export const elementExists = (selector) => {
    return document.querySelector(selector) !== null;
};

// 여러 요소 선택
export const selectAll = (selector) => {
    return Array.from(document.querySelectorAll(selector));
};

// 클래스 토글
export const toggleClass = (element, className) => {
    if (element) {
        element.classList.toggle(className);
    }
};

// 클래스 추가
export const addClass = (element, className) => {
    if (element) {
        element.classList.add(className);
    }
};

// 클래스 제거
export const removeClass = (element, className) => {
    if (element) {
        element.classList.remove(className);
    }
};

// ARIA 속성 설정
export const setAriaLabel = (element, label) => {
    if (element) {
        element.setAttribute('aria-label', label);
    }
};

// ARIA 확장 상태 설정
export const setAriaExpanded = (element, expanded) => {
    if (element) {
        element.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
};

console.log('%c✓ Utils Module Loaded', 'color: #10b981; font-weight: bold;');
