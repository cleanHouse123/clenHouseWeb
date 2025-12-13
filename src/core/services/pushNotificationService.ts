/**
 * Сервис для работы с Push уведомлениями
 * Поддерживает подписку, получение токена и обработку уведомлений
 */

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Проверяет поддержку push уведомлений в браузере
   */
  public isSupported(): boolean {
    return (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }

  /**
   * Проверяет, получено ли разрешение на уведомления
   */
  public getPermission(): NotificationPermission {
    if (!("Notification" in window)) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Инициализирует сервис и получает регистрацию service worker
   */
  public async initialize(): Promise<ServiceWorkerRegistration> {
    if (!this.isSupported()) {
      throw new Error("Push уведомления не поддерживаются в этом браузере");
    }

    try {
      // Получаем активную регистрацию service worker
      const registration = await navigator.serviceWorker.ready;
      this.registration = registration;
      return registration;
    } catch (error) {
      throw new Error("Ошибка инициализации service worker: " + error);
    }
  }

  /**
   * Запрашивает разрешение на уведомления
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      throw new Error("Браузер не поддерживает уведомления");
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission === "denied") {
      return "denied";
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Получает текущую подписку на push уведомления
   */
  public async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return null;
    }

    try {
      const subscription =
        await this.registration.pushManager.getSubscription();
      return subscription;
    } catch (error) {
      console.error("Ошибка получения подписки:", error);
      return null;
    }
  }

  /**
   * Подписывается на push уведомления
   * @param applicationServerKey - VAPID публичный ключ (base64 или Uint8Array)
   */
  public async subscribe(
    applicationServerKey?: string | Uint8Array
  ): Promise<PushSubscription> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      throw new Error("Service Worker не инициализирован");
    }

    // Проверяем разрешение
    const permission = await this.requestPermission();
    if (permission !== "granted") {
      throw new Error("Разрешение на уведомления не получено");
    }

    try {
      // Проверяем, есть ли уже подписка
      let subscription = await this.registration.pushManager.getSubscription();

      if (!subscription) {
        // Создаем новую подписку
        const options: PushSubscriptionOptionsInit = {};

        if (applicationServerKey) {
          // Если передан строковый ключ, конвертируем в Uint8Array
          if (typeof applicationServerKey === "string") {
            // Удаляем заголовки если есть (начинается с "-----BEGIN")
            const base64Key = applicationServerKey
              .replace(/-----BEGIN PUBLIC KEY-----/g, "")
              .replace(/-----END PUBLIC KEY-----/g, "")
              .replace(/\s/g, "");

            const binaryString = atob(base64Key);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            // Приводим к нужному типу для PushSubscriptionOptionsInit
            options.applicationServerKey = bytes as unknown as BufferSource;
          } else {
            // Если уже Uint8Array или другой BufferSource, приводим к нужному типу
            options.applicationServerKey =
              applicationServerKey as unknown as BufferSource;
          }
        }

        subscription = await this.registration.pushManager.subscribe(options);
      }

      return subscription;
    } catch (error) {
      console.error("Ошибка подписки на push уведомления:", error);
      throw error;
    }
  }

  /**
   * Отписывается от push уведомлений
   */
  public async unsubscribe(): Promise<boolean> {
    const subscription = await this.getSubscription();
    if (!subscription) {
      return false;
    }

    try {
      const result = await subscription.unsubscribe();
      return result;
    } catch (error) {
      console.error("Ошибка отписки от push уведомлений:", error);
      return false;
    }
  }

  /**
   * Конвертирует PushSubscription в объект для отправки на сервер
   */
  public subscriptionToJSON(
    subscription: PushSubscription
  ): PushSubscriptionData {
    const key = subscription.getKey("p256dh");
    const auth = subscription.getKey("auth");

    if (!key || !auth) {
      throw new Error("Не удалось получить ключи подписки");
    }

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(key),
        auth: this.arrayBufferToBase64(auth),
      },
    };
  }

  /**
   * Конвертирует ArrayBuffer в base64 строку
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Показывает локальное уведомление (для тестирования)
   */
  public async showLocalNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    const permission = this.getPermission();
    if (permission !== "granted") {
      throw new Error("Нет разрешения на показ уведомлений");
    }

    if (this.registration) {
      // Показываем уведомление через service worker
      await this.registration.showNotification(title, options);
    } else {
      // Fallback к обычным уведомлениям
      new Notification(title, options);
    }
  }
}

// Экспортируем singleton instance
export const pushNotificationService = PushNotificationService.getInstance();
