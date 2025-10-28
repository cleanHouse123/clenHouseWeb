import { axiosInstance } from "@/core/config/axios";
import {
  UserSubscription,
  CreateSubscriptionRequest,
  CreateSubscriptionByPlanRequest,
  CreateSubscriptionResponse,
  PaymentLinkResponse,
  SubscriptionPlan,
} from "../types";

export const subscriptionApi = {
  // Получить подписку пользователя по subscriptionId
  getUserSubscription: async (
    subscriptionId: string
  ): Promise<UserSubscription | null> => {
    const response = await axiosInstance.get(
      `/subscriptions/user/${subscriptionId}`
    );
    return response.data;
  },

  // Получить подписку пользователя по userId
  getUserSubscriptionByUserId: async (
    userId: string
  ): Promise<UserSubscription | null> => {
    const response = await axiosInstance.get(`/subscriptions?userId=${userId}`);
    const data = response.data;
    // Если есть подписки, возвращаем первую (у пользователя может быть только одна)
    return data.subscriptions && data.subscriptions.length > 0
      ? data.subscriptions[0]
      : null;
  },

  // Создать подписку по ID плана (новый упрощенный метод)
  createSubscriptionByPlan: async (
    planId: string
  ): Promise<CreateSubscriptionResponse> => {
    console.log("API createSubscriptionByPlan request data:", { planId });
    const response = await axiosInstance.post("/subscriptions/by-plan", {
      planId,
    });
    return response.data;
  },

  // Создать подписку
  createSubscription: async (
    data: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> => {
    console.log("API createSubscription request data:", data);
    const response = await axiosInstance.post("/subscriptions", data);
    return response.data;
  },

  // Создать ссылку на оплату подписки (обновленный endpoint согласно документации)
  createSubscriptionPayment: async (
    subscriptionId: string,
    subscriptionType: "monthly" | "yearly",
    planId: string,
    amount: number
  ): Promise<PaymentLinkResponse> => {
    console.log("API createSubscriptionPayment request data:", {
      subscriptionId,
      subscriptionType,
      planId,
      amount,
    });
    const response = await axiosInstance.post("/subscriptions/payment/create", {
      subscriptionId,
      subscriptionType,
      planId,
      amount: amount,
    });
    return response.data;
  },

  // Проверить статус платежа подписки
  checkPaymentStatus: async (
    paymentId: string
  ): Promise<{
    id: string;
    subscriptionId: string;
    amount: number;
    status: "pending" | "success" | "failed" | "refunded";
    subscriptionType: string;
    createdAt: string;
  }> => {
    const response = await axiosInstance.get(
      `/subscriptions/payment/status/${paymentId}`
    );
    return response.data;
  },

  // Универсальная проверка статуса платежа (для любых типов платежей)
  checkUniversalPaymentStatus: async (
    paymentId: string
  ): Promise<{
    id: string;
    subscriptionId?: string;
    orderId?: string;
    amount: number;
    status: "pending" | "paid" | "success" | "failed" | "canceled" | "refunded";
    createdAt: string;
  }> => {
    const response = await axiosInstance.get(`/payment-status/${paymentId}`);
    return response.data;
  },

  // Удалить подписку
  deleteSubscription: async (
    subscriptionId: string
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(
      `/subscriptions/${subscriptionId}`
    );
    return response.data;
  },

  // Получить все планы подписок
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await axiosInstance.get("/subscription-plans");
    return response.data;
  },

  // Получить план подписки по ID
  getSubscriptionPlanById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.get(`/subscription-plans/${id}`);
    return response.data;
  },

  // Создать платеж с планом подписки (обновленная функция)
  createPaymentWithPlan: async (
    subscriptionId: string,
    plan: SubscriptionPlan
  ): Promise<PaymentLinkResponse> => {
    return subscriptionApi.createSubscriptionPayment(
      subscriptionId,
      plan.type as "monthly" | "yearly",
      plan.id,
      plan.priceInKopecks
    );
  },
};
