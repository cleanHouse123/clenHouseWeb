import { Navigate, useLocation } from 'react-router-dom'
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { AppLayout } from '@/core/components/layout/AppLayout';
import { PhoneLinkRequiredScreen } from '@/core/components/PhoneLinkRequiredScreen';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const accessToken = localStorage.getItem('accessToken');
    const location = useLocation()

    // Если нет токена, сразу редиректим на логин
    if (!accessToken) {

        return <Navigate to={'/'} state={{ from: location }} replace />
    }

    // Только если есть токен, вызываем useGetMe
    const { data: user, isLoading, error } = useGetMe()

    // Показываем загрузку
    if (isLoading) {
        return <LoadingIndicator />
    }

    // Если ошибка или нет пользователя, редиректим на логин
    if (error || !user) {
        return <Navigate to={'/'} state={{ from: location }} replace />
    }

    // Telegram-пользователь без телефона — показываем экран привязки
    const requiresPhoneLink = !!user.telegramId && !user.phone;
    if (requiresPhoneLink) {
        return <PhoneLinkRequiredScreen />;
    }

    return <AppLayout>{children}</AppLayout>
}

