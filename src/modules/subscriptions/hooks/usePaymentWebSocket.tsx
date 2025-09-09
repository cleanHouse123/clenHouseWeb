import { useEffect, useCallback } from 'react';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useQueryClient } from '@tanstack/react-query';
import { webSocketService } from '../services/websocket';
import { PaymentWebSocketEvent } from '../types';
import { toast } from 'sonner';

interface UsePaymentWebSocketProps {
    paymentId?: string;
    type?: 'subscription' | 'order';
    onSuccess?: (data: PaymentWebSocketEvent['data']) => void;
    onError?: (data: PaymentWebSocketEvent['data']) => void;
}

export const usePaymentWebSocket = ({ paymentId, type = 'subscription', onSuccess, onError }: UsePaymentWebSocketProps = {}) => {
    const { data: user } = useGetMe();
    const queryClient = useQueryClient();

    const handlePaymentSuccess = useCallback((data: PaymentWebSocketEvent['data']) => {
        console.log('Платеж успешно обработан!', data);

        // Вызываем пользовательский колбэк если есть
        if (onSuccess) {
            onSuccess(data);
            return;
        }

        // Стандартная обработка для подписок
        if (data.subscriptionId) {
            toast.success('Подписка успешно оплачена!', {
                description: `Подписка на сумму ${data.amount || 'неизвестную'}₽ активирована`,
                duration: 5000,
            });

            // Обновляем кэш подписок для получения актуальных данных
            if (user?.userId) {
                console.log('Обновление кэша подписок через usePaymentWebSocket');
                queryClient.invalidateQueries({
                    queryKey: ['user-subscription', user.userId]
                });
            }
        }

        // Стандартная обработка для заказов
        if (data.orderId) {
            toast.success('Заказ успешно оплачен!', {
                description: `Заказ на сумму ${data.amount || 'неизвестную'}₽ будет обработан в ближайшее время`,
                duration: 5000,
            });

            // Обновляем кэш заказов для получения актуальных данных
            if (user?.userId) {
                console.log('Обновление кэша заказов через usePaymentWebSocket');
                queryClient.invalidateQueries({
                    queryKey: ['orders', user.userId]
                });
            }
        }
    }, [user?.userId, queryClient, onSuccess]);

    const handlePaymentError = useCallback((data: PaymentWebSocketEvent['data']) => {
        console.log('Ошибка оплаты:', data);

        // Вызываем пользовательский колбэк если есть
        if (onError) {
            onError(data);
            return;
        }

        // Стандартная обработка ошибок
        toast.error('Ошибка оплаты', {
            description: 'Произошла ошибка при обработке платежа',
            duration: 5000,
        });
    }, [onError]);

    useEffect(() => {
        if (!paymentId || !user?.userId) return;

        if (type === 'subscription') {
            // Подключаемся к WebSocket подписок
            webSocketService.connectSubscription();

            // Подключаемся к комнате оплаты подписки
            webSocketService.joinPaymentRoom({ paymentId, userId: user.userId });

            // Подписываемся на события подписок
            webSocketService.onSubscriptionPaymentSuccess(handlePaymentSuccess);
            webSocketService.onSubscriptionPaymentError(handlePaymentError);

            return () => {
                // Отключаемся от комнаты оплаты подписки
                webSocketService.leavePaymentRoom({ paymentId, userId: user.userId });

                // Отписываемся от событий подписок
                webSocketService.offSubscriptionPaymentSuccess(handlePaymentSuccess);
                webSocketService.offSubscriptionPaymentError(handlePaymentError);
            };
        } else {
            // Подключаемся к WebSocket заказов
            webSocketService.connectOrder();

            // Подключаемся к комнате оплаты заказа
            webSocketService.joinOrderPaymentRoom(paymentId, user.userId);

            // Подписываемся на события заказов
            webSocketService.onOrderPaymentSuccess(handlePaymentSuccess);
            webSocketService.onOrderPaymentError(handlePaymentError);

            return () => {
                // Отключаемся от комнаты оплаты заказа
                webSocketService.leaveOrderPaymentRoom(paymentId, user.userId);

                // Отписываемся от событий заказов
                webSocketService.offOrderPaymentSuccess(handlePaymentSuccess);
                webSocketService.offOrderPaymentError(handlePaymentError);
            };
        }
    }, [paymentId, type, user?.userId, handlePaymentSuccess, handlePaymentError]);

    return {
        isConnected: type === 'subscription'
            ? webSocketService.isSubscriptionSocketConnected()
            : webSocketService.isOrderSocketConnected(),
        socket: type === 'subscription'
            ? webSocketService.getSubscriptionSocket()
            : webSocketService.getOrderSocket(),
    };
};
