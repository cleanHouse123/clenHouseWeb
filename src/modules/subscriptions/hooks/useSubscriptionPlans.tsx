import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "../api";
import { SubscriptionPlan } from "../types";
import { useGetMe } from "@/modules/auth/hooks/useGetMe";

export const useSubscriptionPlans = () => {
    const { data: user } = useGetMe();
    const isAuthenticated = !!user;

    return useQuery<SubscriptionPlan[]>({
        queryKey: ["subscription-plans", isAuthenticated ? "with-prices" : "public"],
        queryFn: isAuthenticated 
            ? subscriptionApi.getSubscriptionPlansWithPrices 
            : subscriptionApi.getSubscriptionPlans,
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут
    });
};

export const useSubscriptionPlan = (id: string) => {
    return useQuery<SubscriptionPlan>({
        queryKey: ["subscription-plan", id],
        queryFn: () => subscriptionApi.getSubscriptionPlanById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут
    });
};
