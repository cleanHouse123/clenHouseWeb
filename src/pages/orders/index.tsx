import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/core/components/ui/button/button';
import { OrderDetailsModal } from '@/modules/orders/components';
import { OrderCard } from '@/pages/dashboard/components/OrderCard';
import { useCustomerOrders, useCreateOrderPayment } from '@/modules/orders/hooks/useOrders';
import { OrderStatus, OrderResponseDto } from '@/modules/orders/types';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import {
    Package,
    ChevronRight
} from 'lucide-react';
import { useCreateOrderModal } from '@/core/contexts/CreateOrderContext';
import { CreateOrderProvider } from '@/core/contexts/CreateOrderContext';
import { toast } from 'sonner';

const OrdersContent = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const {
        data: customerOrders,
        isLoading: isLoadingOrders,
        refetch: refetchOrders
    } = useCustomerOrders();

    const { mutateAsync: createOrderPayment } = useCreateOrderPayment();
    const { data: user } = useGetMe();
    const { openCreateOrderModal } = useCreateOrderModal();

    const handleCreateOrder = () => {
        openCreateOrderModal();
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02 }
    };

    // Фильтрация заказов на фронтенде
    const filteredOrders = customerOrders?.filter(order =>
        statusFilter === 'all' || order.status === statusFilter
    ) || [];


    // Функция для подсчета заказов по статусу
    const getOrdersCountByStatus = (status: OrderStatus | 'all') => {
        if (status === 'all') {
            return customerOrders?.length || 0;
        }
        return customerOrders?.filter(order => order.status === status).length || 0;
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

    const handlePayOrder = async (order: OrderResponseDto) => {
        try {
            const payment = await createOrderPayment({
                orderId: order.id,
                amount: order.price
            });

            // Сохраняем данные платежа в sessionStorage для возврата
            sessionStorage.setItem('returnUrl', window.location.pathname);
            sessionStorage.setItem('paymentType', 'order');
            sessionStorage.setItem('pendingPaymentId', payment.paymentId);

            // Перенаправляем на оплату
            window.location.href = payment.paymentUrl;
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
            toast.error('Ошибка создания платежа', {
                description: 'Не удалось создать ссылку на оплату. Попробуйте еще раз.',
                duration: 5000,
            });
        }
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
                            <span className="text-gray-900 font-medium">Мои заказы</span>
                        </nav>

                        {/* Заголовок и действия */}
                        <div className="flex flex-col  md:flex-row lg:items-start justify-between gap-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    Мои заказы
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Управление заказами на вынос мусора
                                </p>
                            </div>
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                transition={{ duration: 0.3, delay: 0.1 }}
                                onClick={handleCreateOrder}
                                className="sm:col-span-2 lg:col-span-1 cursor-pointer group "
                            >
                                <div className=" gap-[10px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl p-4 h-[99px] flex flex-row justify-between transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-[8px]">
                                            Создать заказ
                                        </h3>
                                        <p className="text-orange-100 text-sm sm:text-base">
                                            Вызовите курьера
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                            <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.6666 6.66675V25.3334M7.33331 16.0001H26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>

                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={statusFilter === option.value ? "primary" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(option.value as OrderStatus | 'all')}
                                className={`text-xs border-none text-black ${statusFilter === option.value ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                            >
                                {option.label} ({getOrdersCountByStatus(option.value as OrderStatus | 'all')})
                            </Button>
                        ))}
                    </div>

                    {/* Список заказов */}
                    <div className="bg-white rounded-[32px] p-[18px] md:p-[36px]">
                        {isLoadingOrders ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-[16px] p-4 animate-pulse">
                                        <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
                                        <div className="flex gap-4 mb-4">
                                            <div className="flex-1 bg-gray-100 rounded-[16px] p-4">
                                                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-4 w-16 bg-gray-200 rounded mb-3"></div>
                                                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="bg-gray-100 rounded-[12px] p-3 w-20">
                                                <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                                                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Заказов пока нет
                                </h3>

                                <Button onClick={openCreateOrderModal} className="px-6">
                                    <Package className="h-4 w-4 mr-2" />
                                    Создать заказ
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onClick={handleOrderClick}
                                        onPay={handlePayOrder}
                                        showBorder={false}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>


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
