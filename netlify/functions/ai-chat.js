const RATE_LIMIT_WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_MAX || 10);
const requestStore = new Map();

function maskSensitiveText(text) {
    return text
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
        .replace(/\b01[016789]-?\d{3,4}-?\d{4}\b/g, '[phone]')
        .replace(/\b\d{6}-?[1-4]\d{6}\b/g, '[rrn]')
        .replace(/\b\d{2,3}-?\d{3,4}-?\d{4}\b/g, '[tel]');
}

function getClientIp(event) {
    const headerIp = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'] || '';
    return headerIp.split(',')[0].trim() || 'unknown';
}

function isRateLimited(ip) {
    const now = Date.now();
    const state = requestStore.get(ip) || { count: 0, windowStart: now };

    if (now - state.windowStart > RATE_LIMIT_WINDOW_MS) {
        state.count = 0;
        state.windowStart = now;
    }

    state.count += 1;
    requestStore.set(ip, state);

    return state.count > RATE_LIMIT_MAX_REQUESTS;
}

function hasBlockedContent(text) {
    const blockedTerms = ['자살', '테러', '폭탄', '살해', '마약', '불법 해킹'];
    return blockedTerms.some((term) => text.includes(term));
}

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const ip = getClientIp(event);

    if (isRateLimited(ip)) {
        return {
            statusCode: 429,
            body: JSON.stringify({ message: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' })
        };
    }

    let payload;
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON body' })
        };
    }

    const userMessage = (payload.message || '').toString().trim();

    if (!userMessage) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Empty message' })
        };
    }

    if (hasBlockedContent(userMessage.toLowerCase())) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: '해당 요청은 처리할 수 없습니다. 다른 질문을 입력해 주세요.' })
        };
    }

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'OPENAI_API_KEY is not configured.' })
        };
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                temperature: 0.4,
                messages: [
                    {
                        role: 'system',
                        content: [
                            'You are the Humanaid website AI assistant.',
                            'Respond in Korean by default unless user asks English.',
                            'Be concise and practical for website visitors.',
                            'If user intent matches site navigation, suggest relevant page paths from:',
                            'index.html, about.html, technology.html, service.html, news.html, contact.html, ir.html, terms-of-service.html, privacy-policy.html.'
                        ].join(' ')
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI request failed', {
                status: response.status,
                ip,
                prompt: maskSensitiveText(userMessage),
                detail: maskSensitiveText(errorText)
            });
            return {
                statusCode: 502,
                body: JSON.stringify({ message: 'AI 응답 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.' })
            };
        }

        const data = await response.json();
        const message = data?.choices?.[0]?.message?.content?.trim() || '죄송합니다. 답변을 생성하지 못했습니다.';

        return {
            statusCode: 200,
            body: JSON.stringify({ message })
        };
    } catch (error) {
        console.error('AI chat server error', {
            ip,
            prompt: maskSensitiveText(userMessage),
            detail: maskSensitiveText(error?.message || 'unknown')
        });
        return {
            statusCode: 500,
            body: JSON.stringify({ message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' })
        };
    }
};
