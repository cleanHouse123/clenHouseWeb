import { RouterProvider } from 'react-router-dom'
import { router } from './routing/routes'
import { useWindowHeight } from '@/core/hooks/ui/useWindowHeight'
import { PWAInstallPrompt } from '@/core/components/ui/PWAInstallPrompt'
import { Toaster } from 'sonner'
import { CreateOrderProvider } from '@/core/contexts/CreateOrderContext'

function App() {
    useWindowHeight();

    return (
        <CreateOrderProvider>
            <RouterProvider router={router} />
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
