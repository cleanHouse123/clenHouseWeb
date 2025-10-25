import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import { OrderResponseDto } from '@/modules/orders/types';
import { useLocale } from '@/core/feauture/locale/useLocale';
import { formatDateShort } from '@/core/utils/dateUtils';
import { OrderStatusBadge } from '@/modules/orders/components/OrderStatusBadge';
import { Button } from '@/core/components/ui/button/button';

interface OrderCardProps {
    order: OrderResponseDto;
    onClick: (order: OrderResponseDto) => void;
    onPay?: (order: OrderResponseDto) => void;
    showBorder?: boolean;
}

export const OrderCard = ({ order, onClick, onPay, showBorder = true }: OrderCardProps) => {
    const { locale } = useLocale();

    const handlePayClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Предотвращаем всплытие события клика по карточке
        onPay?.(order);
    };


    const formatTimeRange = (scheduledAt: string) => {
        const date = new Date(scheduledAt);
        const startHour = date.getHours();
        const startMinute = date.getMinutes();
        const endHour = startHour;
        const endMinute = startMinute + 20;

        const formatTime = (hour: number, minute: number) => {
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        };

        return `${formatTime(startHour, startMinute)}-${formatTime(endHour, endMinute)}`;
    };



    return (
        <div
            className={`bg-white rounded-[16px] cursor-pointer transition-shadow ${showBorder ? 'border-b border-gray-100' : ''
                }`}
            onClick={() => onClick(order)}
        >
            {/* Header */}
            <div className="mb-4">
                <h4 className="font-bold text-lg text-gray-800 mb-2">
                    Заказ #{order.id.slice(-8)}
                </h4>
            </div>

            <div className="flex flex-row gap-4 justify-between">
                {/* Main content area */}
                <div className="bg-transparent border border-gray-200 rounded-[16px] p-4 mb-4 flex-1 min-w-0">
                    {/* Date and Time */}
                    <div className="flex items-start gap-4 flex-col tablet:flex-row tablet:items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                                {formatDateShort(order.scheduledAt?.toString() || order.createdAt.toString(), locale)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                                {order.scheduledAt ? formatTimeRange(order.scheduledAt.toString()) : '14:00-14:20'}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate min-w-0">
                            {order.address}
                        </span>
                    </div>
                </div>

                {/* Cost section */}
                <div className="bg-white border flex flex-col justify-center border-gray-200 rounded-[12px] p-3 mb-4 flex-shrink-0">
                    <div className="text-xs text-gray-500 mb-1">Стоимость</div>
                    <div className="text-lg font-bold text-orange-500">
                        {order.price}.00₽
                    </div>
                </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-row justify-between gap-2 items-center">
                <OrderStatusBadge status={order.status} />
                <div className="flex items-center gap-2">
                    {order.status === 'new' && onPay && (
                        <Button
                            onClick={handlePayClick}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-7"
                        >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Оплатить
                        </Button>
                    )}
                    <div className="text-xs text-gray-400 text-right">
                        Создан {formatDateShort(order.createdAt.toString(), locale)}
                    </div>
                </div>
            </div>



        </div>
    );
};
