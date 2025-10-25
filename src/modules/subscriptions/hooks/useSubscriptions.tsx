import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "../api";
import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { toast } from "sonner";

export const useSubscriptionPlans = () => {
    return useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => subscriptionApi.getSubscriptionPlans(),
    });
};

export const useUserSubscription = () => {
    const { data: user, isLoading: isLoadingUser } = useGetMe();

    return useQuery({
        queryKey: ["user-subscription", user?.userId],
        queryFn: () => subscriptionApi.getUserSubscriptionByUserId(user?.userId || ''),
        enabled: !!user?.userId && !isLoadingUser,
        retry: (failureCount, error: any) => {
            return failureCount < 2;
        },
    });
};

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading: isLoadingUser } = useGetMe();

    return useMutation({
        mutationFn: (data: { type: "monthly" | "yearly"; price: number }) => {
            if (isLoadingUser) {
                throw new Error('Загрузка данных пользователя...');
            }

            if (!user?.userId) {
                throw new Error('Пользователь не найден');
            }

            console.log('User data:', user);
            console.log('User ID:', user.userId, 'Type:', typeof user.userId);

            // Проверяем формат UUID
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(user.userId)) {
                console.error('Invalid UUID format:', user.userId);
                throw new Error(`Неверный формат ID пользователя: ${user.userId}`);
            }

            const now = new Date();

            // Создаем строку в локальном формате без суффикса Z
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            const startDate = `${year}-${month}-${day}T${hour}:${minute}:${second}.000`;

            // Вычисляем дату окончания в зависимости от типа подписки
            const endDate = new Date(now);
            if (data.type === 'monthly') {
                endDate.setMonth(endDate.getMonth() + 1);
            } else {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            const endYear = endDate.getFullYear();
            const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
            const endDay = String(endDate.getDate()).padStart(2, '0');
            const endHour = String(endDate.getHours()).padStart(2, '0');
            const endMinute = String(endDate.getMinutes()).padStart(2, '0');
            const endSecond = String(endDate.getSeconds()).padStart(2, '0');
            const endDateString = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:${endSecond}.000`;

            const requestData = {
                userId: user.userId,
                type: data.type,
                price: data.price, // цена в копейках
                startDate,
                endDate: endDateString
            };

            console.log('Creating subscription with data:', requestData);
            return subscriptionApi.createSubscription(requestData);
        },
        onSuccess: (data) => {
            // toast.success('Подписка создана!', {
            //     description: data.message || 'Подписка успешно создана',
            //     duration: 4000,
            // });
            // // Обновляем подписку пользователя
            // queryClient.invalidateQueries({ queryKey: ['user-subscription', user?.userId] });
        },
        onError: (error: any) => {
            console.error('Subscription creation error:', error);

            let errorMessage = 'Ошибка создания подписки';

            if (error?.response?.data?.message) {
                if (Array.isArray(error.response.data.message)) {
                    errorMessage = error.response.data.message.join(', ');
                } else {
                    errorMessage = error.response.data.message;
                }
            }

            toast.error('Ошибка создания подписки', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

export const useCreatePaymentLink = () => {
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: (data: { subscriptionId: string; subscriptionType: 'monthly' | 'yearly'; planId: string; amount: number }) =>
            subscriptionApi.createSubscriptionPayment(
                data.subscriptionId,
                data.subscriptionType,
                data.planId,
                data.amount
            ),
        onSuccess: (data) => {
            toast.success('Ссылка на оплату создана!', {
                description: 'Перенаправляем на страницу оплаты...',
                duration: 4000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка создания ссылки на оплату';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

export const useDeleteSubscription = () => {
    const queryClient = useQueryClient();
    const { data: user } = useGetMe();

    return useMutation({
        mutationFn: (subscriptionId: string) =>
            subscriptionApi.deleteSubscription(subscriptionId),
        onSuccess: (data) => {
            toast.success('Подписка удалена!', {
                description: data.message,
                duration: 4000,
            });
            // Обновляем подписку пользователя
            queryClient.invalidateQueries({ queryKey: ['user-subscription', user?.userId] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Ошибка удаления подписки';
            toast.error('Ошибка', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

// Проверить статус платежа подписки
export const useCheckSubscriptionPaymentStatus = () => {
    return useMutation({
        mutationFn: (paymentId: string) => subscriptionApi.checkPaymentStatus(paymentId),
        onError: (error: any) => {
            console.error('Ошибка проверки статуса платежа подписки:', error);
        },
    });
};
