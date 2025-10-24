import { RouterProvider } from 'react-router-dom'
import { router } from './routing/routes'
import { useWindowHeight } from '@/core/hooks/ui/useWindowHeight'
import { PWAInstallPrompt } from '@/core/components/ui/PWAInstallPrompt'
import { Toaster } from 'sonner'
import { CreateOrderProvider } from '@/core/contexts/CreateOrderContext'
import { Suspense } from 'react'
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator'

function App() {
    useWindowHeight();

    return (
        <CreateOrderProvider>
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
        </CreateOrderProvider>
    )
}

export default App
