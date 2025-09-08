import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentIframe } from './PaymentIframe';
import { OrderResponseDto } from '../types';
import { ordersApi } from '../api';
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
import { formatDateTime, formatDateTimeLocal, formatDateRelativeLocal } from '@/core/utils/dateUtils';

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

    if (!order) return null;

    const handleOpenPayment = async () => {
        try {
            const payment = await ordersApi.createPaymentLink(order.id, 200);
            setPaymentUrl(payment.paymentUrl);
            setPaymentId(payment.paymentId);
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
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

                    <div className="space-y-6">
                        {/* Статус и цена */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <OrderStatusBadge status={order.status} />
                                <span className="text-sm text-gray-600">Статус заказа</span>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{order.price}₽</div>
                                <div className="text-sm text-gray-600">Стоимость</div>
                            </div>
                        </div>

                        {/* Адрес */}
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Адрес</p>
                                <p className="text-muted-foreground">{order.address}</p>
                            </div>
                        </div>

                        {/* Описание */}
                        {order.description && (
                            <div className="flex items-start gap-3">
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">Описание</p>
                                    <p className="text-muted-foreground">{order.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Запланированное время */}
                        {order.scheduledAt && (
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Запланировано</p>
                                    <p className="text-muted-foreground">
                                        {formatDateTime(order.scheduledAt, locale)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Курьер */}
                        {order.currier && (
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Курьер</p>
                                    <p className="text-muted-foreground">
                                        {order.currier.name} ({order.currier.phone})
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Заметки */}
                        {order.notes && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-gray-700 mb-2">Заметки</p>
                                <p className="text-gray-600">{order.notes}</p>
                            </div>
                        )}

                        {/* Платежи */}
                        {order.payments.length > 0 && (
                            <div className="border-t pt-4">
                                <p className="font-medium mb-3">Платежи</p>
                                <div className="space-y-3">
                                    {order.payments.map((payment) => (
                                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {payment.method === 'subscription' ? 'По подписке' : 'Онлайн'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDateTimeLocal(payment.createdAt, locale)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg">{payment.amount}₽</span>
                                                <Badge
                                                    variant={payment.status === 'paid' ? 'default' :
                                                        payment.status === 'pending' ? 'secondary' : 'destructive'}
                                                    className="text-xs"
                                                >
                                                    {payment.status === 'paid' ? 'Оплачен' :
                                                        payment.status === 'pending' ? 'Ожидает' :
                                                            payment.status === 'failed' ? 'Ошибка' : 'Возвращен'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Время создания */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                            <Clock className="h-4 w-4" />
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
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Оплатить заказ
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Iframe для оплаты */}
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
