import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "../api";
import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { createUTCDate, createUTCDateWithMonths, createUTCDateWithYears } from "@/core/utils/dateUtils";
import { User } from "@/core/types/user";


export const useSubscriptionPlans = () => {
    const { data: user } = useGetMe();
    const isAuthenticated = !!user;

    return useQuery({
        queryKey: ["subscription-plans", isAuthenticated ? "with-prices" : "public"],
        queryFn: () => isAuthenticated
            ? subscriptionApi.getSubscriptionPlansWithPrices()
            : subscriptionApi.getSubscriptionPlans(),
    });
};

export const useUserSubscription = () => {
    const { data: user, isLoading: isLoadingUser } = useGetMe();

    return useQuery({
        queryKey: ["user-subscription", user?.userId],
        queryFn: () => subscriptionApi.getUserSubscriptionByUserId(user?.userId || ''),
        enabled: !!user?.userId && !isLoadingUser,
        retry: (failureCount) => {
            return failureCount < 2;
        },
    });
};

export const useCreateSubscription = () => {
    const { data: user, isLoading: isLoadingUser } = useGetMe();

    return useMutation({
        mutationFn: (data: { type: "monthly" | "yearly"; price: number; ordersLimit: number }) => {
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

            // Используем новые утилиты для корректной работы с UTC
            const startDate = createUTCDate();
            const endDateString = data.type === 'monthly'
                ? createUTCDateWithMonths(1)
                : createUTCDateWithYears(1);

            const requestData = {
                userId: user.userId,
                type: data.type,
                price: data.price,
                startDate,
                endDate: endDateString,
                ordersLimit: data.ordersLimit,
                status: 'pending' // Добавляем статус pending для временной подписки
            };


            console.log('Creating subscription with data:', requestData);
            return subscriptionApi.createSubscription(requestData);
        },
        onSuccess: () => {
            // toast.success('Подписка создана!', {
            //     description: data.message || 'Подписка успешно создана',
            //     duration: 4000,
            // });
            // // Обновляем подписку пользователя
            // queryClient.invalidateQueries({ queryKey: ['user-subscription', user?.userId] });
        },
        onError: (error: Error) => {
            console.error('Subscription creation error:', error);

            let errorMessage = 'Ошибка создания подписки';

            if (isAxiosError(error) && error.response?.data?.message) {
                const responseData = error.response.data.message;
                if (Array.isArray(responseData)) {
                    errorMessage = responseData.join(', ');
                } else {
                    errorMessage = responseData;
                }
            }

            toast.error('Ошибка создания подписки', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};

export const useCreateSubscriptionByPlan = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading: isLoadingUser } = useGetMe();

    return useMutation({
        mutationFn: async (planId: string) => {
            // Проверяем, загружается ли пользователь
            if (isLoadingUser) {
                throw new Error('Загрузка данных пользователя...');
            }

            // Получаем актуальные данные пользователя из кэша, если они еще не загружены
            let currentUser = user;
            if (!currentUser) {
                const cachedUser = queryClient.getQueryData<User>(['me']);
                currentUser = cachedUser || undefined;
            }

            // Если пользователь все еще не найден
            if (!currentUser?.userId) {
                throw new Error('Пользователь не найден. Пожалуйста, войдите в систему.');
            }

            console.log('Creating subscription by plan:', { planId, userId: currentUser.userId });
            return subscriptionApi.createSubscriptionByPlan(planId);
        },
        onSuccess: () => {
            toast.success('Подписка создана!', {
                description: 'Подписка успешно создана по выбранному плану',
                duration: 4000,
            });
            // Обновляем подписку пользователя
            // Используем широкий ключ, чтобы обновить все подписки пользователя
            queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
            queryClient.invalidateQueries({ queryKey: ["subscription-plans", "with-prices"] });
            queryClient.invalidateQueries({ queryKey: ["subscription-plans", "public"] });
            // Также обновляем данные пользователя на случай, если они изменились
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: (error: Error) => {
            console.error('Subscription creation by plan error:', error);

            let errorMessage = 'Ошибка создания подписки';

            if (isAxiosError(error) && error.response?.data?.message) {
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
    return useMutation({
        mutationFn: (data: { subscriptionId: string; subscriptionType: 'monthly' | 'yearly'; planId: string }) =>
            subscriptionApi.createSubscriptionPayment(
                data.subscriptionId,
                data.subscriptionType,
                data.planId
            ),
        onSuccess: (response) => {
            // Если подписка активирована бесплатно
            if (response.status === 'success' && !response.paymentUrl) {
                toast.success('Подписка активирована!', {
                    description: 'Вы получили бесплатную подписку за приглашение друзей',
                    duration: 4000,
                });
            } else if (response.paymentUrl) {
                toast.success('Ссылка на оплату создана!', {
                    description: 'Перенаправляем на страницу оплаты...',
                    duration: 4000,
                });
            }
        },
        onError: (error: Error) => {
            const errorMessage = isAxiosError(error) ? error.response?.data?.message || 'Ошибка создания ссылки на оплату' : 'Ошибка создания ссылки на оплату';
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
        onError: (error: Error) => {
            const errorMessage = isAxiosError(error) ? error.response?.data?.message || 'Ошибка удаления подписки' : 'Ошибка удаления подписки';
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
        onError: (error: Error) => {
            console.error('Ошибка проверки статуса платежа подписки:', error);
        },
    });
};

// Универсальная проверка статуса платежа (для любых типов платежей)
export const useCheckUniversalPaymentStatus = () => {
    return useMutation({
        mutationFn: (paymentId: string) => subscriptionApi.checkUniversalPaymentStatus(paymentId),
        onError: (error: Error) => {
            console.error('Ошибка проверки статуса платежа:', error);
        },
    });
};
