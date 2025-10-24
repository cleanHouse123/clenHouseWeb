import { axiosInstance } from "@/core/config/axios";
import {
  UserSubscription,
  CreateSubscriptionRequest,
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

  // Создать подписку
  createSubscription: async (
    data: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> => {
    console.log("API createSubscription request data:", data);
    const response = await axiosInstance.post("/subscriptions", data);
    return response.data;
  },

  // Создать ссылку на оплату подписки (новый endpoint согласно документации)
  createSubscriptionPayment: async (
    subscriptionId: string,
    subscriptionType: "monthly" | "yearly",
    amount: number
  ): Promise<PaymentLinkResponse> => {
    console.log("API createSubscriptionPayment request data:", {
      subscriptionId,
      subscriptionType,
      amount,
    });
    const response = await axiosInstance.post("/subscription/payment/create", {
      subscriptionId,
      subscriptionType,
      amount,
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
    status: "pending" | "paid" | "failed";
    createdAt: string;
  }> => {
    const response = await axiosInstance.get(
      `/subscriptions/payment/status/${paymentId}`
    );
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

  // Создать платеж с планом подписки (упрощенная функция)
  createPaymentWithPlan: async (
    subscriptionId: string,
    plan: SubscriptionPlan
  ): Promise<PaymentLinkResponse> => {
    return subscriptionApi.createSubscriptionPayment(
      subscriptionId,
      plan.type as "monthly" | "yearly",
      plan.priceInKopecks
    );
  },
};
