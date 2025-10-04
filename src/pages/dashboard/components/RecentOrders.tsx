import React, { useState } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderResponseDto } from '@/modules/orders/types';
import { useCreateOrderModal } from '@/core/contexts/CreateOrderContext';
import { OrderCard } from './OrderCard';
import { OrderDetailsModal } from '@/modules/orders/components';

interface RecentOrdersProps {
    orders: OrderResponseDto[];
    isLoading?: boolean;
}

export const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
    const navigate = useNavigate();
    const { openCreateOrderModal } = useCreateOrderModal();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleOrderClick = (order: OrderResponseDto) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

    const handlePaymentSuccess = () => {
        // Можно добавить логику обновления данных
    };

    // Общий компонент модального окна
    const ModalComponent = () => (
        <OrderDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={handleCloseDetailsModal}
            order={selectedOrder}
            onPaymentSuccess={handlePaymentSuccess}
        />
    );

    // Компонент заголовка
    const Header = ({ showButton = true }: { showButton?: boolean }) => (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
                Последние заказы
            </h2>
            {showButton && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/orders')}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                >
                    Все заказы
                    <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
            )}
        </div>
    );

    // Компонент скелетона загрузки
    const LoadingSkeleton = () => (
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
    );

    // Компонент пустого состояния
    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Заказов пока нет
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                Создайте свой первый заказ на вынос мусора
            </p>
            <Button onClick={openCreateOrderModal} className="px-6">
                <Package className="h-4 w-4 mr-2" />
                Создать заказ
            </Button>
        </div>
    );

    // Общий wrapper
    const Container = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white rounded-[32px] p-[18px] md:p-[36px]">
            {children}
            <ModalComponent />
        </div>
    );

    if (isLoading) {
        return (
            <Container>
                <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <LoadingSkeleton />
            </Container>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <Container>
                <Header showButton={false} />
                <EmptyState />
            </Container>
        );
    }

    return (
        <Container>
            <Header />
            <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onClick={handleOrderClick}
                        showBorder={false}
                    />
                ))}
            </div>
        </Container>
    );
};
