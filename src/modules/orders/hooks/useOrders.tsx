import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api';
import { CreateOrderDto, OrderQueryParams, UpdateOrderStatusDto, OrderPaymentRequest } from '../types';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { toast } from 'sonner';

// Получить список заказов
export const useOrders = (params?: OrderQueryParams) => {
    return useQuery({
        queryKey: ['orders', params],
        queryFn: () => ordersApi.getOrders(params),
        staleTime: 30000, // 30 секунд
    });
};

// Получить заказ по ID
export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => ordersApi.getOrderById(id),
        enabled: !!id,
    });
};

// Получить заказы текущего пользователя (клиента)
export const useCustomerOrders = (params?: Omit<OrderQueryParams, 'customerId'>) => {
    const { data: user } = useGetMe();

    return useQuery({
        queryKey: ['customer-orders', user?.userId, params],
        queryFn: () => ordersApi.getCustomerOrders(user!.userId),
        enabled: !!user?.userId,
    });
};


// Создать заказ
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: (data: CreateOrderDto) => ordersApi.createOrder(data),
        onSuccess: (data) => {
            toast.success('Заказ создан!', {
                description: `Заказ #${data.id.slice(-8)} успешно создан`,
                duration: 5000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['customer-orders', user?.userId] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка создания заказа';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Обновить статус заказа
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
            ordersApi.updateOrderStatus(id, data),
        onSuccess: (data) => {
            toast.success('Статус обновлен!', {
                description: `Статус заказа #${data.id.slice(-8)} изменен на ${data.status}`,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
            queryClient.invalidateQueries({ queryKey: ['customer-orders', user?.userId] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка обновления статуса';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Отменить заказ
export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: (id: string) => ordersApi.cancelOrder(id),
        onSuccess: (data) => {
            toast.success('Заказ отменен!', {
                description: `Заказ #${data.id.slice(-8)} успешно отменен`,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
            queryClient.invalidateQueries({ queryKey: ['customer-orders', user?.userId] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка отмены заказа';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Создать платеж заказа
export const useCreateOrderPayment = () => {
    const queryClient = useQueryClient();
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: (data: OrderPaymentRequest) => ordersApi.createPaymentLink(data.orderId, data.amount),
        onSuccess: () => {
            toast.success('Ссылка на оплату создана!', {
                description: 'Перенаправляем на страницу оплаты...',
                duration: 3000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['customer-orders', user?.userId] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка создания платежа';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Проверить статус платежа заказа
export const useCheckOrderPaymentStatus = () => {
    return useMutation({
        mutationFn: (paymentId: string) => ordersApi.checkPaymentStatus(paymentId),
        onError: (error: any) => {
            console.error('Ошибка проверки статуса платежа:', error);
        },
    });
};

// Универсальная проверка статуса платежа (для любых типов платежей)
export const useCheckUniversalPaymentStatus = () => {
    return useMutation({
        mutationFn: (paymentId: string) => ordersApi.checkUniversalPaymentStatus(paymentId),
        onError: (error: any) => {
            console.error('Ошибка проверки статуса платежа:', error);
        },
    });
};

