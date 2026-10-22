/**
 * Согласие на обработку cookie-файлов.
 * Решение пользователя сохраняется в localStorage, баннер больше не показывается.
 * Аналитика (Яндекс.Метрика) подключается только после согласия.
 */

const STORAGE_KEY = 'cookieConsent.v1';

export const YANDEX_METRIKA_ID = 107244027;

export interface CookieConsent {
    /** Технически необходимые cookie — работают всегда */
    necessary: true;
    /** Аналитика и статистика посещений */
    analytics: boolean;
    /** Дата и время принятия решения */
    decidedAt: string;
}

export const readCookieConsent = (): CookieConsent | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<CookieConsent>;
        if (typeof parsed.analytics !== 'boolean') return null;
        return {
            necessary: true,
            analytics: parsed.analytics,
            decidedAt: parsed.decidedAt ?? new Date().toISOString(),
        };
    } catch {
        return null;
    }
};

export const saveCookieConsent = (analytics: boolean): CookieConsent => {
    const consent: CookieConsent = {
        necessary: true,
        analytics,
        decidedAt: new Date().toISOString(),
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
        // localStorage может быть недоступен — согласие тогда действует в рамках сессии
    }
    return consent;
};

let metrikaLoaded = false;

/** Подключает Яндекс.Метрику. Вызывается только при согласии на аналитику. */
export const loadAnalytics = (): void => {
    if (metrikaLoaded || typeof window === 'undefined') return;
    metrikaLoaded = true;

    const w = window as unknown as Record<string, unknown> & {
        ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
    };

    if (!w.ym) {
        const stub = ((...args: unknown[]) => {
            stub.a = stub.a || [];
            stub.a.push(args);
        }) as ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
        stub.l = Date.now();
        w.ym = stub;
    }

    const src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        document.head.appendChild(script);
    }

    w.ym?.(YANDEX_METRIKA_ID, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true,
    });
};

/** Подключает аналитику при загрузке приложения, если согласие уже дано ранее. */
export const initAnalyticsFromStoredConsent = (): void => {
    if (readCookieConsent()?.analytics) {
        loadAnalytics();
    }
};
