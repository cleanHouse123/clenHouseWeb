import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api';
import { VerifySmsRequest } from '../types';
import { useAuthStore } from '../store/authStore';
import { User } from '@/core/types/user';

export const useVerifySms = () => {
    const navigate = useNavigate();
    const { setUser, setAccessToken, setRefreshToken } = useAuthStore();

    return useMutation({
        mutationFn: (data: VerifySmsRequest) => authApi.verifySms(data),
        onSuccess: (data) => {
            // Сохраняем данные пользователя и токены
            setUser(data.user as unknown as User);
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            toast.success('Добро пожаловать!', {
                description: `Привет, ${data.user.name}! Вы успешно вошли в систему`,
                duration: 4000,
            });

            // Перенаправляем в личный кабинет
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error('Ошибка верификации SMS:', error);

            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Неверный код подтверждения';

            toast.error('Ошибка входа', {
                description: errorMessage,
                duration: 5000,
            });

            // Возвращаем функцию для очистки кода
            return { clearCode: true };
        },
    });
};
