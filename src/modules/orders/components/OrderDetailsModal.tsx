import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentIframe } from './PaymentIframe';
import { OrderResponseDto } from '../types';
import { useCreateOrderPayment } from '../hooks/useOrders';
import {
    MapPin,
    Calendar,
    Clock,
    User,
    CreditCard,
    MoreHorizontal,
    ExternalLink
} from 'lucide-react';
import { useLocale } from '@/core/feauture/locale/useLocale';
import { formatDateTime, formatDateRelativeLocal } from '@/core/utils/dateUtils';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderResponseDto | null;
    userId?: string;
    onPaymentSuccess?: () => void;
}

export const OrderDetailsModal = ({
    isOpen,
    onClose,
    order,
    userId,
    onPaymentSuccess
}: OrderDetailsModalProps) => {
    const { locale } = useLocale();
    const [isPaymentIframeOpen, setIsPaymentIframeOpen] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const { mutateAsync: createOrderPayment } = useCreateOrderPayment();

    if (!order) return null;

    const handleOpenPayment = async () => {
        try {
            const payment = await createOrderPayment({
                orderId: order.id,
                amount: order.price
            });

            // Сохраняем данные платежа
            setPaymentUrl(payment.paymentUrl);
            setPaymentId(payment.paymentId);

            // Показываем модальное окно с кнопкой перенаправления
            setIsPaymentIframeOpen(true);
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentIframeOpen(false);
        onPaymentSuccess?.();
    };

    const handlePaymentError = (error: string) => {
        console.error('Ошибка оплаты:', error);
        setIsPaymentIframeOpen(false);
    };

    const hasPendingPayment = order.status !== 'paid' && order.payments.some(payment => payment.status === 'pending');

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto z-[9999]  sm:mx-auto">
                    <DialogHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                                Заказ #{order.id.slice(-8)}
                            </DialogTitle>
                            {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button> */}
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 sm:space-y-6">
                        {/* Статус и цена */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4  rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-xs sm:text-sm ">Статус заказа</span>
                                <OrderStatusBadge status={order.status} />

                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-xl sm:text-2xl font-bold text-primary">{order.price}₽</div>
                                <div className="text-xs sm:text-sm ">Стоимость</div>
                            </div>
                        </div>

                        {/* Адрес */}
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="font-medium text-sm sm:text-base">Адрес</p>
                                <p className="text-muted-foreground text-sm sm:text-base break-words">{order.address}</p>
                            </div>
                        </div>

                        {/* Описание */}
                        {order.description && (
                            <div className="flex items-start gap-3">
                                <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Описание</p>
                                    <p className="text-muted-foreground text-sm sm:text-base break-words">{order.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Запланированное время */}
                        {order.scheduledAt && (
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Запланировано</p>
                                    <p className="text-muted-foreground text-sm sm:text-base">
                                        {formatDateTime(order.scheduledAt, locale)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Курьер */}
                        {order.currier && (
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm sm:text-base">Курьер</p>
                                    <p className="text-muted-foreground text-sm sm:text-base break-words">
                                        {order.currier.name} ({order.currier.phone})
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Заметки */}
                        {order.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Заметки</p>
                                <p className="text-gray-600 text-sm sm:text-base break-words">{order.notes}</p>
                            </div>
                        )}



                        {/* Время создания */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground border-t pt-4">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>Создан {formatDateRelativeLocal(order.createdAt, locale)}</span>
                        </div>

                        {/* Кнопка оплаты для ожидающих платежей */}
                        {hasPendingPayment && (
                            <div className="border-t pt-4">
                                <Button
                                    onClick={handleOpenPayment}
                                    className="w-full"
                                    size="lg"
                                >
                                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                    <span className="hidden sm:inline">Оплатить заказ</span>
                                    <span className="sm:hidden">Оплатить</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Модальное окно для перенаправления на оплату */}
            <PaymentIframe
                isOpen={isPaymentIframeOpen}
                onClose={() => setIsPaymentIframeOpen(false)}
                paymentUrl={paymentUrl}
                paymentId={paymentId}
                userId={userId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
            />
        </>
    );
};
