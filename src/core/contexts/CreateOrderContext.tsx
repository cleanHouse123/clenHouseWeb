import { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentIframe } from '@/modules/orders/components';
import { useCreateOrder, useCreateOrderPayment } from '@/modules/orders/hooks/useOrders';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { OrderFormData } from '@/modules/orders/types';
import { toast } from 'sonner';
import { CreateOrderModalWithTabs } from '@/modules/orders/components/CreateOrderModalWithTabs';
import { formatTime } from '@/core/utils/dateUtils';

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
    const [numberPackages, setNumberPackages] = useState<number | undefined>(undefined);
    const [addressId, setAddressId] = useState<string | undefined>(undefined);
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

        console.log('CreateOrderContext received data:', data);
        console.log('Coordinates from context:', data.coordinates);

        try {
            const orderData = {
                customerId: user.userId,
                ...data,
            };

            console.log('Order data to API:', orderData);
            console.log('Coordinates in orderData:', orderData.coordinates);

            const order = await createOrder(orderData);

            // Формируем сообщение с временем выноса
            const scheduledTimeText = order.scheduledAt 
                ? `Вынос в ${formatTime(order.scheduledAt)}`
                : '';

            // Проверяем есть ли активная подписка
            const hasActiveSubscription = userSubscription?.status === 'active';

            if (hasActiveSubscription) {
                // Если есть активная подписка, не показываем оплату
                closeCreateOrderModal();

                // Показываем уведомление о том что заявка направлена менеджеру
                toast.success('Заявка направлена менеджеру!', {
                    description: scheduledTimeText 
                        ? `${scheduledTimeText}. Ваш заказ будет обработан в ближайшее время. Спасибо за использование подписки!`
                        : 'Ваш заказ будет обработан в ближайшее время. Спасибо за использование подписки!',
                    duration: 5000,
                });

                // Обновляем данные
                onOrderCreated?.();
            } else if (data.paymentMethod === 'online') {
                // Если способ оплаты "online", создаем ссылку на оплату
                const payment = await createOrderPayment({
                    orderId: order.id,
                    amount: order.price // цена в копейках
                });

                // Сохраняем данные платежа, количество пакетов и адрес
                setPaymentUrl(payment.paymentUrl);
                setPaymentId(payment.paymentId);
                setNumberPackages(data.numberPackages);
                setAddressId(data.addressId);

                // Показываем модальное окно с кнопкой перенаправления
                setIsPaymentIframeOpen(true);
                closeCreateOrderModal();
                
                // Показываем уведомление с временем выноса
                if (scheduledTimeText) {
                    toast.info('Заказ создан', {
                        description: scheduledTimeText,
                        duration: 5000,
                    });
                }
            } else {
                // Для других случаев просто закрываем модальное окно
                closeCreateOrderModal();
                
                // Показываем уведомление с временем выноса
                if (scheduledTimeText) {
                    toast.success('Заказ создан', {
                        description: scheduledTimeText,
                        duration: 5000,
                    });
                }
                
                onOrderCreated?.();
            }
        } catch (error: any) {
            console.error('Ошибка создания заказа:', error);
            // Ошибка уже обработана в хуке useCreateOrder через onError (показывается toast)
            // Здесь просто логируем ошибку, toast уже показан в хуке
            // Если это не axios ошибка (нет response), показываем общее сообщение
            if (!error?.response) {
                const errorMessage = error?.message || 'Произошла ошибка при создании заказа. Попробуйте еще раз.';
                toast.error('Ошибка создания заказа', {
                    description: errorMessage,
                    duration: 5000,
                });
            }
            // Для axios ошибок сообщение уже показано в хуке useCreateOrder.onError
        }
    };

    const handlePaymentError = (error: string) => {
        console.error('Ошибка оплаты:', error);
        setIsPaymentIframeOpen(false);
    };

    const handleClosePayment = () => {
        setIsPaymentIframeOpen(false);
        setNumberPackages(undefined);
        setAddressId(undefined);
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
            <CreateOrderModalWithTabs
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
                numberPackages={numberPackages}
                addressId={addressId}
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
