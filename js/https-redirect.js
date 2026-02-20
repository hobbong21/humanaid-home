/**
 * HTTPS Redirect Script
 * HTTP로 접속 시 HTTPS로 자동 리다이렉트
 * chon.ai (non-www)는 www.chon.ai로 리다이렉트
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
        // chon.ai (non-www)를 www.chon.ai로 리다이렉트
        if (location.hostname === 'chon.ai') {
            const wwwUrl = location.href.replace('chon.ai', 'www.chon.ai').replace('http://', 'https://');
            location.replace(wwwUrl);
            return;
        }
        
        // HTTP로 접속한 경우 HTTPS로 리다이렉트
        if (location.protocol === 'http:') {
            const httpsUrl = 'https:' + location.href.substring(location.protocol.length);
            location.replace(httpsUrl);
        }
    }
})();
