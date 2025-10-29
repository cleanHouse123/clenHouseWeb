import React from 'react';
import { Card } from '@/core/components/ui/card';
import { SubscriptionPlan } from '@/modules/subscriptions/types';
import { OrdersLimitBadge } from './OrdersLimitBadge';

interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    action: React.ReactNode;
    className?: string;
}

function formatRubles(kopecks: number) {
    const rubles = kopecks / 100;
    return `${rubles} ₽`;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ plan, action, className = '' }) => {
    return (
        <Card
            radius="r20"
            background="white"
            className={`relative w-full flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 md:py-10 md:px-10 hover:shadow-lg transition-shadow duration-300 h-full ${plan.popular ? 'ring-2 ring-[#FF5D00]' : ''} ${className}`}
        >
            {plan.popular ? (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="rounded px-2 py-[2px] text-white text-[12px] bg-[#FF5D00]">🔥 Популярная</span>
                </div>
            ) : null}

            <div className="flex flex-col gap-3">
                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-medium font-onest leading-[1.2] text-[#000]">
                    {plan.name}
                </h3>
                <div className="text-[14px] sm:text-[15px] md:text-[16px] font-medium font-onest leading-[1.4] text-[#FF5D00]">
                    {plan.duration}
                </div>
                <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-600">{plan.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                    {(plan.features || []).map((tag, index) => {
                        const isLastTwo = index >= (plan.features || []).length - 2;
                        const isGreenFeature = plan.badgeColor === 'green' && isLastTwo;
                        return (
                            <div
                                key={`${tag}-${index}`}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${isGreenFeature ? 'bg-[#E5F8E3]' : 'bg-[#EDF6FC]'}`}
                            >
                                <span className={`text-[12px] sm:text-[13px] font-normal leading-[1.4] ${isGreenFeature ? 'text-[#387C32]' : 'text-[#01609F]'}`}>{tag}</span>
                            </div>
                        );
                    })}
                </div>

                <OrdersLimitBadge ordersLimit={plan.ordersLimit} />
            </div>

            <div className="flex flex-row items-center justify-between gap-3 mt-6">
                <div className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-medium font-onest leading-[1.2] text-[#000]">
                    {formatRubles(plan.priceInKopecks)}
                </div>
                {action}
            </div>
        </Card>
    );
};


