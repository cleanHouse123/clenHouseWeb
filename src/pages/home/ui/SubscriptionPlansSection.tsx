import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/core/components/ui/button';
import { useSubscriptionPlans } from '@/modules/subscriptions/hooks/useSubscriptionPlans';
import { useCreateSubscriptionByPlan } from '@/modules/subscriptions/hooks/useSubscriptions';
import { subscriptionApi } from '@/modules/subscriptions/api';
import { SubscriptionPlan } from '@/modules/subscriptions/types';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { PaymentModal } from '@/modules/subscriptions/components/PaymentModal';
import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';
import { useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { SubscriptionPlanCard } from '@/modules/subscriptions/components/SubscriptionPlanCard';
import { toast } from 'sonner';


// price formatting handled inside SubscriptionPlanCard

export const SubscriptionPlansSection: React.FC = () => {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const subscriptionPlans = plans as SubscriptionPlan[] | undefined;
  const { data: user, isLoading: isLoadingUser } = useGetMe();
  const { mutateAsync: createSubscriptionByPlan, isPending: isCreatingSubscription } = useCreateSubscriptionByPlan();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSubscribe = useCallback(async (plan: SubscriptionPlan) => {
    try {
      // Проверяем загрузку пользователя
      if (isLoadingUser) {
        toast.error('Ошибка', {
          description: 'Загрузка данных пользователя...',
          duration: 3000,
        });
        return;
      }

      // Проверяем авторизацию
      if (!user) {
        // Добавляем параметр subscriptionType в URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('subscriptionType', plan.type);
        setSearchParams(newSearchParams);

        setIsLoginModalOpen(true);
        return;
      }

      setSelectedPlan(plan);

      // Создаем подписку по ID плана (новый упрощенный метод)
      const subscriptionResult = await createSubscriptionByPlan(plan.id);

      // Создаем ссылку на оплату
      const paymentData = await subscriptionApi.createPaymentWithPlan(
        subscriptionResult.id,
        plan
      );

      // Обработка результата создания платежа
      if (paymentData.status === 'success' && !paymentData.paymentUrl) {
        // Подписка активирована бесплатно
        toast.success('Подписка активирована!', {
          description: 'Вы получили бесплатную подписку за приглашение друзей',
          duration: 4000,
        });
        // Обновляем данные подписки
        // WebSocket или рефетч обновит данные автоматически
        return;
      } else if (paymentData.paymentUrl) {
        // Обычный платеж - перенаправляем на страницу оплаты
        setPaymentUrl(paymentData.paymentUrl);
        setIsPaymentModalOpen(true);
      }
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
      
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Ошибка при оформлении подписки';
        console.error('API Error:', errorMessage);
      }
    }
  }, [user, isLoadingUser, searchParams, setSearchParams, createSubscriptionByPlan]);

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
    setPaymentUrl(null);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    // Убираем параметр subscriptionType из URL при закрытии модального окна
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('subscriptionType');
    setSearchParams(newSearchParams);
  };

  // Обработка авторизации после возврата на страницу
  useEffect(() => {
    const subscriptionType = searchParams.get('subscriptionType');

    if (user && subscriptionType && subscriptionPlans) {
      // Находим план по типу
      const plan = subscriptionPlans.find(p => p.type === subscriptionType);

      if (plan) {
        // Автоматически запускаем процесс оформления подписки
        handleSubscribe(plan);

        // Убираем параметр из URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('subscriptionType');
        setSearchParams(newSearchParams);
      }
    }
  }, [user, searchParams, subscriptionPlans, handleSubscribe, setSearchParams]);

  return (
    <section id="subscription" className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-8">
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

        {!isLoading && !error && subscriptionPlans && subscriptionPlans.length === 0 && (
          <div className="mt-[42px] flex h-40 items-center justify-center text-[16px] text-[rgba(0,0,0,0.6)]">
            Планы подписок временно недоступны
          </div>
        )}

        {!isLoading && !error && subscriptionPlans && subscriptionPlans.length > 0 && (
          <div className={`mt-[42px] grid gap-4 ${subscriptionPlans.length === 1 ? 'grid-cols-1' :
            subscriptionPlans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              subscriptionPlans.length === 3 ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' :
                subscriptionPlans.length === 4 ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' :
                  'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5'
            }`}>
            {subscriptionPlans.map((plan: SubscriptionPlan, idx) => (
              <motion.div
                key={`${plan.id || 'unknown'}-${idx}`}
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
                <SubscriptionPlanCard
                  plan={plan}
                  action={
                    <Button
                      size="sm"
                      className="bg-[#FF5D00] hover:opacity-90 text-[14px] py-2 px-4"
                      onClick={() => handleSubscribe(plan)}
                      disabled={isCreatingSubscription}
                    >
                      {isCreatingSubscription ? 'Обработка...' : 'Оформить'}
                    </Button>
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Модалки */}
      {selectedPlan && paymentUrl && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          subscriptionType={selectedPlan.type as 'monthly' | 'yearly'}
          paymentUrl={paymentUrl}
          onPaymentSuccess={() => {
            // Обновляем данные после успешной оплаты
            handleClosePaymentModal();
          }}
        />
      )}

      <SmsLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </section>
  );
};


