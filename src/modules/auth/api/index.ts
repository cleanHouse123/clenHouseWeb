import { axiosPublic, axiosInstance } from "@/core/config/axios";
import {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  AuthResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
} from "../types";
import { User } from "@/core/types/user";

export const authApi = {
  // Отправка SMS кода
  sendSms: async (data: SendSmsRequest): Promise<SendSmsResponse> => {
    const payload = {
      phoneNumber: data.phoneNumber,
      ...(data.isDev && { isDev: data.isDev }),
    };
    const response = await axiosPublic.post("/auth/sms/send", payload);
    return response.data;
  },

  // Верификация SMS кода и авторизация
  verifySms: async (data: VerifySmsRequest): Promise<AuthResponse> => {
    const payload = {
      phoneNumber: data.phoneNumber,
      code: data.code,
      ...(data.adToken && { adToken: data.adToken }),
    };
    const response = await axiosPublic.post("/auth/sms/verify", payload);
    return response.data;
  },

  // Обновление токенов
  refreshTokens: async (
    data: RefreshTokensRequest
  ): Promise<RefreshTokensResponse> => {
    const response = await axiosPublic.post("/auth/refresh", data);
    return response.data;
  },

  // Получение данных текущего пользователя
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get("/auth/me");
    return {
      ...response.data.user,
      userId: response.data.user.id,
      adToken: response.data.adToken,
    };
  },

  // Получить VAPID публичный ключ для push уведомлений
  getVapidPublicKey: async (): Promise<{ publicKey: string }> => {
    const response = await axiosInstance.get("/push/vapid-public-key");
    return response.data;
  },

  // Сохранить push подписку пользователя
  savePushSubscription: async (subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }): Promise<void> => {
    await axiosInstance.post("/push/subscribe", subscription);
  },

  // Удалить push подписку пользователя
  removePushSubscription: async (endpoint: string): Promise<void> => {
    await axiosInstance.post("/push/unsubscribe", { endpoint });
  },
};
