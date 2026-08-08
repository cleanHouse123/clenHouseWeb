import { useEffect, useMemo } from 'react';

import { Button } from '@/core/components/ui/button';

const MOBILE_DEEP_LINK = 'cleanhousemobile://telegram-auth';

const buildMobileDeepLink = (search: string) => {
    const query = search.startsWith('?') ? search.slice(1) : search;
    return query ? `${MOBILE_DEEP_LINK}?${query}` : MOBILE_DEEP_LINK;
};

export const TelegramAuthMobilePage = () => {
    const mobileUrl = useMemo(
        () => buildMobileDeepLink(window.location.search),
        []
    );

    useEffect(() => {
        window.location.href = mobileUrl;
    }, [mobileUrl]);

    return (
        <main className="min-h-screen bg-[#fff8f1] px-5 py-10 text-[#1d1e1c]">
            <section className="mx-auto flex min-h-[320px] max-w-md flex-col items-center justify-center rounded-2xl border border-[#d9d9d9] bg-white p-6 text-center shadow-xl">
                <p className="text-xs font-bold uppercase text-[#fa5d00]">
                    Telegram
                </p>
                <h1 className="mt-2 text-2xl font-extrabold">
                    Возвращаем в приложение
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#615f5c]">
                    Если приложение не открылось автоматически, нажмите кнопку
                    ниже.
                </p>
                <Button
                    className="mt-6 w-full rounded-2xl"
                    onClick={() => {
                        window.location.href = mobileUrl;
                    }}
                >
                    Открыть приложение
                </Button>
            </section>
        </main>
    );
};
