import { RouterProvider } from 'react-router-dom'
import { router } from './routing/routes'
import { useWindowHeight } from '@/core/hooks/ui/useWindowHeight'
import { PWAInstallPrompt } from '@/core/components/ui/PWAInstallPrompt'
import { Toaster } from 'sonner'

function App() {
    useWindowHeight();

    return (
        <>
            <RouterProvider router={router} />
            <PWAInstallPrompt />
            <Toaster
                position="top-right"
                expand={true}
                richColors={true}
                closeButton={true}
            />
        </>
    )
}

export default App
