import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderCardProps } from '../types';
import {
    MapPin,
    Calendar,
    Clock,
    User,
    CreditCard,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    PlayCircle,
    PauseCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export const OrderCard = ({
    order,
    onStatusUpdate,
    onCancel,
    showActions = false
}: OrderCardProps) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, {
                addSuffix: true,
                locale: ru
            });
        } catch (error) {
            return 'Неверная дата';
        }
    };

    const formatDateTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return 'Неверная дата';
        }
    };

    const getStatusActions = () => {
        if (!showActions) return null;

        switch (order.status) {
            case 'new':
                return (
                    <Button
                        size="sm"
                        onClick={() => onStatusUpdate?.(order.id, 'assigned')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Взять заказ
                    </Button>
                );

            case 'assigned':
                return (
                    <Button
                        size="sm"
                        onClick={() => onStatusUpdate?.(order.id, 'in_progress')}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Начать выполнение
                    </Button>
                );

            case 'in_progress':
                return (
                    <Button
                        size="sm"
                        onClick={() => onStatusUpdate?.(order.id, 'done')}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Завершить
                    </Button>
                );

            default:
                return null;
        }
    };

    const canCancel = order.status === 'new' || order.status === 'assigned';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        Заказ #{order.id.slice(-8)}
                    </CardTitle>
                    <OrderStatusBadge status={order.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Адрес */}
                <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="text-sm font-medium">Адрес</p>
                        <p className="text-sm text-muted-foreground">{order.address}</p>
                    </div>
                </div>

                {/* Описание */}
                {order.description && (
                    <div className="flex items-start gap-2">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Описание</p>
                            <p className="text-sm text-muted-foreground">{order.description}</p>
                        </div>
                    </div>
                )}

                {/* Цена */}
                <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">Стоимость</p>
                        <p className="text-lg font-bold text-primary">{order.price}₽</p>
                    </div>
                </div>

                {/* Запланированное время */}
                {order.scheduledAt && (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Запланировано</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDateTime(order.scheduledAt)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Курьер */}
                {order.currier && (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Курьер</p>
                            <p className="text-sm text-muted-foreground">
                                {order.currier.name} ({order.currier.phone})
                            </p>
                        </div>
                    </div>
                )}

                {/* Заметки */}
                {order.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">Заметки</p>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                )}

                {/* Платежи */}
                {order.payments.length > 0 && (
                    <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Платежи</p>
                        <div className="space-y-2">
                            {order.payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {payment.method === 'cash' ? 'Наличные' :
                                            payment.method === 'card' ? 'Карта' : 'Онлайн'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{payment.amount}₽</span>
                                        <Badge
                                            variant={payment.status === 'paid' ? 'default' : 'secondary'}
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Создан {formatDate(order.createdAt)}</span>
                </div>

                {/* Действия */}
                {(showActions || canCancel) && (
                    <div className="flex gap-2 pt-3 border-t">
                        {getStatusActions()}
                        {canCancel && onCancel && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onCancel(order.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Отменить
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
