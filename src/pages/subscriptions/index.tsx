import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Plus } from 'lucide-react';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import {
    useUserSubscription,
    useCreateSubscriptionByPlan,
    useDeleteSubscription
} from '@/modules/subscriptions/hooks/useSubscriptions';
import { subscriptionApi } from '@/modules/subscriptions/api';
import { SubscriptionPlan } from '@/modules/subscriptions/types';
import { usePaymentWebSocket } from '@/modules/subscriptions/hooks/usePaymentWebSocket';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { SubscriptionTypeSelector } from '@/modules/subscriptions/components/SubscriptionTypeSelector';
import { UserSubscriptionCard } from '@/modules/subscriptions/components/UserSubscriptionCard';
import { PaymentModal } from '@/modules/subscriptions/components/PaymentModal';

export const SubscriptionsPage = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { data: user, isLoading: isLoadingUser } = useGetMe();
    const { data: userSubscription, isLoading: isLoadingUserSubscription } = useUserSubscription();
    const { mutateAsync: createSubscriptionByPlan, isPending: isCreatingSubscriptionByPlan } = useCreateSubscriptionByPlan();
    const { mutateAsync: deleteSubscription } = useDeleteSubscription();

    usePaymentWebSocket();

    const handleSelectSubscription = async (type: 'monthly' | 'yearly', priceInKopecks: number) => {
        try {
            // Получаем план подписки по типу
            const plans = await subscriptionApi.getSubscriptionPlans();
            const plan = plans.find(p => p.type === type);

            if (!plan) {
                throw new Error('План подписки не найден');
            }

            setSelectedPlan(plan);

            // Создаем подписку по ID плана (новый упрощенный метод)
            const subscriptionResult = await createSubscriptionByPlan(plan.id);

            console.log('Subscription created by plan:', subscriptionResult);

            // Создаем платеж подписки через обновленный API
            const paymentData = await subscriptionApi.createSubscriptionPayment(
                subscriptionResult.id,
                type,
                plan.id,
                priceInKopecks
            );

            console.log('Payment link created:', paymentData);
            setPaymentUrl(paymentData.paymentUrl);

            // Открываем модальное окно оплаты
            setIsPaymentModalOpen(true);
        } catch (error) {
            console.error('Ошибка при выборе подписки:', error);
        }
    };


    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedPlan(null);
        setPaymentUrl(null);
    };

    const handlePaymentSuccess = () => {
        // Обновляем данные подписки после успешной оплаты
        console.log('Payment success callback triggered');
        // WebSocket уже обновляет кэш, но можно добавить дополнительную логику
    };

    const handlePayExistingSubscription = async (subscriptionId: string) => {
        try {
            const subscriptionType = userSubscription?.type || 'monthly';
            const amount = userSubscription?.price || 0;

            // Используем paymentUrl из подписки, если он есть
            if (userSubscription?.paymentUrl) {
                // Получаем план подписки для отображения
                const plans = await subscriptionApi.getSubscriptionPlans();
                const plan = plans.find(p => p.type === subscriptionType);
                setSelectedPlan(plan || null);
                setPaymentUrl(userSubscription.paymentUrl);
                setIsPaymentModalOpen(true);
                return;
            }

            // Если paymentUrl нет, создаем новую ссылку на оплату через обновленный API
            const plans = await subscriptionApi.getSubscriptionPlans();
            const plan = plans.find(p => p.type === subscriptionType);

            if (!plan) {
                throw new Error('План подписки не найден');
            }

            const paymentData = await subscriptionApi.createSubscriptionPayment(
                subscriptionId,
                subscriptionType as 'monthly' | 'yearly',
                plan.id,
                amount
            );

            setSelectedPlan(plan);
            setPaymentUrl(paymentData.paymentUrl);

            // Открываем модальное окно оплаты
            setIsPaymentModalOpen(true);
        } catch (error) {
            console.error('Ошибка при создании ссылки на оплату:', error);
        }
    };

    const handleDeleteSubscription = async (subscriptionId: string) => {
        try {
            await deleteSubscription(subscriptionId);
        } catch (error) {
            console.error('Ошибка при удалении подписки:', error);
        }
    };

    return (
        <div className="min-h-screen ">
            <main className="container mx-auto px-4 py-4 sm:py-8">
                <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                    {/* Хлебные крошки */}
                    <div className="flex flex-col gap-[20px] bg-white rounded-[32px] p-[16px] md:p-[36px]">
                        <nav className="flex items-center space-x-2 text-sm text-gray-500">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="hover:text-gray-700 transition-colors cursor-pointer"
                            >
                                Личный кабинет
                            </button>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-gray-900 font-medium">Мои подписки</span>
                        </nav>

                        {/* Заголовок и описание */}
                        <div className="space-y-2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                Мои подписки
                            </h1>
                            <p className="text-lg text-gray-600">
                                У вас может быть только одна активная подписка
                            </p>
                        </div>
                    </div>

                    {/* Контент */}
                    <div className="bg-white rounded-[32px] p-[18px] md:p-[36px]">
                        {(isLoadingUser || isLoadingUserSubscription) ? (
                            <div className="flex justify-center py-8">
                                <LoadingIndicator />
                            </div>
                        ) : userSubscription ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="h-5 w-5 text-orange-500" />
                                    <h2 className="text-xl font-semibold text-gray-900">Текущая подписка</h2>
                                </div>
                                <UserSubscriptionCard
                                    userSubscription={userSubscription}
                                    onPay={handlePayExistingSubscription}
                                    onDelete={handleDeleteSubscription}
                                />
                            </div>
                        ) : user ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Plus className="h-5 w-5 text-orange-500" />
                                    <h2 className="text-xl font-semibold text-gray-900">Оформить подписку</h2>
                                </div>
                                <SubscriptionTypeSelector
                                    onSelect={handleSelectSubscription}
                                    isLoading={isCreatingSubscriptionByPlan}
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center py-8">
                                <div className="text-center">
                                    <p className="text-gray-600">Ошибка загрузки данных пользователя</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                subscriptionType={selectedPlan?.type as 'monthly' | 'yearly' | null}
                paymentUrl={paymentUrl}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};
