import { createContext, useContext, useState, ReactNode } from 'react';
import { CreateOrderModal, PaymentIframe } from '@/modules/orders/components';
import { useCreateOrder, useCreateOrderPayment } from '@/modules/orders/hooks/useOrders';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { OrderFormData } from '@/modules/orders/types';
import { toast } from 'sonner';

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
    const { mutateAsync: createOrderPayment } = useCreateOrderPayment();
    const { data: user } = useGetMe();
    const { data: userSubscription } = useUserSubscription();


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

            // Проверяем есть ли активная подписка
            const hasActiveSubscription = userSubscription?.status === 'active';

            if (hasActiveSubscription) {
                // Если есть активная подписка, не показываем оплату
                closeCreateOrderModal();

                // Показываем уведомление о том что заявка направлена менеджеру
                toast.success('Заявка направлена менеджеру!', {
                    description: 'Ваш заказ будет обработан в ближайшее время. Спасибо за использование подписки!',
                    duration: 5000,
                });

                // Обновляем данные
                onOrderCreated?.();
            } else if (data.paymentMethod === 'online') {
                // Если способ оплаты "online", создаем ссылку на оплату
                const payment = await createOrderPayment({
                    orderId: order.id,
                    amount: 200
                });

                // Сохраняем данные платежа
                setPaymentUrl(payment.paymentUrl);
                setPaymentId(payment.paymentId);

                // Показываем модальное окно с кнопкой перенаправления
                setIsPaymentIframeOpen(true);
                closeCreateOrderModal();
            } else {
                // Для других случаев просто закрываем модальное окно
                closeCreateOrderModal();
                onOrderCreated?.();
            }
        } catch (error) {
            console.error('Ошибка создания заказа:', error);
            toast.error('Ошибка создания заказа', {
                description: 'Произошла ошибка при создании заказа. Попробуйте еще раз.',
                duration: 5000,
            });
        }
    };

    const handlePaymentSuccess = () => {
        console.log('CreateOrderContext: handlePaymentSuccess вызван');
        setIsPaymentIframeOpen(false);
        console.log('CreateOrderContext: модалка оплаты закрыта');
        // Обновляем данные после успешной оплаты
        onOrderCreated?.();
        console.log('CreateOrderContext: данные заказов обновлены');
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

            {/* Модальное окно для перенаправления на оплату */}
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
