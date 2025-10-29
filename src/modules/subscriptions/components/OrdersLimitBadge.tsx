import React from 'react';

interface OrdersLimitBadgeProps {
    ordersLimit?: number;
    className?: string;
}

export const OrdersLimitBadge: React.FC<OrdersLimitBadgeProps> = ({ ordersLimit, className = '' }) => {
    if (ordersLimit === undefined) {
        return null;
    }

    const isUnlimited = ordersLimit === -1;

    return (
        <div className={`pt-3 border-t border-gray-200 ${className}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isUnlimited ? 'bg-[#E5F8E3]' : 'bg-[#EDF6FC]'}`}>
                <span className={`text-[12px] sm:text-[13px] font-medium leading-[1.4] ${isUnlimited ? 'text-[#387C32]' : 'text-[#01609F]'}`}>
                    {isUnlimited ? '🔄 Безлимитные заказы' : `📦 Лимит заказов: ${ordersLimit}`}
                </span>
            </div>
        </div>
    );
};


