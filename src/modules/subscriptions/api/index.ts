import { axiosInstance } from "@/core/config/axios";
import {
  UserSubscription,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PaymentLinkRequest,
  PaymentLinkResponse,
  SimulatePaymentResponse,
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

  // Симулировать оплату
  simulatePayment: async (
    paymentId: string
  ): Promise<SimulatePaymentResponse> => {
    console.log("API simulatePayment request for paymentId:", paymentId);

    const accessToken = localStorage.getItem("accessToken");
    console.log("Current access token:", accessToken);

    if (!accessToken) {
      throw new Error("Access token not found. Please login first.");
    }

    try {
      const response = await axiosInstance.post(
        `/subscriptions/payment/simulate/${paymentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("SimulatePayment API error:", error);
      if (error.response?.status === 401) {
        console.error(
          "401 Unauthorized - возможно, нужны права администратора или токен истек"
        );
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  },

  // Получить информацию о платеже
  getPaymentInfo: async (paymentId: string): Promise<any> => {
    const response = await axiosInstance.get(
      `/subscriptions/payment/${paymentId}`
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
