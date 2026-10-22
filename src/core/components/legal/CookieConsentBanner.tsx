import { useEffect, useState } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Switch } from '@/core/components/ui/switch';
import {
    loadAnalytics,
    readCookieConsent,
    saveCookieConsent,
} from '@/core/lib/cookieConsent';
import { legalDocuments } from '@/pages/legal/documents';

/**
 * Баннер об обработке cookie-файлов.
 * Даёт выбор «Принять все» / «Только необходимые» / «Настроить»,
 * содержит ссылку на Политику и не перекрывает контент страницы.
 */
export const CookieConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [analytics, setAnalytics] = useState(true);

    useEffect(() => {
        if (!readCookieConsent()) {
            setIsVisible(true);
        }
    }, []);

    const decide = (allowAnalytics: boolean) => {
        saveCookieConsent(allowAnalytics);
        if (allowAnalytics) {
            loadAnalytics();
        }
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
            <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-white p-4 shadow-xl sm:p-5">
                <p className="text-sm text-gray-700">
                    Мы используем cookie-файлы, чтобы сайт работал корректно и чтобы
                    анализировать, как им пользуются. Подробности — в{' '}
                    <a
                        href={legalDocuments['privacy-policy'].path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2"
                    >
                        Политике конфиденциальности
                    </a>
                    .
                </p>

                {isSettingsOpen && (
                    <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Технически необходимые
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Нужны для авторизации и оформления заказов. Отключить нельзя.
                                </p>
                            </div>
                            <Switch checked disabled aria-label="Технически необходимые cookie" />
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Аналитика (Яндекс.Метрика)
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Помогает понять, какие разделы сайта полезны.
                                </p>
                            </div>
                            <Switch
                                checked={analytics}
                                onCheckedChange={setAnalytics}
                                aria-label="Аналитические cookie"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    {isSettingsOpen ? (
                        <Button type="button" onClick={() => decide(analytics)}>
                            Сохранить выбор
                        </Button>
                    ) : (
                        <Button type="button" onClick={() => decide(true)}>
                            Принять все
                        </Button>
                    )}
                    <Button type="button" variant="outline" onClick={() => decide(false)}>
                        Только необходимые
                    </Button>
                    {!isSettingsOpen && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            Настроить
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
