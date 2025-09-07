import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../api';
import { RefreshTokensRequest } from '../types';
import { useAuthStore } from '../store/authStore';

export const useRefreshTokens = () => {
    const { setAccessToken, setRefreshToken } = useAuthStore();

    return useMutation({
        mutationFn: (data: RefreshTokensRequest) => authApi.refreshTokens(data),
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
        },
        onError: (error: any) => {
            console.error('Ошибка обновления токенов:', error);

            toast.error('Сессия истекла', {
                description: 'Пожалуйста, войдите в систему заново',
                duration: 5000,
            });

            // При ошибке обновления токенов очищаем пользователя
            useAuthStore.getState().clearUser();
        },
    });
};
