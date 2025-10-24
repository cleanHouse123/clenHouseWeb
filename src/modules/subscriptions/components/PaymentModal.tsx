import { useState } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { CreditCard, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

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
    const [isRedirecting, setIsRedirecting] = useState(false);

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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Оплата подписки
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
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

                    <div className="space-y-3">
                        <Button
                            onClick={handlePaymentRedirect}
                            disabled={isRedirecting || !paymentUrl}
                            className="w-full"
                            size="lg"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {isRedirecting ? 'Перенаправление...' : 'Перейти к оплате'}
                        </Button>

                        <Button variant="outline" onClick={onClose} className="w-full">
                            Отмена
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
