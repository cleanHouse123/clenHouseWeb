import { axiosPublic, axiosInstance } from "@/core/config/axios";
import {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  VerifyTelegramRequest,
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

  // Верификация Telegram Login Widget и авторизация
  verifyTelegram: async (data: VerifyTelegramRequest): Promise<AuthResponse> => {
    const payload = {
      id: data.id,
      first_name: data.first_name,
      ...(data.last_name && { last_name: data.last_name }),
      ...(data.username && { username: data.username }),
      ...(data.photo_url && { photo_url: data.photo_url }),
      auth_date: data.auth_date,
      hash: data.hash,
      ...(data.adToken && { adToken: data.adToken }),
    };
    const response = await axiosPublic.post("/auth/telegram/login-widget/verify", payload);
    return response.data;
  },

  // Обновление текущего пользователя
  updateMe: async (data: { phone?: string; name?: string; email?: string }): Promise<{ message: string; user: User }> => {
    const response = await axiosInstance.patch("/user/me", data);
    return {
      ...response.data,
      user: {
        ...response.data.user,
        userId: response.data.user.id,
      },
    };
  },
};
