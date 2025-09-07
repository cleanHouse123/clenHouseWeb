import { axiosInstance } from "@/core/config/axios";
import {
  UserSubscription,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PaymentLinkRequest,
  PaymentLinkResponse,
  SimulatePaymentResponse,
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
    const response = await axiosInstance.post("/subscriptions", data);
    return response.data;
  },

  // Создать ссылку на оплату
  createPaymentLink: async (
    data: PaymentLinkRequest
  ): Promise<PaymentLinkResponse> => {
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
    const response = await axiosInstance.post(
      `/subscriptions/payment/simulate/${paymentId}`
    );
    return response.data;
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
};
