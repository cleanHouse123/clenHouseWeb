import { axiosInstance } from "@/core/config/axios";
import {
  UserSubscription,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PaymentLinkRequest,
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

  // Создать ссылку на оплату
  createPaymentLink: async (
    data: PaymentLinkRequest
  ): Promise<PaymentLinkResponse> => {
    console.log("API createPaymentLink request data:", data);
    const response = await axiosInstance.post(
      "/subscriptions/payment/create",
      data
    );
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

  // Создать платеж с планом подписки (новая оптимизированная функция)
  createPaymentWithPlan: async (
    subscriptionId: string,
    plan: SubscriptionPlan
  ): Promise<PaymentLinkResponse> => {
    console.log("API createPaymentWithPlan request data:", {
      subscriptionId,
      planId: plan.id,
      subscriptionType: plan.type,
      amount: plan.priceInKopecks,
    });

    const paymentData: PaymentLinkRequest = {
      subscriptionId,
      planId: plan.id,
      subscriptionType: plan.type as "monthly" | "yearly",
      amount: plan.priceInKopecks, // Используем цену в копейках напрямую
    };

    const response = await axiosInstance.post(
      "/subscriptions/payment/create",
      paymentData
    );
    return response.data;
  },
};
