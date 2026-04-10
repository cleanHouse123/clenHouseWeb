import { Outlet } from 'react-router-dom';

import { LoginModalProvider } from '@/core/contexts/LoginModalContext';

export function RootRouteLayout() {
    return (
        <LoginModalProvider>
            <Outlet />
        </LoginModalProvider>
    );
}
