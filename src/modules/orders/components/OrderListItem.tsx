import { Card, CardContent } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderCardProps } from '../types';
import {
    MapPin,
    Calendar,
    Clock,
    CreditCard,
    ChevronRight
} from 'lucide-react';
import { useLocale } from '@/core/feauture/locale/useLocale';
import { formatDateRelative, formatDateNumeric, formatDateRelativeLocal } from '@/core/utils/dateUtils';

interface OrderListItemProps extends OrderCardProps {
    onClick: () => void;
}

export const OrderListItem = ({
    order,
    onClick
}: OrderListItemProps) => {
    const { locale } = useLocale();

    const hasPendingPayment = order.payments.some(payment => payment.status === 'pending');

    return (
        <Card
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    {/* Левая часть - основная информация */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg truncate">
                                Заказ #{order.id.slice(-8)}
                            </h3>
                            <OrderStatusBadge status={order.status} />
                            {hasPendingPayment && (
                                <Badge variant="secondary" className="text-xs">
                                    Ожидает оплаты
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">{order.address}</span>
                            </div>

                            {order.scheduledAt && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDateNumeric(order.scheduledAt, locale)}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDateRelativeLocal(order.createdAt, locale)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть - цена и стрелка */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xl font-bold text-primary">{order.price}₽</div>
                            <div className="text-xs text-muted-foreground">
                                {order.payments.length > 0 ? (
                                    order.payments.some(p => p.status === 'paid') ? 'Оплачен' : 'Ожидает оплаты'
                                ) : 'Не оплачен'}
                            </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
