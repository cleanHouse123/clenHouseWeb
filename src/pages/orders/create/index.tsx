import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/core/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { CreateOrderModal, OrderList, OrderDetailsModal } from '@/modules/orders/components';
import { PaymentIframe } from '@/modules/orders/components/PaymentIframe';
import { useCreateOrder, useCustomerOrders } from '@/modules/orders/hooks/useOrders';
import { usePendingPayment } from '@/modules/orders/hooks/usePendingPayment';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { OrderFormData, OrderResponseDto } from '@/modules/orders/types';
import { ordersApi } from '@/modules/orders/api';
import {
    Plus,
    Package,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Calendar,
    MapPin
} from 'lucide-react';
import { ROUTES } from '@/core/constants/routes';

export const CreateOrderPage = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPaymentIframeOpen, setIsPaymentIframeOpen] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const { data: user, isLoading: isLoadingUser } = useGetMe();
    const { data: userSubscription, isLoading: isLoadingSubscription } = useUserSubscription();
    const { data: customerOrders, isLoading: isLoadingOrders } = useCustomerOrders();
    const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
    const { pendingPayment, clearPendingPayment, hasPendingPayment } = usePendingPayment();

    // Восстанавливаем сохраненный платеж при загрузке страницы
    useEffect(() => {
        if (pendingPayment && user?.userId === pendingPayment.userId) {
            setPaymentUrl(pendingPayment.paymentUrl);
            setPaymentId(pendingPayment.paymentId);
            setIsPaymentIframeOpen(true);
        }
    }, [pendingPayment, user?.userId]);

    const handleCreateOrder = async (data: OrderFormData) => {
        if (!user?.userId) return;

        try {
            const order = await createOrder({
                customerId: user.userId,
                ...data,
            });

            // Если выбран способ оплаты "card", создаем платеж и открываем iframe
            if (data.paymentMethod === 'card') {
                const payment = await ordersApi.createPaymentLink(order.id, 200);
                setPaymentUrl(payment.paymentUrl);
                setPaymentId(payment.paymentId);
                setIsPaymentIframeOpen(true);
            }

            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Ошибка создания заказа:', error);
        }
    };

    const handleIframePaymentSuccess = () => {
        setIsPaymentIframeOpen(false);
        clearPendingPayment(); // Очищаем сохраненный платеж
        // Обновляем список заказов
        window.location.reload();
    };

    const handlePaymentError = (error: string) => {
        console.error('Ошибка оплаты:', error);
        setIsPaymentIframeOpen(false);
        // Не очищаем localStorage при ошибке, чтобы пользователь мог попробовать снова
    };

    const handleClosePayment = () => {
        setIsPaymentIframeOpen(false);
        // Не очищаем localStorage при закрытии, чтобы пользователь мог продолжить позже
    };

    const handleOrderClick = (order: OrderResponseDto) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDetailsPaymentSuccess = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
        // Обновляем список заказов
        window.location.reload();
    };


    if (isLoadingUser || isLoadingSubscription) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Загрузка...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const hasActiveSubscription = userSubscription?.status === 'active';
    const canCreateOrder = hasActiveSubscription || true; // Пока разрешаем всем

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Заголовок */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
                            <p className="text-gray-600 mt-1">
                                Создавайте заказы на вынос мусора
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            disabled={!canCreateOrder}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Создать заказ
                        </Button>
                    </div>

                    {/* Статус подписки */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Статус подписки
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hasActiveSubscription ? (
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                            Активная подписка
                                        </Badge>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {userSubscription?.type === 'monthly' ? 'Месячная' : 'Годовая'} подписка
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    <div>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            Нет активной подписки
                                        </Badge>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Вы можете создавать заказы с разовой оплатой
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Уведомление о сохраненном платеже */}
                    {hasPendingPayment() && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-orange-800">
                                            У вас есть незавершенная оплата
                                        </h3>
                                        <p className="text-sm text-orange-700 mt-1">
                                            Вы можете продолжить оплату заказа, который был создан ранее
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            if (pendingPayment) {
                                                setPaymentUrl(pendingPayment.paymentUrl);
                                                setPaymentId(pendingPayment.paymentId);
                                                setIsPaymentIframeOpen(true);
                                            }
                                        }}
                                        size="sm"
                                        className="bg-orange-600 hover:bg-orange-700"
                                    >
                                        Продолжить оплату
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Информация о заказах */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Мои заказы
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoadingOrders ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : customerOrders?.orders && customerOrders.orders.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Всего заказов: {customerOrders.total}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(ROUTES.ORDERS.BASE)}
                                        >
                                            Посмотреть все
                                        </Button>
                                    </div>
                                    <OrderList
                                        orders={customerOrders.orders.slice(0, 3)}
                                        onStatusUpdate={(orderId, status) => {
                                            // Обработка обновления статуса
                                            console.log('Update order status:', orderId, status);
                                        }}
                                        showActions={false}
                                        onOrderClick={handleOrderClick}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Заказы не найдены
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        У вас пока нет заказов. Создайте первый заказ, чтобы начать работу.
                                    </p>
                                    <Button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        disabled={!canCreateOrder}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Создать первый заказ
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Быстрые действия */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Создать заказ</h3>
                                        <p className="text-sm text-gray-600">Вынос мусора</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Запланировать</h3>
                                        <p className="text-sm text-gray-600">На удобное время</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <CreditCard className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Оплата</h3>
                                        <p className="text-sm text-gray-600">Различные способы</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Модальное окно создания заказа */}
            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateOrder}
                isLoading={isCreatingOrder}
            />

            {/* Iframe для оплаты */}
            <PaymentIframe
                isOpen={isPaymentIframeOpen}
                onClose={handleClosePayment}
                paymentUrl={paymentUrl}
                paymentId={paymentId}
                userId={user?.userId}
                onSuccess={handleIframePaymentSuccess}
                onError={handlePaymentError}
            />

            {/* Модальное окно деталей заказа */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    onPaymentSuccess={handleDetailsPaymentSuccess}
                />
            )}
        </div>
    );
};
