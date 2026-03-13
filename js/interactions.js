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
        this.setupAICounselBot();
        console.log('%c✓ Interactions Module Initialized', 'color: #ec4899; font-weight: bold;');
    }

    setupAICounselBot() {
        if (document.querySelector('#aiCounselBot')) return;

        const botHtml = `
            <div id="aiCounselBot" class="ai-chatbot" aria-live="polite">
                <button class="ai-chatbot-fab" id="aiChatbotToggle" type="button" aria-label="AI 상담봇 열기">
                    <i class="fas fa-comments" aria-hidden="true"></i>
                    <span data-ko="AI 상담" data-en="AI Help">AI 상담</span>
                </button>
                <section class="ai-chatbot-panel" id="aiChatbotPanel" aria-label="AI 상담봇" hidden>
                    <header class="ai-chatbot-header">
                        <div class="ai-chatbot-title-group">
                            <strong data-ko="Humanaid AI 상담봇" data-en="Humanaid AI Assistant">Humanaid AI 상담봇</strong>
                            <small data-ko="메뉴/서비스/문의를 빠르게 안내해드려요" data-en="I can guide you through menus, services, and contact paths.">메뉴/서비스/문의를 빠르게 안내해드려요</small>
                        </div>
                        <button class="ai-chatbot-close" id="aiChatbotClose" type="button" aria-label="상담봇 닫기">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                    </header>
                    <div class="ai-chatbot-messages" id="aiChatbotMessages"></div>
                    <div class="ai-chatbot-quick-actions">
                        <button type="button" class="ai-chatbot-chip" data-query="서비스" data-ko="서비스 안내" data-en="Services">서비스 안내</button>
                        <button type="button" class="ai-chatbot-chip" data-query="기술" data-ko="기술 소개" data-en="Technology">기술 소개</button>
                        <button type="button" class="ai-chatbot-chip" data-query="문의" data-ko="문의 방법" data-en="Contact">문의 방법</button>
                    </div>
                    <form class="ai-chatbot-input" id="aiChatbotForm">
                        <input id="aiChatbotInput" type="text" placeholder="질문을 입력하세요" data-placeholder-ko="질문을 입력하세요" data-placeholder-en="Ask me anything" autocomplete="off" />
                        <button type="submit" aria-label="전송">
                            <i class="fas fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </form>
                </section>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', botHtml);

        this.aiBot = {
            root: document.getElementById('aiCounselBot'),
            toggle: document.getElementById('aiChatbotToggle'),
            panel: document.getElementById('aiChatbotPanel'),
            close: document.getElementById('aiChatbotClose'),
            messages: document.getElementById('aiChatbotMessages'),
            form: document.getElementById('aiChatbotForm'),
            input: document.getElementById('aiChatbotInput')
        };

        this.aiBot.toggle?.addEventListener('click', () => {
            const isOpen = !this.aiBot.panel.hasAttribute('hidden');
            if (isOpen) {
                this.aiBot.panel.setAttribute('hidden', 'hidden');
            } else {
                this.aiBot.panel.removeAttribute('hidden');
                this.aiBot.input?.focus();
                if (!this.aiBot.messages.dataset.welcomed) {
                    this.addBotMessage('안녕하세요. 무엇을 도와드릴까요? 서비스, 기술, 문의, 뉴스 등을 물어보세요.');
                    this.aiBot.messages.dataset.welcomed = 'true';
                }
            }
        });

        this.aiBot.close?.addEventListener('click', () => {
            this.aiBot.panel.setAttribute('hidden', 'hidden');
        });

        this.aiBot.form?.addEventListener('submit', (event) => {
            event.preventDefault();
            const question = this.aiBot.input?.value.trim();
            if (!question) return;

            this.addUserMessage(question);
            this.aiBot.input.value = '';

            this.handleBotQuestion(question);
        });

        this.aiBot.root?.querySelectorAll('.ai-chatbot-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query') || '';
                if (!query) return;
                this.addUserMessage(query);
                this.handleBotQuestion(query);
            });
        });
    }

    async handleBotQuestion(question) {
        this.setBotInputState(true);
        const typingMessage = this.addBotMessage('답변을 준비하고 있습니다...');

        try {
            const reply = await this.requestBotReply(question);
            if (typingMessage?.parentElement) {
                typingMessage.parentElement.removeChild(typingMessage);
            }
            this.addBotMessage(reply.message, reply.link);
        } catch (error) {
            console.warn('AI 상담봇 API 호출 실패, 로컬 응답으로 대체합니다.', error);
            if (typingMessage?.parentElement) {
                typingMessage.parentElement.removeChild(typingMessage);
            }
            const fallbackReply = this.getLocalBotReply(question);
            this.addBotMessage(fallbackReply.message, fallbackReply.link);
        } finally {
            this.setBotInputState(false);
        }
    }

    async requestBotReply(question) {
        const endpoints = ['/api/ai-chat', '/.netlify/functions/ai-chat'];
        let lastErrorMessage = '';

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: question })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    if ((response.status === 400 || response.status === 429) && data?.message) {
                        return {
                            message: data.message
                        };
                    }
                    if (data?.message) {
                        lastErrorMessage = data.message;
                    }
                    continue;
                }

                if (data?.message) {
                    return {
                        message: data.message,
                        link: data.link
                    };
                }
            } catch (error) {
                // Try the next endpoint.
            }
        }

        if (lastErrorMessage) {
            throw new Error(lastErrorMessage);
        }

        throw new Error('No AI endpoint available');
    }

    setBotInputState(disabled) {
        if (!this.aiBot) return;
        if (this.aiBot.input) this.aiBot.input.disabled = disabled;

        const submitButton = this.aiBot.form?.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = disabled;
    }

    addUserMessage(text) {
        if (!this.aiBot?.messages) return;
        const item = document.createElement('div');
        item.className = 'ai-chatbot-message user';
        item.textContent = text;
        this.aiBot.messages.appendChild(item);
        this.aiBot.messages.scrollTop = this.aiBot.messages.scrollHeight;
    }

    addBotMessage(text, link) {
        if (!this.aiBot?.messages) return;
        const item = document.createElement('div');
        item.className = 'ai-chatbot-message bot';
        item.textContent = text;

        if (link?.href && link?.label) {
            const anchor = document.createElement('a');
            anchor.className = 'ai-chatbot-link';
            anchor.href = link.href;
            anchor.textContent = link.label;
            item.appendChild(document.createElement('br'));
            item.appendChild(anchor);
        }

        this.aiBot.messages.appendChild(item);
        this.aiBot.messages.scrollTop = this.aiBot.messages.scrollHeight;
        return item;
    }

    getLocalBotReply(questionRaw) {
        const question = questionRaw.toLowerCase();

        if (question.includes('서비스') || question.includes('솔루션') || question.includes('service')) {
            return {
                message: 'AI 솔루션, DID 서비스, 스마트팜 영역을 확인하실 수 있어요. 서비스 페이지로 이동할까요?',
                link: { href: 'service.html', label: '서비스 페이지 이동' }
            };
        }

        if (question.includes('기술') || question.includes('did') || question.includes('technology')) {
            return {
                message: '핵심 플랫폼 기술과 DID 기술 소개를 볼 수 있어요.',
                link: { href: 'technology.html', label: '기술 페이지 이동' }
            };
        }

        if (question.includes('문의') || question.includes('연락') || question.includes('contact')) {
            return {
                message: '문의 양식과 연락처 정보는 Contact 페이지에서 바로 확인할 수 있어요.',
                link: { href: 'contact.html', label: '문의하기 페이지 이동' }
            };
        }

        if (question.includes('뉴스') || question.includes('기사') || question.includes('news')) {
            return {
                message: '최신 소식과 언론 보도는 News 페이지에 정리되어 있습니다.',
                link: { href: 'news.html', label: '뉴스 페이지 이동' }
            };
        }

        if (question.includes('약관') || question.includes('개인정보') || question.includes('정책')) {
            return {
                message: '이용약관과 개인정보 처리방침 페이지에서 관련 내용을 확인하실 수 있어요.',
                link: { href: 'terms-of-service.html', label: '이용약관 보기' }
            };
        }

        return {
            message: '원하시는 주제를 구체적으로 알려주시면 더 정확히 안내해드릴게요. 예: 서비스, 기술, 문의, 뉴스'
        };
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
