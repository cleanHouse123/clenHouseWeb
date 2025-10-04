import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button/button';
import { Badge } from '@/core/components/ui/badge';
import { Package, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderResponseDto } from '@/modules/orders/types';
import { useCreateOrderModal } from '@/core/contexts/CreateOrderContext';
import { useLocale } from '@/core/feauture/locale/useLocale';
import { formatDateShort } from '@/core/utils/dateUtils';

interface RecentOrdersProps {
    orders: OrderResponseDto[];
    isLoading?: boolean;
}

export const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
    const navigate = useNavigate();
    const { openCreateOrderModal } = useCreateOrderModal();
    const { locale } = useLocale();

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'assigned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'done':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'canceled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'Новый';
            case 'paid':
                return 'Оплачен';
            case 'assigned':
                return 'Назначен';
            case 'in_progress':
                return 'Выполняется';
            case 'done':
                return 'Завершен';
            case 'canceled':
                return 'Отменен';
            default:
                return status;
        }
    };


    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Последние заказы
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-20 bg-muted rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Последние заказы
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            Заказов пока нет
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Создайте свой первый заказ на вынос мусора
                        </p>
                        <Button onClick={openCreateOrderModal}>
                            <Package className="h-4 w-4 mr-2" />
                            Создать заказ
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Последние заказы
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/orders')}
                    >
                        Все заказы
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                        <div
                            key={order.id}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate('/orders')}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-sm">
                                        Заказ #{order.id.slice(-8)}
                                    </span>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                    {getStatusText(order.status)}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{order.address}</span>
                                </div>

                                {order.scheduledAt && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDateShort(order.scheduledAt.toString(), locale)}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        {order.price} ₽
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDateShort(order.createdAt.toString(), locale)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
