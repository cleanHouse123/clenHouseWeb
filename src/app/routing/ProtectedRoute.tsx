import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROUTES } from "@/core/constants/routes.ts";
import { SessionExpiredModal } from '@/core/components/ui/modals/SessionExpiredModal';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, sessionExpired, accessToken, setUser, clearUser } = useAuthStore()
    const location = useLocation()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    const { data: userData, error, isLoading } = useGetMe()

    useEffect(() => {
        // Если нет токена, сразу редиректим
        if (!accessToken) {
            setIsCheckingAuth(false)
            return
        }

        // Если есть токен, проверяем данные пользователя
        if (userData) {
            setUser(userData)
            setIsCheckingAuth(false)
        } else if (error) {
            // Если ошибка при получении данных пользователя
            console.error('Ошибка получения данных пользователя:', error)
            clearUser()
            setIsCheckingAuth(false)
        }
    }, [userData, error, accessToken, setUser, clearUser])

    // Показываем загрузку во время проверки авторизации
    if (isCheckingAuth || isLoading) {
        return <LoadingIndicator />
    }

    if (sessionExpired) {
        return (
            <>
                {children}
                <SessionExpiredModal />
            </>
        )
    }

    if (!user || !accessToken) {
        return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />
    }

    return children
}

