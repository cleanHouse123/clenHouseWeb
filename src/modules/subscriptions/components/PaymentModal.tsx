import { useState, useEffect, useRef } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { CreditCard, Wifi, WifiOff } from 'lucide-react';
import { webSocketService } from '../services/websocket';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useQueryClient } from '@tanstack/react-query';
import { useCheckSubscriptionPaymentStatus } from '../hooks/useSubscriptions';
import { toast } from 'sonner';
import { kopecksToRubles } from '../utils/priceUtils';
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionType: 'monthly' | 'yearly' | null;
    paymentUrl: string | null;
}

export const PaymentModal = ({
    isOpen,
    onClose,
    subscriptionType,
    paymentUrl
}: PaymentModalProps) => {
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

    const { data: user } = useGetMe();
    const queryClient = useQueryClient();
    const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const paymentIdRef = useRef<string | null>(null);

    // Хуки для работы с платежами
    const checkPaymentStatus = useCheckSubscriptionPaymentStatus();

    // Извлекаем paymentId из URL
    const getPaymentId = () => {
        return paymentUrl?.split('/').pop() || 'mock-payment-id';
    };

    // Подключение к WebSocket комнате платежа
    const joinPaymentRoom = (paymentId: string) => {
        console.log('Подключение к WebSocket комнате платежа подписки:', paymentId);

        if (user?.userId) {
            // Подключаемся к WebSocket подписок
            webSocketService.connectSubscription();

            // Подключаемся к комнате payment_{paymentId}
            webSocketService.joinPaymentRoom({
                paymentId: paymentId,
                userId: user.userId
            });

            setIsWebSocketConnected(true);
        }
    };

    // Отключение от WebSocket комнаты
    const leavePaymentRoom = (paymentId: string) => {
        console.log('Отключение от WebSocket комнаты платежа подписки:', paymentId);

        if (user?.userId) {
            webSocketService.leavePaymentRoom({
                paymentId: paymentId,
                userId: user.userId
            });

            setIsWebSocketConnected(false);
        }
    };

    // Обработка успешной оплаты
    const handlePaymentSuccess = (data: any) => {
        console.log('Получено уведомление об успешной оплате:', data);
        setPaymentStatus('success');

        // Останавливаем проверку статуса при завершении
        stopStatusCheck();

        const amount = kopecksToRubles(data.amount) || 'неизвестную';
        toast.success('Подписка успешно оплачена!', {
            description: `Подписка на сумму ${amount}₽ активирована`,
            duration: 5000,
        });

        // Обновляем кэш подписок для получения актуальных данных
        if (user?.userId) {
            console.log('Обновление кэша подписок после успешной оплаты');
            queryClient.invalidateQueries({
                queryKey: ['user-subscription', user.userId]
            });
        }

        // Закрываем модальное окно при успехе
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    // Обработка ошибки оплаты
    const handlePaymentError = (data: any) => {
        console.log('Получено уведомление об ошибке оплаты:', data);
        setPaymentStatus('failed');

        // Останавливаем проверку статуса при завершении
        stopStatusCheck();

        toast.error('Ошибка обработки платежа', {
            description: data.message || 'Платеж не был обработан',
            duration: 5000,
        });
    };

    // Запуск проверки статуса каждые 5 секунд через API
    const startStatusCheck = (paymentId: string) => {
        console.log('Запуск проверки статуса платежа через API:', paymentId);

        const interval = setInterval(async () => {
            try {
                const status = await checkPaymentStatus.mutateAsync(paymentId);

                if (status.status === 'paid' || status.status === 'success') {
                    handlePaymentSuccess(status);
                } else if (status.status === 'failed') {
                    handlePaymentError({ error: 'Платеж не прошел', message: 'Ошибка обработки платежа' });
                }
            } catch (error) {
                console.error('Ошибка проверки статуса платежа:', error);
            }
        }, 5000);

        statusCheckIntervalRef.current = interval;
    };

    // Остановка проверки статуса
    const stopStatusCheck = () => {
        if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
            statusCheckIntervalRef.current = null;
            console.log('Проверка статуса платежа остановлена');
        }

        // Останавливаем проверку через API
        if (statusCheckIntervalRef.current) {
            clearInterval(statusCheckIntervalRef.current);
            statusCheckIntervalRef.current = null;
        }
    };

    // Очистка ресурсов
    const cleanup = () => {
        stopStatusCheck();
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
        if (paymentIdRef.current) {
            leavePaymentRoom(paymentIdRef.current);
        }
        setPaymentStatus('pending');
        setIsWebSocketConnected(false);
    };


    // Управление WebSocket подключением при открытии/закрытии модального окна
    useEffect(() => {
        if (isOpen && paymentUrl) {
            const paymentId = getPaymentId();
            paymentIdRef.current = paymentId;

            // Подключаемся к WebSocket комнате
            joinPaymentRoom(paymentId);

            // Запускаем проверку статуса
            startStatusCheck(paymentId);

            // Настраиваем периодический пинг сервера каждые 30 секунд
            pingIntervalRef.current = setInterval(() => {
                webSocketService.pingSubscriptionServer();
            }, 30000);

            // Подписываемся на события оплаты подписок
            webSocketService.onSubscriptionPaymentSuccess(handlePaymentSuccess);
            webSocketService.onSubscriptionPaymentError(handlePaymentError);

            console.log('PaymentModal: WebSocket подключение установлено для платежа:', paymentId);
        }

        return () => {
            if (isOpen) {
                // Очищаем интервал пинга
                if (pingIntervalRef.current) {
                    clearInterval(pingIntervalRef.current);
                    pingIntervalRef.current = null;
                }

                cleanup();
                webSocketService.offSubscriptionPaymentSuccess(handlePaymentSuccess);
                webSocketService.offSubscriptionPaymentError(handlePaymentError);
                console.log('PaymentModal: WebSocket подключение очищено');
            }
        };
    }, [isOpen, paymentUrl]);

    // Очистка при закрытии модального окна
    useEffect(() => {
        if (!isOpen) {
            cleanup();
        }
    }, [isOpen]);

    // Если нет типа подписки, не рендерим модальное окно
    if (!subscriptionType) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Оплата подписки
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Индикатор статуса WebSocket */}
                            <div className="flex items-center gap-1">
                                {isWebSocketConnected ? (
                                    <Wifi className="h-4 w-4 text-green-500" />
                                ) : (
                                    <WifiOff className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {isWebSocketConnected ? 'Подключено' : 'Отключено'}
                                </span>
                            </div>

                            {/* Индикатор статуса платежа */}
                            <div className="flex items-center gap-1">
                                <div className={`h-2 w-2 rounded-full ${paymentStatus === 'success' ? 'bg-green-500' :
                                    paymentStatus === 'failed' ? 'bg-red-500' :
                                        paymentStatus === 'processing' ? 'bg-yellow-500' :
                                            'bg-gray-400'
                                    }`} />
                                <span className="text-xs text-muted-foreground capitalize">
                                    {paymentStatus === 'success' ? 'Успешно' :
                                        paymentStatus === 'failed' ? 'Ошибка' :
                                            paymentStatus === 'processing' ? 'Обработка' :
                                                'Ожидание'}
                                </span>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Iframe с оплатой */}
                    {paymentUrl ? (
                        <div className="border rounded-lg overflow-hidden">
                            <iframe
                                src={paymentUrl}
                                className="w-full h-[600px] border-0"
                                title="Страница оплаты"
                                sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation"
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg text-gray-600">
                                Загрузка ссылки на оплату...
                            </p>
                        </div>
                    )}



                    {/* Кнопки */}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Закрыть
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
