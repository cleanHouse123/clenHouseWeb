import { Badge } from '@/core/components/ui/badge';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const statusConfig = {
    new: {
        label: 'Новый',
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    paid: {
        label: 'Оплачен',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    assigned: {
        label: 'Назначен',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    in_progress: {
        label: 'Выполняется',
        variant: 'default' as const,
        className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    done: {
        label: 'Завершен',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    canceled: {
        label: 'Отменен',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
    },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
    const config = statusConfig[status];

    return (
        <Badge
            variant={config.variant}
            className={config.className}
        >
            {config.label}
        </Badge>
    );
};
