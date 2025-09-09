import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { X, Download, Smartphone, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Определяем iOS
        const checkIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
            const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
            setIsIOS(isIOSDevice && isSafari);
        };

        // Проверяем, установлено ли уже приложение
        const checkIfInstalled = () => {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
            const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true;

            setIsStandalone(isStandaloneMode);
            setIsInstalled(isStandaloneMode || isIOSStandalone);
        };

        checkIOS();
        checkIfInstalled();

        // Слушаем событие beforeinstallprompt (только для Android)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallPrompt(true);
        };

        // Слушаем событие appinstalled
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);
        };

        // Для iOS показываем промпт через 3 секунды после загрузки
        const showIOSPrompt = () => {
            if (isIOS && !isInstalled) {
                setTimeout(() => {
                    setShowInstallPrompt(true);
                }, 3000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Показываем промпт для iOS
        showIOSPrompt();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [isIOS, isInstalled]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('Пользователь принял предложение установки');
        } else {
            console.log('Пользователь отклонил предложение установки');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        // Сохраняем в localStorage, что пользователь отклонил предложение
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Не показываем промпт, если приложение уже установлено или пользователь отклонил
    if (isInstalled || !showInstallPrompt) {
        return null;
    }

    // Для Android проверяем наличие deferredPrompt
    if (!isIOS && !deferredPrompt) {
        return null;
    }

    // Проверяем, не отклонил ли пользователь ранее
    if (localStorage.getItem('pwa-install-dismissed') === 'true') {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 md:left-auto md:right-4 md:w-80">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Установить приложение</h3>
                        <p className="text-xs text-muted-foreground">Для быстрого доступа</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-2">
                {isIOS ? (
                    <>
                        <p className="text-sm text-muted-foreground">
                            Установите ЧистоДом для быстрого доступа и работы офлайн
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Share className="w-4 h-4 text-primary" />
                                <span>1. Нажмите кнопку "Поделиться" внизу экрана</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Plus className="w-4 h-4 text-primary" />
                                <span>2. Выберите "На экран Домой"</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDismiss}
                                className="flex-1"
                            >
                                Понятно
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground">
                            Установите ЧистоДом для быстрого доступа и работы офлайн
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleInstallClick}
                                size="sm"
                                className="flex-1"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Установить
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDismiss}
                            >
                                Позже
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
