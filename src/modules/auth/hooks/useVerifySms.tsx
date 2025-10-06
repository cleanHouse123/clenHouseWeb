import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../api';
import { VerifySmsRequest } from '../types';

export const useVerifySms = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifySmsRequest) => {
            // Получаем adToken из localStorage если он есть
            const adToken = localStorage.getItem('adToken');

            return authApi.verifySms({
                ...data,
                ...(adToken && { adToken }),
            });
        },
        onSuccess: (data) => {
            // Сохраняем токены в localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            // Удаляем adToken после успешной авторизации
            localStorage.removeItem('adToken');

            // Инвалидируем кэш пользователя для обновления данных
            queryClient.invalidateQueries({ queryKey: ['me'] });

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
