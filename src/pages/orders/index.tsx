import { useState } from 'react';
import { Header } from '@/core/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/inputs/select';
import { OrderList, OrderDetailsModal } from '@/modules/orders/components';
import { useCustomerOrders, useUpdateOrderStatus, useCancelOrder } from '@/modules/orders/hooks/useOrders';
import { OrderStatus, OrderResponseDto } from '@/modules/orders/types';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import {
    Plus,
    Package,
    Filter,
    RefreshCw
} from 'lucide-react';
import { useCreateOrderModal } from '@/core/contexts/CreateOrderContext';
import { CreateOrderProvider } from '@/core/contexts/CreateOrderContext';

const OrdersContent = () => {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const {
        data: customerOrders,
        isLoading: isLoadingOrders,
        refetch: refetchOrders
    } = useCustomerOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
    });

    const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
    const { mutateAsync: cancelOrder } = useCancelOrder();
    const { data: user } = useGetMe();
    const { openCreateOrderModal } = useCreateOrderModal();

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
        try {
            await updateOrderStatus({
                id: orderId,
                data: { status },
            });
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrder(orderId);
        } catch (error) {
            console.error('Ошибка отмены заказа:', error);
        }
    };

    const handleRefresh = () => {
        refetchOrders();
    };

    const handleOrderClick = (order: OrderResponseDto) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

    const handlePaymentSuccess = () => {
        refetchOrders();
    };


    const statusOptions = [
        { value: 'all', label: 'Все заказы' },
        { value: 'new', label: 'Новые' },
        { value: 'paid', label: 'Оплаченные' },
        { value: 'assigned', label: 'Назначенные' },
        { value: 'in_progress', label: 'Выполняются' },
        { value: 'done', label: 'Завершенные' },
        { value: 'canceled', label: 'Отмененные' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Заголовок и действия */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Мои заказы</h1>
                            <p className="text-gray-600 mt-1">
                                Управление заказами на вынос мусора
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isLoadingOrders}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                                Обновить
                            </Button>
                            <Button
                                onClick={openCreateOrderModal}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Создать заказ
                            </Button>
                        </div>
                    </div>


                    {/* Фильтры и статистика */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Фильтр по статусу */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Filter className="h-4 w-4" />
                                    Фильтр
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите статус" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Статистика */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Всего заказов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">
                                    {customerOrders?.total || 0}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Всего создано
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Активные</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {customerOrders?.orders?.filter(order =>
                                        ['new', 'assigned', 'in_progress'].includes(order.status)
                                    ).length || 0}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    В работе
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Завершенные</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {customerOrders?.orders?.filter(order => order.status === 'done').length || 0}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Выполнено
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Список заказов */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Заказы
                                {statusFilter !== 'all' && (
                                    <span className="text-sm text-gray-600">
                                        ({statusOptions.find(opt => opt.value === statusFilter)?.label})
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderList
                                orders={customerOrders?.orders || []}
                                isLoading={isLoadingOrders}
                                onStatusUpdate={handleStatusUpdate}
                                onCancel={handleCancelOrder}
                                showActions={false}
                                onOrderClick={handleOrderClick}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Модальное окно деталей заказа */}
            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                order={selectedOrder}
                userId={user?.userId}
                onPaymentSuccess={handlePaymentSuccess}
            />

        </div>
    );
};

export const OrdersPage = () => {
    return (
        <CreateOrderProvider onOrderCreated={() => window.location.reload()}>
            <OrdersContent />
        </CreateOrderProvider>
    );
};
