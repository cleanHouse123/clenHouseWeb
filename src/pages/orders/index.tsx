import { useState } from 'react';
import { Header } from '@/core/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
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
    } = useCustomerOrders();

    const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
    const { mutateAsync: cancelOrder } = useCancelOrder();
    const { data: user } = useGetMe();
    const { openCreateOrderModal } = useCreateOrderModal();

    // Фильтрация заказов на фронтенде
    const filteredOrders = customerOrders?.orders?.filter(order =>
        statusFilter === 'all' || order.status === statusFilter
    ) || [];

    // Функция для подсчета заказов по статусу
    const getOrdersCountByStatus = (status: OrderStatus | 'all') => {
        if (status === 'all') {
            return customerOrders?.orders?.length || 0;
        }
        return customerOrders?.orders?.filter(order => order.status === status).length || 0;
    };

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

            <main className="container mx-auto px-4 py-4 sm:py-8">
                <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                    {/* Заголовок и действия */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Мои заказы</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                Управление заказами на вынос мусора
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isLoadingOrders}
                                className="w-full sm:w-auto"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Обновить</span>
                                <span className="sm:hidden">Обновить</span>
                            </Button>
                            <Button
                                onClick={openCreateOrderModal}
                                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Создать заказ</span>
                                <span className="sm:hidden">Создать</span>
                            </Button>
                        </div>
                    </div>


                    {/* Фильтры по статусам */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Filter className="h-4 w-4" />
                                Фильтр по статусам
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={statusFilter === option.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setStatusFilter(option.value as OrderStatus | 'all')}
                                        className="text-xs"
                                    >
                                        {option.label} ({getOrdersCountByStatus(option.value as OrderStatus | 'all')})
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>


                    {/* Список заказов */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                Заказы
                                {statusFilter !== 'all' && (
                                    <span className="text-xs sm:text-sm text-gray-600">
                                        ({statusOptions.find(opt => opt.value === statusFilter)?.label}: {filteredOrders.length})
                                    </span>
                                )}
                                {statusFilter === 'all' && (
                                    <span className="text-xs sm:text-sm text-gray-600">
                                        (Всего: {filteredOrders.length})
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 sm:p-6">
                            <OrderList
                                orders={filteredOrders}
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
