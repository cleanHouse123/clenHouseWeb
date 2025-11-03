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
            <DialogContent className="!w-full !max-w-sm sm:!max-w-md md:!max-w-md lg:!max-w-md xl:!max-w-md shadow-2xl [&>button]:hidden !mx-auto">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                    <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        </div>
                        <span>Оплата подписки</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
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
