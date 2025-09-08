import { useState } from 'react';
import { Header } from '@/core/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { Badge } from '@/core/components/ui/badge';
import {
    useUserSubscription,
    useCreateSubscription,
    useCreatePaymentLink,
    useDeleteSubscription
} from '@/modules/subscriptions/hooks/useSubscriptions';
import { usePaymentWebSocket } from '@/modules/subscriptions/hooks/usePaymentWebSocket';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { SubscriptionTypeSelector } from '@/modules/subscriptions/components/SubscriptionTypeSelector';
import { UserSubscriptionCard } from '@/modules/subscriptions/components/UserSubscriptionCard';
import { PaymentModal } from '@/modules/subscriptions/components/PaymentModal';
import {
    CreditCard,
    Wifi,
    WifiOff,
    Plus
} from 'lucide-react';

export const SubscriptionsPage = () => {
    const [selectedType, setSelectedType] = useState<'monthly' | 'yearly' | null>(null);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { data: user, isLoading: isLoadingUser } = useGetMe();
    const { data: userSubscription, isLoading: isLoadingUserSubscription } = useUserSubscription();
    const { mutateAsync: createSubscription, isPending: isCreatingSubscription } = useCreateSubscription();
    const { mutateAsync: createPaymentLink, isPending: isCreatingPaymentLink } = useCreatePaymentLink();
    const { mutateAsync: deleteSubscription } = useDeleteSubscription();

    const { isConnected } = usePaymentWebSocket();

    const handleSelectSubscription = async (type: 'monthly' | 'yearly', price: number) => {
        try {
            setSelectedType(type);

            // Создаем подписку
            const subscriptionResult = await createSubscription({
                type,
                price
            });

            console.log('Subscription created:', subscriptionResult);

            // Создаем ссылку на оплату с реальным subscriptionId
            const paymentData = await createPaymentLink({
                subscriptionId: subscriptionResult.id,
                subscriptionType: type,
                amount: price
            });
            setPaymentUrl(paymentData.paymentUrl);

            // Открываем модальное окно оплаты
            setIsPaymentModalOpen(true);
        } catch (error) {
            console.error('Ошибка при выборе подписки:', error);
        }
    };


    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedType(null);
        setPaymentUrl(null);
    };

    const handlePayExistingSubscription = async (subscriptionId: string) => {
        try {
            // Создаем ссылку на оплату для существующей подписки
            const paymentData = await createPaymentLink({
                subscriptionId: subscriptionId,
                subscriptionType: userSubscription?.type || 'monthly',
                amount: Number(userSubscription?.price) || 1000
            });

            setSelectedType(userSubscription?.type || 'monthly');
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
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Подписки</h1>
                            <p className="text-muted-foreground mt-2">
                                У вас может быть только одна активная подписка
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <Wifi className="h-3 w-3 mr-1" />

                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                    <WifiOff className="h-3 w-3 mr-1" />

                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {(isLoadingUser || isLoadingUserSubscription) ? (
                    <div className="flex justify-center py-8">
                        <LoadingIndicator />
                    </div>
                ) : userSubscription ? (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Текущая подписка
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <UserSubscriptionCard
                                    userSubscription={userSubscription}
                                    onPay={handlePayExistingSubscription}
                                    onDelete={handleDeleteSubscription}
                                />
                            </CardContent>
                        </Card>
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    Оформить подписку
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SubscriptionTypeSelector
                                    onSelect={handleSelectSubscription}
                                    isLoading={isCreatingSubscription || isCreatingPaymentLink}
                                />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex justify-center py-8">
                        <div className="text-center">
                            <p className="text-muted-foreground">Ошибка загрузки данных пользователя</p>
                        </div>
                    </div>
                )}
            </main>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                subscriptionType={selectedType}
                paymentUrl={paymentUrl}
            />
        </div>
    );
};
