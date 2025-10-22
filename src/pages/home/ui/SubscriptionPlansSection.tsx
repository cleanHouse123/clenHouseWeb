import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { useSubscriptionPlans } from '@/modules/subscriptions/hooks/useSubscriptionPlans';
import { SubscriptionPlan } from '@/modules/subscriptions/types';

function formatRubles(kopecks: number) {
  const rubles = Math.round(kopecks / 100);
  return `${rubles} рублей`;
}

export const SubscriptionPlansSection: React.FC = () => {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const subscriptionPlans = plans as SubscriptionPlan[] | undefined;

  return (
    <section id="subscription" className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-16">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto text-center flex flex-col items-center gap-4 max-w-[850px] px-2"
        >
          <h2 className="text-[28px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium font-onest leading-[1.2] text-[#000]">
            Тарифы на услуги
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)]">
            Выберите комфортный формат подписки
          </p>
        </motion.div>

        {/* Состояния */}
        {isLoading && (
          <div className="mt-[42px] flex h-40 items-center justify-center text-[16px] text-[rgba(0,0,0,0.6)]">
            Загрузка тарифов...
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-[42px] flex h-40 items-center justify-center text-[16px] text-red-600">
            Ошибка загрузки тарифов
          </div>
        )}

        {!isLoading && !error && subscriptionPlans && (
          <div className={`mt-[42px] grid gap-4 ${
            subscriptionPlans.length === 1 ? 'grid-cols-1' :
            subscriptionPlans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            subscriptionPlans.length === 3 ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' :
            subscriptionPlans.length === 4 ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' :
            'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5'
          }`}>
            {subscriptionPlans.map((plan: SubscriptionPlan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -8, 
                  transition: { duration: 0.2 }
                }}
                className="w-full"
              >
                <Card radius="r20" background="white" className={`relative w-full flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-4 md:py-10 md:px-10 hover:shadow-lg transition-shadow duration-300 h-full ${plan.popular ? 'ring-2 ring-[#FF5D00]' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="rounded px-2 py-[2px] text-white text-[12px] bg-[#FF5D00]">🔥 Популярная</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      {/* маркеры рядом с заголовком не требуются, бейдж сверху */}
                    </div>
                    <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-medium font-onest leading-[1.2] text-[#000]">
                      {plan.name}
                    </h3>
                    <div className="text-[14px] sm:text-[15px] md:text-[16px] font-medium font-onest leading-[1.4] text-[#FF5D00]">
                      {plan.duration}
                    </div>
                    <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-600">{plan.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2">
                     {plan.features.map((tag: string, index: number) => {
                       const isLastTwo = index >= plan.features.length - 2;
                       const isGreenFeature = plan.badgeColor === 'green' && isLastTwo;
                       
                       return (
                         <div 
                           key={tag} 
                           className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${
                             isGreenFeature ? 'bg-[#E5F8E3]' : 'bg-[#EDF6FC]'
                           }`}
                         >
                           <span className={`text-[12px] sm:text-[13px] font-normal leading-[1.4] ${
                             isGreenFeature ? 'text-[#387C32]' : 'text-[#01609F]'
                           }`}>{tag}</span>
                         </div>
                       );
                     })}
                  </div>
                </div>

                  <div className="flex flex-row items-center justify-between gap-3 mt-6">
                    <div className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-medium font-onest leading-[1.2] text-[#000]">
                      {formatRubles(plan.priceInKopecks)}
                    </div>
                    <Button size="sm" className="bg-[#FF5D00] hover:opacity-90 text-[14px] py-2 px-4">
                      Оформить
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};


