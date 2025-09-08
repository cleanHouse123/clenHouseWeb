import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api';
import { CreateOrderDto, OrderQueryParams, UpdateOrderStatusDto } from '../types';
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
        queryFn: () => ordersApi.getCustomerOrders(user!.userId, params),
        enabled: !!user?.userId,
    });
};

// Получить заказы курьера
export const useCurrierOrders = (currierId: string, params?: Omit<OrderQueryParams, 'currierId'>) => {
    return useQuery({
        queryKey: ['currier-orders', currierId, params],
        queryFn: () => ordersApi.getCurrierOrders(currierId, params),
        enabled: !!currierId,
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

// Курьер берет заказ
export const useTakeOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ordersApi.takeOrder(id),
        onSuccess: (data) => {
            toast.success('Заказ взят!', {
                description: `Заказ #${data.id.slice(-8)} взят в работу`,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка взятия заказа';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Курьер начинает выполнение
export const useStartOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ordersApi.startOrder(id),
        onSuccess: (data) => {
            toast.success('Выполнение начато!', {
                description: `Заказ #${data.id.slice(-8)} выполняется`,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка начала выполнения';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Курьер завершает заказ
export const useCompleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ordersApi.completeOrder(id),
        onSuccess: (data) => {
            toast.success('Заказ завершен!', {
                description: `Заказ #${data.id.slice(-8)} успешно выполнен`,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка завершения заказа';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Курьер отменяет заказ
export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ordersApi.cancelOrder(id),
        onSuccess: (data) => {
            toast.success('Заказ отменен!', {
                description: `Заказ #${data.id.slice(-8)} отменен`,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
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

// Удалить заказ
export const useDeleteOrder = () => {
    const queryClient = useQueryClient();
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: (id: string) => ordersApi.deleteOrder(id),
        onSuccess: (data) => {
            toast.success('Заказ удален!', {
                description: data.message,
                duration: 4000,
            });

            // Обновляем кэш заказов
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['customer-orders', user?.userId] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка удаления заказа';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};
