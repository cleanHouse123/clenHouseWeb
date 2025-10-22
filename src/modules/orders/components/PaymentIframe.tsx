import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { webSocketService } from '@/modules/subscriptions/services/websocket';
import { useCheckOrderPaymentStatus } from '../hooks/useOrders';
import { toast } from 'sonner';

interface PaymentIframeProps {
    isOpen: boolean;
    onClose: () => void;
    paymentUrl: string;
    paymentId?: string;
    userId?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const PaymentIframe = ({
    isOpen,
    onClose,
    paymentUrl,
    paymentId,
    userId,
    onSuccess,
    onError
}: PaymentIframeProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

    // Хуки для работы с платежами
    const checkPaymentStatus = useCheckOrderPaymentStatus();

    // Проверка статуса платежа через API
    const startStatusCheck = () => {
        if (!paymentId) return;

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

        setStatusCheckInterval(interval);
    };

    // Остановка проверки статуса
    const stopStatusCheck = () => {
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
        }
    };

    // Сохраняем данные оплаты в localStorage при открытии
    useEffect(() => {
        if (isOpen && paymentUrl && paymentId && userId) {
            const paymentData = {
                paymentUrl,
                paymentId,
                userId,
                timestamp: Date.now()
            };
            localStorage.setItem('pending_payment', JSON.stringify(paymentData));
        }
    }, [isOpen, paymentUrl, paymentId, userId]);

    // Очищаем localStorage при успешной оплате
    useEffect(() => {
        if (paymentSuccess) {
            localStorage.removeItem('pending_payment');
        }
    }, [paymentSuccess]);

    useEffect(() => {
        if (isOpen && paymentId && userId) {
            setIsLoading(true);
            setError(null);

            // Подключаемся к WebSocket заказов
            webSocketService.connectOrder();

            // Подключаемся к комнате платежа заказа
            webSocketService.joinOrderPaymentRoom(paymentId, userId);

            // Настраиваем периодический пинг сервера каждые 30 секунд
            const pingInterval = setInterval(() => {
                webSocketService.pingOrderServer();
            }, 30000);

            // Запускаем проверку статуса платежа через API
            startStatusCheck();

            // Обработчики событий
            const handlePaymentSuccess = (data: any) => {
                console.log('Order payment successful via WebSocket:', data);
                setPaymentSuccess(true);

                // Показываем уведомление об успешной оплате
                const amount = data.amount || 'неизвестную';
                toast.success('Заказ успешно оплачен!', {
                    description: `Заказ на сумму ${amount}₽ будет обработан в ближайшее время`,
                    duration: 5000,
                });

                console.log('Закрываем модалку оплаты заказа...');

                // Автоматически закрываем модальное окно через 2 секунды
                setTimeout(() => {
                    console.log('Вызываем onSuccess callback');
                    if (onSuccess) {
                        console.log('onSuccess callback существует, вызываем...');
                        onSuccess();
                    } else {
                        console.error('onSuccess callback не передан!');
                        // Альтернативный способ закрытия модалки
                        console.log('Закрываем модалку через onClose...');
                        onClose();
                    }
                }, 2000);
            };

            const handlePaymentError = (data: any) => {
                console.log('Order payment error via WebSocket:', data);
                onError?.(data.error || 'Ошибка оплаты');
            };

            // Подписываемся на события заказов
            webSocketService.onOrderPaymentSuccess(handlePaymentSuccess);
            webSocketService.onOrderPaymentError(handlePaymentError);

            return () => {
                // Очищаем интервал пинга
                clearInterval(pingInterval);

                // Останавливаем проверку статуса через API
                stopStatusCheck();

                // Отключаемся от комнаты платежа
                webSocketService.leaveOrderPaymentRoom(paymentId, userId);

                // Отписываемся от событий
                webSocketService.offOrderPaymentSuccess(handlePaymentSuccess);
                webSocketService.offOrderPaymentError(handlePaymentError);
            };
        }
    }, [isOpen, paymentId, userId, onSuccess, onError]);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setError('Ошибка загрузки формы оплаты');
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 z-[9999]">
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Оплата заказа
                        </DialogTitle>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                </DialogHeader>

                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-sm text-muted-foreground">Загрузка формы оплаты...</p>
                            </div>
                        </div>
                    )}

                    {paymentSuccess ? (
                        <div className="p-8 text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Оплата успешна!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Ваш заказ успешно оплачен. Окно закроется автоматически...
                            </p>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Ошибка загрузки
                            </h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <Button onClick={handleClose}>
                                Закрыть
                            </Button>
                        </div>
                    ) : (
                        <iframe
                            src={paymentUrl}
                            className="w-full h-[600px] border-0"
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            title="Форма оплаты"
                        />
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Безопасная оплата</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Стоимость: 200₽</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
