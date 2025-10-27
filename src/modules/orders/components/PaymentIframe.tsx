import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';
import { CreditCard, CheckCircle, ExternalLink } from 'lucide-react';
import { useOrderPrice } from '@/modules/price';
import { kopecksToRublesNumber } from '@/core/utils/priceUtils';

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
    onError
}: PaymentIframeProps) => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { orderPrice, isLoading } = useOrderPrice();

    // Обработка прямого перенаправления на оплату
    const handlePaymentRedirect = () => {
        if (!paymentUrl) {
            onError?.('Ссылка на оплату не найдена');
            return;
        }

        setIsRedirecting(true);

        // Сохраняем текущий URL для возврата
        sessionStorage.setItem('returnUrl', window.location.pathname);
        sessionStorage.setItem('pendingPaymentId', paymentId || '');
        sessionStorage.setItem('paymentType', 'order'); // Указываем тип платежа

        // Прямое перенаправление на страницу оплаты YooKassa
        // YooKassa автоматически перенаправит на /payment-return?paymentId=...
        window.location.href = paymentUrl;
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Оплата заказа
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="text-center">
                        <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <ExternalLink className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Перенаправление на оплату
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Вы будете перенаправлены на безопасную страницу оплаты YooKassa
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handlePaymentRedirect}
                            disabled={isRedirecting}
                            className="w-full"
                            size="lg"
                        >
                            {isRedirecting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Перенаправление...
                                </>
                            ) : (
                                <>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Перейти к оплате
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="w-full"
                        >
                            Отмена
                        </Button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Безопасная оплата</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>
                                    Стоимость: {isLoading ? '...' : (orderPrice ? kopecksToRublesNumber(orderPrice.priceInKopecks) : '149')}₽
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
