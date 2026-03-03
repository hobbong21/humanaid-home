/**
 * HTTPS Redirect Script
 * HTTP 접속을 HTTPS로 리다이렉트하고 HumanAID 정식 도메인으로 정규화합니다.
 *
 * 이 스크립트는 페이지 로드 시 가장 먼저 실행되어야 합니다.
 */

(function() {
    'use strict';
    
    // localhost나 개발 환경에서는 리다이렉트하지 않음
    const isLocalhost = location.hostname === 'localhost' || 
                       location.hostname === '127.0.0.1' ||
                       location.hostname === '' ||
                       location.hostname.startsWith('192.168.') ||
                       location.hostname.startsWith('10.') ||
                       location.hostname.endsWith('.local');
    
    if (!isLocalhost) {
        // 정식 도메인 정규화: www.humanaid.digital -> humanaid.digital
        if (location.hostname === 'www.humanaid.digital') {
            const canonicalUrl = location.href
                .replace('www.humanaid.digital', 'humanaid.digital')
                .replace('http://', 'https://');
            location.replace(canonicalUrl);
            return;
        }

        // HTTP로 접속한 경우 HTTPS로 리다이렉트
        if (location.protocol === 'http:') {
            const httpsUrl = 'https:' + location.href.substring(location.protocol.length);
            location.replace(httpsUrl);
        }
    }
})();
