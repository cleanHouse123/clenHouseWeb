import { useEffect, useCallback } from 'react';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useQueryClient } from '@tanstack/react-query';
import { webSocketService } from '../services/websocket';
import { PaymentWebSocketEvent } from '../types';
import { toast } from 'sonner';

export const usePaymentWebSocket = () => {
    const { data: user } = useGetMe();
    const queryClient = useQueryClient();

    const handlePaymentSuccess = useCallback((data: PaymentWebSocketEvent['data']) => {
        console.log('Подписка успешно оформлена!', data);
        toast.success('Подписка активирована!', {
            description: `Подписка на сумму ${data.amount}₽ успешно оплачена`,
            duration: 6000,
        });

        // Обновляем кэш подписок для получения актуальных данных
        if (user?.userId) {
            console.log('Обновление кэша подписок через usePaymentWebSocket');
            queryClient.invalidateQueries({
                queryKey: ['user-subscription', user.userId]
            });
        }
    }, [user?.userId, queryClient]);

    const handlePaymentError = useCallback((data: PaymentWebSocketEvent['data']) => {
        console.log('Ошибка оплаты:', data);
        toast.error('Ошибка оплаты', {
            description: 'Произошла ошибка при обработке платежа',
            duration: 5000,
        });
    }, []);

    useEffect(() => {
        if (!user?.userId) return;

        // Подключаемся к WebSocket
        const socket = webSocketService.connect();

        // Подключаемся к комнате оплаты
        webSocketService.joinPaymentRoom({ userId: user.userId });

        // Подписываемся на события
        webSocketService.onPaymentSuccess(handlePaymentSuccess);
        webSocketService.onPaymentError(handlePaymentError);

        return () => {
            // Отключаемся от комнаты оплаты
            webSocketService.leavePaymentRoom({ userId: user.userId });

            // Отписываемся от событий
            webSocketService.offPaymentSuccess(handlePaymentSuccess);
            webSocketService.offPaymentError(handlePaymentError);
        };
    }, [user?.userId, handlePaymentSuccess, handlePaymentError]);

    return {
        isConnected: webSocketService.isSocketConnected(),
        socket: webSocketService.getSocket(),
    };
};
