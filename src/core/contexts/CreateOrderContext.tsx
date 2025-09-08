import { createContext, useContext, useState, ReactNode } from 'react';
import { CreateOrderModal, PaymentIframe } from '@/modules/orders/components';
import { useCreateOrder } from '@/modules/orders/hooks/useOrders';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { OrderFormData } from '@/modules/orders/types';
import { ordersApi } from '@/modules/orders/api';

interface CreateOrderContextType {
    openCreateOrderModal: () => void;
    closeCreateOrderModal: () => void;
    isCreateOrderModalOpen: boolean;
}

const CreateOrderContext = createContext<CreateOrderContextType | undefined>(undefined);

interface CreateOrderProviderProps {
    children: ReactNode;
    onOrderCreated?: () => void;
}

export const CreateOrderProvider = ({ children, onOrderCreated }: CreateOrderProviderProps) => {
    const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
    const [isPaymentIframeOpen, setIsPaymentIframeOpen] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
    const { data: user } = useGetMe();


    const openCreateOrderModal = () => {
        setIsCreateOrderModalOpen(true);
    };

    const closeCreateOrderModal = () => {
        setIsCreateOrderModalOpen(false);
    };

    const handleCreateOrder = async (data: OrderFormData) => {
        if (!user?.userId) return;

        try {
            const order = await createOrder({
                customerId: user.userId,
                ...data,
            });

            // Если способ оплаты "online", создаем ссылку на оплату
            if (data.paymentMethod === 'online') {
                const payment = await ordersApi.createPaymentLink(order.id, 200);
                setPaymentUrl(payment.paymentUrl);
                setPaymentId(payment.paymentId);
                setIsPaymentIframeOpen(true);
            }

            closeCreateOrderModal();
        } catch (error) {
            console.error('Ошибка создания заказа:', error);
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentIframeOpen(false);
        // Обновляем данные после успешной оплаты
        onOrderCreated?.();
    };

    const handlePaymentError = (error: string) => {
        console.error('Ошибка оплаты:', error);
        setIsPaymentIframeOpen(false);
    };

    const handleClosePayment = () => {
        setIsPaymentIframeOpen(false);
    };

    return (
        <CreateOrderContext.Provider
            value={{
                openCreateOrderModal,
                closeCreateOrderModal,
                isCreateOrderModalOpen,
            }}
        >
            {children}

            {/* Глобальное модальное окно создания заказа */}
            <CreateOrderModal
                isOpen={isCreateOrderModalOpen}
                onClose={closeCreateOrderModal}
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
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
            />
        </CreateOrderContext.Provider>
    );
};

export const useCreateOrderModal = () => {
    const context = useContext(CreateOrderContext);
    if (context === undefined) {
        throw new Error('useCreateOrderModal must be used within a CreateOrderProvider');
    }
    return context;
};
