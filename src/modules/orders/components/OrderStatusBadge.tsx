import { Badge } from '@/core/components/ui/badge';
import { OrderStatus } from '../types';
import { ORDER_STATUS_COLOR_CLASS } from '@/core/constants/orderStatusColors';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    new: { label: 'Новый', variant: 'default' },
    paid: { label: 'Оплачен', variant: 'default' },
    assigned: { label: 'Назначен', variant: 'secondary' },
    in_progress: { label: 'Выполняется', variant: 'default' },
    done: { label: 'Завершен', variant: 'default' },
    canceled: { label: 'Отменен', variant: 'destructive' },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
    const config = statusConfig[status];
    const className = ORDER_STATUS_COLOR_CLASS[status] ?? 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <Badge
            variant={config.variant}
            className={className}
        >
            {config.label}
        </Badge>
    );
};
