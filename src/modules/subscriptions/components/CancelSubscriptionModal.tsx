import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button/button';
import { AlertTriangle, XCircle } from 'lucide-react';
import { useSubscriptionRefundPreview } from '../hooks/useSubscriptions';
import { kopecksToRubles } from '../utils/priceUtils';

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    subscriptionType?: 'monthly' | 'yearly';
    /** Подписка, от которой отказываются: по ней считается возврат */
    subscriptionId?: string;
}

export const CancelSubscriptionModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    subscriptionType = 'monthly',
    subscriptionId
}: CancelSubscriptionModalProps) => {
    // сумму считает сервер по пунктам 6.7 и 6.2 Оферты
    const { data: refund, isLoading: isCounting } = useSubscriptionRefundPreview(
        isOpen ? subscriptionId : undefined
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <span>Отказ от подписки</span>
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-700 mt-2">
                        Вы уверены, что хотите отказаться от своей {subscriptionType === 'monthly' ? 'месячной' : 'годовой'} подписки?
                        <span className="block mt-1 text-sm">Отменить отказ нельзя — подписку придётся оформить заново.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-5">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="text-sm text-red-800">
                                <p className="font-semibold mb-1.5 text-red-900">Что будет дальше</p>
                                <p>Оставшиеся выносы по подписке перестанут быть доступны. Оператор свяжется с вами по возврату — по оферте он занимает до 10 дней.</p>
                            </div>
                        </div>
                    </div>

                    {isCounting && subscriptionId && (
                        <p className="text-sm text-gray-500">Считаем возврат…</p>
                    )}

                    {refund && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-900">
                                К возврату {kopecksToRubles(refund.refundAmount)}
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>Оплачено за подписку: {kopecksToRubles(refund.price)}</li>
                                <li>
                                    Использовано выносов: {refund.usedOrders} из{' '}
                                    {refund.ordersLimit} — удержано{' '}
                                    {kopecksToRubles(refund.usedAmount)}
                                </li>
                                {refund.bagsDeduction > 0 && (
                                    <li>
                                        Выданные пакеты, пункт 6.2 Оферты: удержано{' '}
                                        {kopecksToRubles(refund.bagsDeduction)}
                                    </li>
                                )}
                            </ul>
                            <p className="text-xs text-gray-500">
                                Итоговую сумму подтверждает оператор.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-1">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="min-w-24"
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 min-w-40"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Оформляем отказ…
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Отказаться
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
