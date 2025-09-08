import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from "@/core/constants/routes.ts";
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const accessToken = localStorage.getItem('accessToken');
    const location = useLocation()

    // Если нет токена, сразу редиректим на логин
    if (!accessToken) {

        return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />
    }

    // Только если есть токен, вызываем useGetMe
    const { data: user, isLoading, error } = useGetMe()

    // Показываем загрузку
    if (isLoading) {
        return <LoadingIndicator />
    }

    // Если ошибка или нет пользователя, редиректим на логин
    if (error || !user) {
        return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />
    }

    return children
}

