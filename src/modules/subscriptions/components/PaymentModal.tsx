import { useState, useEffect } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { CreditCard, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentWebSocket } from '../hooks/usePaymentWebSocket';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionType: 'monthly' | 'yearly' | null;
    paymentUrl: string | null;
    onPaymentSuccess?: () => void;
}

export const PaymentModal = ({
    isOpen,
    onClose,
    subscriptionType,
    paymentUrl,
    onPaymentSuccess
}: PaymentModalProps) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Извлекаем paymentId из URL для отслеживания статуса
    const paymentId = paymentUrl ? new URL(paymentUrl).searchParams.get('paymentId') : null;

    // Используем WebSocket для отслеживания статуса платежа
    usePaymentWebSocket({
        paymentId: paymentId || undefined,
        type: 'subscription',
        onSuccess: (data) => {
            console.log('Payment success in PaymentModal:', data);
            setPaymentSuccess(true);
            if (onPaymentSuccess) {
                onPaymentSuccess();
            }
            // Закрываем модальное окно через 3 секунды
            setTimeout(() => {
                onClose();
                setPaymentSuccess(false);
            }, 3000);
        },
        onError: (data) => {
            console.log('Payment error in PaymentModal:', data);
            toast.error('Ошибка оплаты', {
                description: 'Произошла ошибка при обработке платежа',
                duration: 5000,
            });
        }
    });

    // Сброс состояния при закрытии модального окна
    useEffect(() => {
        if (!isOpen) {
            setPaymentSuccess(false);
            setIsRedirecting(false);
        }
    }, [isOpen]);

    // Обработка прямого перенаправления на оплату
    const handlePaymentRedirect = () => {
        if (!paymentUrl) {
            toast.error('Ссылка на оплату не найдена');
            return;
        }

        setIsRedirecting(true);

        // Сохраняем текущий URL для возврата
        sessionStorage.setItem('returnUrl', window.location.pathname);
        sessionStorage.setItem('paymentType', 'subscription');

        // Прямое перенаправление на страницу оплаты YooKassa
        window.location.href = paymentUrl;
    };

    // Если нет типа подписки, не рендерим модальное окно
    if (!subscriptionType) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg shadow-2xl [&>button]:hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                            <CreditCard className="h-5 w-5 text-orange-500" />
                            Оплата подписки
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <span className="text-2xl leading-none">×</span>
                        </Button>
                    </div>
                </DialogHeader>

                <div className="px-6 py-6 space-y-6">
                    {paymentSuccess ? (
                        <div className="text-center">
                            <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Подписка успешно оплачена!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Ваша подписка активирована и готова к использованию
                            </p>
                            <p className="text-sm text-gray-500">
                                Модальное окно закроется автоматически...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <ExternalLink className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Перенаправление на оплату подписки
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Вы будете перенаправлены на безопасную страницу оплаты YooKassa
                                </p>
                                {subscriptionType && (
                                    <p className="text-sm text-gray-500">
                                        Тип подписки: {subscriptionType === 'monthly' ? 'Ежемесячная' : 'Годовая'}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 pt-2">
                                <Button
                                    onClick={handlePaymentRedirect}
                                    disabled={isRedirecting || !paymentUrl}
                                    className="w-full rounded-[12px] bg-orange-500 hover:bg-orange-600 h-12 text-base font-medium"
                                    size="lg"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    {isRedirecting ? 'Перенаправление...' : 'Перейти к оплате'}
                                </Button>

                                <Button 
                                    variant="outline" 
                                    onClick={onClose} 
                                    className="w-full rounded-[12px] h-11 font-medium"
                                >
                                    Отмена
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
