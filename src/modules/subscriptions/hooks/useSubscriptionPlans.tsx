import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "../api";
import { SubscriptionPlan } from "../types";

export const useSubscriptionPlans = () => {
    return useQuery<SubscriptionPlan[]>({
        queryKey: ["subscription-plans"],
        queryFn: subscriptionApi.getSubscriptionPlans,
        staleTime: 5 * 60 * 1000, // 5 минут
        cacheTime: 10 * 60 * 1000, // 10 минут
    });
};

export const useSubscriptionPlan = (id: string) => {
    return useQuery<SubscriptionPlan>({
        queryKey: ["subscription-plan", id],
        queryFn: () => subscriptionApi.getSubscriptionPlanById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 минут
        cacheTime: 10 * 60 * 1000, // 10 минут
    });
};
