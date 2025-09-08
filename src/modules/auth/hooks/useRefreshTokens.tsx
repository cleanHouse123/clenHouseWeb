import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../api';
import { RefreshTokensRequest } from '../types';

export const useRefreshTokens = () => {
    return useMutation({
        mutationFn: (data: RefreshTokensRequest) => authApi.refreshTokens(data),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        },
        onError: (error: any) => {
            console.error('Ошибка обновления токенов:', error);

            toast.error('Сессия истекла', {
                description: 'Пожалуйста, войдите в систему заново',
                duration: 5000,
            });

            // При ошибке обновления токенов очищаем токены
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    });
};
