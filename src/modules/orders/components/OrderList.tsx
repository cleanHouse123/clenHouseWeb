import { OrderListProps } from '../types';
import { OrderListItem } from './OrderListItem';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { EmptyState } from '@/core/components/ui/empty-state';
import { Package } from 'lucide-react';

export const OrderList = ({
    orders,
    isLoading = false,
    onStatusUpdate,
    onCancel,
    showActions = false,
    onOrderClick
}: OrderListProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingIndicator />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <EmptyState
                icon={<Package className="h-12 w-12 text-muted-foreground" />}
                title="Заказы не найдены"
                description="У вас пока нет заказов. Создайте первый заказ, чтобы начать работу."
            />
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <OrderListItem
                    key={order.id}
                    order={order}
                    onStatusUpdate={onStatusUpdate}
                    onCancel={onCancel}
                    showActions={showActions}
                    onClick={() => onOrderClick?.(order)}
                />
            ))}
        </div>
    );
};
