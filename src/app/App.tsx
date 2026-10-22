import { RouterProvider } from 'react-router-dom'
import { router } from './routing/routes'
import { useWindowHeight } from '@/core/hooks/ui/useWindowHeight'
import { PWAInstallPrompt } from '@/core/components/ui/PWAInstallPrompt'
import { Toaster } from 'sonner'
import { Suspense, useEffect } from 'react'
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator'
import { CookieConsentBanner } from '@/core/components/legal/CookieConsentBanner'
import { initAnalyticsFromStoredConsent } from '@/core/lib/cookieConsent'
import { ErrorBoundary } from '@/core/components/error'

function App() {
    useWindowHeight();

    // Аналитика подключается только если пользователь ранее согласился на cookie
    useEffect(() => {
        initAnalyticsFromStoredConsent();
    }, []);

    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingIndicator />}>
                <RouterProvider router={router} />
            </Suspense>
            <PWAInstallPrompt />
            <CookieConsentBanner />
            <Toaster
                position="top-right"
                expand={true}
                richColors={true}
                closeButton={true}
            />
        </ErrorBoundary>
    )
}

export default App
