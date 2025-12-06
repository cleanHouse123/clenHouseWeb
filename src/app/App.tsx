import { RouterProvider } from 'react-router-dom'
import { router } from './routing/routes'
import { useWindowHeight } from '@/core/hooks/ui/useWindowHeight'
import { PWAInstallPrompt } from '@/core/components/ui/PWAInstallPrompt'
import { Toaster } from 'sonner'
import { Suspense } from 'react'
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator'
import { useYandexMetrika } from '@/core/hooks/useYandexMetrika'
import { ErrorBoundary } from '@/core/components/error'

function App() {
    useWindowHeight();
    useYandexMetrika();

    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingIndicator />}>
                <RouterProvider router={router} />
            </Suspense>
            <PWAInstallPrompt />
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
