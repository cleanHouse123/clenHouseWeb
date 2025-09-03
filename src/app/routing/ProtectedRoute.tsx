import { Navigate, useLocation } from 'react-router-dom'
import {ROUTES} from "@/core/constants/routes.ts";
import { SessionExpiredModal } from '@/core/components/ui/modals/SessionExpiredModal';
import { useAuthStore } from '@/modules/auth/store/authStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, sessionExpired } = useAuthStore()
    const location = useLocation()

    if (sessionExpired) {
        return (
            <>
                {children}
                <SessionExpiredModal />
            </>
        )
    }

    if (!user) {
        return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />
    }

    return children
}

