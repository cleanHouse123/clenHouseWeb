import { io, Socket } from "socket.io-client";
import {
  PaymentWebSocketEvent,
  JoinPaymentRoomRequest,
  LeavePaymentRoomRequest,
} from "../types";

class WebSocketService {
  private subscriptionSocket: Socket | null = null;
  private orderSocket: Socket | null = null;
  private isSubscriptionConnected = false;
  private isOrderConnected = false;

  private getWebSocketUrl(type: "subscription" | "order"): string {
    const baseUrl = import.meta.env.VITE_API_URL;
    const wsPort = import.meta.env.VITE_WS_PORT || "3000";

    // Убираем протокол и добавляем порт
    const host = baseUrl.replace(/^https?:\/\//, "");

    // Для порта 3000 всегда используем ws (не wss), так как сервер не поддерживает SSL на этом порту
    const protocol = "ws";

    // Возвращаем URL с namespace согласно WEBSOCKET_SETUP.md
    const namespace =
      type === "subscription" ? "subscription-payment" : "order-payment";
    return `${protocol}://${host}:${wsPort}/${namespace}`;
  }

  private log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[WebSocketService ${timestamp}] ${message}`, data || "");
  }

  // API методы для проверки статуса платежей
  private async checkPaymentStatus(paymentId: string): Promise<any> {
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL ||
        "https://cleanhouse123-cleanhouseapi-209c.twc1.net";
      const response = await fetch(`${baseUrl}/payment-status/${paymentId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.log("Статус платежа получен", { paymentId, status: data.status });
      return data;
    } catch (error: any) {
      this.log("Ошибка проверки статуса платежа", {
        paymentId,
        error: error.message,
      });
      throw error;
    }
  }

  private async getPaymentType(
    paymentId: string
  ): Promise<"subscription" | "order" | null> {
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL ||
        "https://cleanhouse123-cleanhouseapi-209c.twc1.net";
      const response = await fetch(
        `${baseUrl}/payment-status/${paymentId}/type`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.log("Тип платежа получен", {
        paymentId,
        type: data.type,
        exists: data.exists,
      });
      return data.exists ? data.type : null;
    } catch (error: any) {
      this.log("Ошибка определения типа платежа", {
        paymentId,
        error: error.message,
      });
      return null;
    }
  }

  // Подключение к WebSocket для подписок
  connectSubscription(): Socket {
    if (this.subscriptionSocket && this.isSubscriptionConnected) {
      this.log(
        "WebSocket подписок уже подключен, возвращаем существующее соединение"
      );
      return this.subscriptionSocket;
    }

    const wsUrl = this.getWebSocketUrl("subscription");
    this.log("Инициализация подключения к WebSocket подписок", { url: wsUrl });

    this.subscriptionSocket = io(wsUrl, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.subscriptionSocket.on("connect", () => {
      this.log("✅ WebSocket подписок успешно подключен", {
        id: this.subscriptionSocket?.id,
        connected: this.subscriptionSocket?.connected,
      });
      this.isSubscriptionConnected = true;
    });

    this.subscriptionSocket.on("disconnect", (reason) => {
      this.log("❌ WebSocket подписок отключен", { reason });
      this.isSubscriptionConnected = false;
    });

    this.subscriptionSocket.on("connect_error", (error) => {
      this.log("💥 Ошибка подключения WebSocket подписок", {
        error: error.message,
      });
      this.isSubscriptionConnected = false;
    });

    this.subscriptionSocket.on("reconnect_attempt", (attemptNumber) => {
      this.log(`🔄 Попытка переподключения подписок #${attemptNumber}`);
    });

    this.subscriptionSocket.on("reconnect_failed", () => {
      this.log("❌ Не удалось переподключиться к WebSocket подписок");
      this.isSubscriptionConnected = false;
    });

    this.subscriptionSocket.on("pong", () => {
      this.log("Получен pong от сервера подписок");
    });

    // Логируем все входящие события
    this.subscriptionSocket.onAny((eventName, ...args) => {
      this.log(`Получено событие от сервера подписок: ${eventName}`, args);
    });

    return this.subscriptionSocket;
  }

  // Подключение к WebSocket для заказов
  connectOrder(): Socket {
    if (this.orderSocket && this.isOrderConnected) {
      this.log(
        "WebSocket заказов уже подключен, возвращаем существующее соединение"
      );
      return this.orderSocket;
    }

    const wsUrl = this.getWebSocketUrl("order");
    this.log("Инициализация подключения к WebSocket заказов", { url: wsUrl });

    this.orderSocket = io(wsUrl, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.orderSocket.on("connect", () => {
      this.log("✅ WebSocket заказов успешно подключен", {
        id: this.orderSocket?.id,
        connected: this.orderSocket?.connected,
      });
      this.isOrderConnected = true;
    });

    this.orderSocket.on("disconnect", (reason) => {
      this.log("❌ WebSocket заказов отключен", { reason });
      this.isOrderConnected = false;
    });

    this.orderSocket.on("connect_error", (error) => {
      this.log("💥 Ошибка подключения WebSocket заказов", {
        error: error.message,
      });
      this.isOrderConnected = false;
    });

    this.orderSocket.on("reconnect_attempt", (attemptNumber) => {
      this.log(`🔄 Попытка переподключения заказов #${attemptNumber}`);
    });

    this.orderSocket.on("reconnect_failed", () => {
      this.log("❌ Не удалось переподключиться к WebSocket заказов");
      this.isOrderConnected = false;
    });

    this.orderSocket.on("pong", () => {
      this.log("Получен pong от сервера заказов");
    });

    // Логируем все входящие события
    this.orderSocket.onAny((eventName, ...args) => {
      this.log(`Получено событие от сервера заказов: ${eventName}`, args);
    });

    return this.orderSocket;
  }

  // Универсальный метод подключения (для обратной совместимости)
  connect(): Socket {
    return this.connectSubscription();
  }

  disconnect(): void {
    this.log("Отключение от всех WebSocket соединений");

    // Останавливаем все проверки статуса платежей
    this.stopAllPaymentStatusChecks();

    if (this.subscriptionSocket) {
      this.log("Отключение от WebSocket подписок");
      this.subscriptionSocket.disconnect();
      this.subscriptionSocket = null;
      this.isSubscriptionConnected = false;
    }

    if (this.orderSocket) {
      this.log("Отключение от WebSocket заказов");
      this.orderSocket.disconnect();
      this.orderSocket = null;
      this.isOrderConnected = false;
    }

    this.log("Все WebSocket соединения отключены");
  }

  // Методы для работы с комнатами подписок
  joinPaymentRoom(data: JoinPaymentRoomRequest): void {
    this.log("Попытка подключения к комнате платежа подписки", data);

    if (this.subscriptionSocket && this.isSubscriptionConnected) {
      this.log(
        "WebSocket подписок подключен, отправляем join_payment_room",
        data
      );
      this.subscriptionSocket.emit("join_payment_room", {
        userId: data.userId,
        paymentId: data.paymentId,
      });
    } else {
      this.log("WebSocket подписок не подключен, пытаемся переподключиться...");
      this.connectSubscription();
      // Повторная попытка через небольшую задержку
      setTimeout(() => {
        if (this.subscriptionSocket && this.isSubscriptionConnected) {
          this.log("Повторное подключение к комнате платежа подписки", data);
          this.subscriptionSocket.emit("join_payment_room", {
            userId: data.userId,
            paymentId: data.paymentId,
          });
        } else {
          this.log(
            "Не удалось подключиться к WebSocket подписок после повторной попытки"
          );
        }
      }, 1000);
    }
  }

  leavePaymentRoom(data: LeavePaymentRoomRequest): void {
    this.log("Попытка отключения от комнаты платежа подписки", data);

    if (this.subscriptionSocket && this.isSubscriptionConnected) {
      this.log(
        "WebSocket подписок подключен, отправляем leave_payment_room",
        data
      );
      this.subscriptionSocket.emit("leave_payment_room", {
        userId: data.userId,
        paymentId: data.paymentId,
      });
    } else {
      this.log(
        "WebSocket подписок не подключен, невозможно отключиться от комнаты"
      );
    }
  }

  // Методы для работы с комнатами заказов
  joinOrderPaymentRoom(paymentId: string, userId: string): void {
    const data = { paymentId, userId };
    this.log("Попытка подключения к комнате платежа заказа", data);

    if (this.orderSocket && this.isOrderConnected) {
      this.log(
        "WebSocket заказов подключен, отправляем join_order_payment_room",
        data
      );
      this.orderSocket.emit("join_order_payment_room", {
        userId,
        paymentId,
      });
    } else {
      this.log("WebSocket заказов не подключен, пытаемся переподключиться...");
      this.connectOrder();
      // Повторная попытка через небольшую задержку
      setTimeout(() => {
        if (this.orderSocket && this.isOrderConnected) {
          this.log("Повторное подключение к комнате платежа заказа", data);
          this.orderSocket.emit("join_order_payment_room", {
            userId,
            paymentId,
          });
        } else {
          this.log(
            "Не удалось подключиться к WebSocket заказов после повторной попытки"
          );
        }
      }, 1000);
    }
  }

  leaveOrderPaymentRoom(paymentId: string, userId: string): void {
    const data = { paymentId, userId };
    this.log("Попытка отключения от комнаты платежа заказа", data);

    if (this.orderSocket && this.isOrderConnected) {
      this.log(
        "WebSocket заказов подключен, отправляем leave_order_payment_room",
        data
      );
      this.orderSocket.emit("leave_order_payment_room", {
        userId,
        paymentId,
      });
    } else {
      this.log(
        "WebSocket заказов не подключен, невозможно отключиться от комнаты"
      );
    }
  }

  // Обработчики событий для подписок
  onSubscriptionPaymentSuccess(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Регистрация обработчика payment_success для подписок");
    if (this.subscriptionSocket) {
      this.subscriptionSocket.on("payment_success", (data) => {
        this.log("🎉 Получено событие payment_success для подписки", data);
        callback(data);
      });
    } else {
      this.log(
        "WebSocket подписок не инициализирован, обработчик не зарегистрирован"
      );
    }
  }

  onSubscriptionPaymentError(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Регистрация обработчика payment_error для подписок");
    if (this.subscriptionSocket) {
      this.subscriptionSocket.on("payment_error", (data) => {
        this.log("💥 Получено событие payment_error для подписки", data);
        callback(data);
      });
    } else {
      this.log(
        "WebSocket подписок не инициализирован, обработчик не зарегистрирован"
      );
    }
  }

  onSubscriptionPaymentStatusUpdate(callback: (data: any) => void): void {
    this.log("Регистрация обработчика payment_status_update для подписок");
    if (this.subscriptionSocket) {
      this.subscriptionSocket.on("payment_status_update", (data) => {
        this.log("Получено событие payment_status_update для подписки", data);
        callback(data);
      });
    } else {
      this.log(
        "WebSocket подписок не инициализирован, обработчик не зарегистрирован"
      );
    }
  }

  // Обработчики событий для заказов
  onOrderPaymentSuccess(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Регистрация обработчика order_payment_success для заказов");
    if (this.orderSocket) {
      this.orderSocket.on("order_payment_success", (data) => {
        this.log("🎉 Получено событие order_payment_success для заказа", data);
        callback(data);
      });
    } else {
      this.log(
        "WebSocket заказов не инициализирован, обработчик не зарегистрирован"
      );
    }
  }

  onOrderPaymentError(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Регистрация обработчика order_payment_error для заказов");
    if (this.orderSocket) {
      this.orderSocket.on("order_payment_error", (data) => {
        this.log("💥 Получено событие order_payment_error для заказа", data);
        callback(data);
      });
    } else {
      this.log(
        "WebSocket заказов не инициализирован, обработчик не зарегистрирован"
      );
    }
  }

  onOrderPaymentStatusUpdate(callback: (data: any) => void): void {
    this.log("Регистрация обработчика order_payment_status_update для заказов");
    if (this.orderSocket) {
      this.orderSocket.on("order_payment_status_update", (data) => {
        this.log(
          "Получено событие order_payment_status_update для заказа",
          data
        );
        callback(data);
      });
    } else {
      this.log(
        "WebSocket заказов не инициализирован, обработчик не зарегистрирован"
      );
    }
  }

  // Универсальные методы (для обратной совместимости)
  onPaymentSuccess(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.onSubscriptionPaymentSuccess(callback);
  }

  onPaymentError(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.onSubscriptionPaymentError(callback);
  }

  onPaymentStatusUpdate(callback: (data: any) => void): void {
    this.onSubscriptionPaymentStatusUpdate(callback);
  }

  // Методы отписки от событий
  offSubscriptionPaymentSuccess(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Отписка от обработчика payment_success для подписок");
    if (this.subscriptionSocket) {
      this.subscriptionSocket.off("payment_success", callback);
    } else {
      this.log("WebSocket подписок не инициализирован, отписка невозможна");
    }
  }

  offSubscriptionPaymentError(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Отписка от обработчика payment_error для подписок");
    if (this.subscriptionSocket) {
      this.subscriptionSocket.off("payment_error", callback);
    } else {
      this.log("WebSocket подписок не инициализирован, отписка невозможна");
    }
  }

  offSubscriptionPaymentStatusUpdate(callback?: (data: any) => void): void {
    this.log("Отписка от обработчика payment_status_update для подписок");
    if (this.subscriptionSocket) {
      this.subscriptionSocket.off("payment_status_update", callback);
    } else {
      this.log("WebSocket подписок не инициализирован, отписка невозможна");
    }
  }

  offOrderPaymentSuccess(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Отписка от обработчика order_payment_success для заказов");
    if (this.orderSocket) {
      this.orderSocket.off("order_payment_success", callback);
    } else {
      this.log("WebSocket заказов не инициализирован, отписка невозможна");
    }
  }

  offOrderPaymentError(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.log("Отписка от обработчика order_payment_error для заказов");
    if (this.orderSocket) {
      this.orderSocket.off("order_payment_error", callback);
    } else {
      this.log("WebSocket заказов не инициализирован, отписка невозможна");
    }
  }

  offOrderPaymentStatusUpdate(callback?: (data: any) => void): void {
    this.log("Отписка от обработчика order_payment_status_update для заказов");
    if (this.orderSocket) {
      this.orderSocket.off("order_payment_status_update", callback);
    } else {
      this.log("WebSocket заказов не инициализирован, отписка невозможна");
    }
  }

  // Универсальные методы отписки (для обратной совместимости)
  offPaymentSuccess(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.offSubscriptionPaymentSuccess(callback);
  }

  offPaymentError(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    this.offSubscriptionPaymentError(callback);
  }

  offPaymentStatusUpdate(callback?: (data: any) => void): void {
    this.offSubscriptionPaymentStatusUpdate(callback);
  }

  // Геттеры для получения сокетов
  getSubscriptionSocket(): Socket | null {
    return this.subscriptionSocket;
  }

  getOrderSocket(): Socket | null {
    return this.orderSocket;
  }

  getSocket(): Socket | null {
    return this.subscriptionSocket;
  }

  // Геттеры для проверки состояния подключения
  isSubscriptionSocketConnected(): boolean {
    return this.isSubscriptionConnected;
  }

  isOrderSocketConnected(): boolean {
    return this.isOrderConnected;
  }

  isSocketConnected(): boolean {
    return this.isSubscriptionConnected;
  }

  // Метод для пинга сервера заказов
  pingOrderServer(): void {
    this.log("Попытка пинга сервера заказов");
    if (this.orderSocket && this.isOrderConnected) {
      this.log("Отправка ping на сервер заказов");
      this.orderSocket.emit("ping");
    } else {
      this.log("WebSocket заказов не подключен, пинг невозможен");
    }
  }

  // Метод для пинга сервера подписок
  pingSubscriptionServer(): void {
    this.log("Попытка пинга сервера подписок");
    if (this.subscriptionSocket && this.isSubscriptionConnected) {
      this.log("Отправка ping на сервер подписок");
      this.subscriptionSocket.emit("ping");
    } else {
      this.log("WebSocket подписок не подключен, пинг невозможен");
    }
  }

  // Универсальный метод пинга
  ping(): void {
    this.log("Универсальный пинг - пингуем сервер подписок");
    this.pingSubscriptionServer();
  }

  // Методы для периодической проверки статуса платежей
  private paymentStatusIntervals: Map<string, NodeJS.Timeout> = new Map();

  startPaymentStatusCheck(
    paymentId: string,
    callback: (status: any) => void,
    intervalMs: number = 5000
  ): void {
    this.log("Запуск периодической проверки статуса платежа", {
      paymentId,
      intervalMs,
    });

    // Останавливаем предыдущую проверку если есть
    this.stopPaymentStatusCheck(paymentId);

    const interval = setInterval(async () => {
      try {
        const status = await this.checkPaymentStatus(paymentId);
        callback(status);

        // Если платеж завершен (paid, success или failed), останавливаем проверку
        if (
          status.status === "paid" ||
          status.status === "success" ||
          status.status === "failed"
        ) {
          this.log("Платеж завершен, останавливаем проверку", {
            paymentId,
            status: status.status,
          });
          this.stopPaymentStatusCheck(paymentId);
        }
      } catch (error: any) {
        this.log("Ошибка при проверке статуса платежа", {
          paymentId,
          error: error.message,
        });
      }
    }, intervalMs);

    this.paymentStatusIntervals.set(paymentId, interval);
  }

  stopPaymentStatusCheck(paymentId: string): void {
    this.log("Остановка проверки статуса платежа", { paymentId });

    const interval = this.paymentStatusIntervals.get(paymentId);
    if (interval) {
      clearInterval(interval);
      this.paymentStatusIntervals.delete(paymentId);
    }
  }

  stopAllPaymentStatusChecks(): void {
    this.log("Остановка всех проверок статуса платежей");

    this.paymentStatusIntervals.forEach((interval, paymentId) => {
      clearInterval(interval);
      this.log("Остановлена проверка статуса", { paymentId });
    });

    this.paymentStatusIntervals.clear();
  }

  // Публичные методы для проверки статуса
  async getPaymentStatus(paymentId: string): Promise<any> {
    return await this.checkPaymentStatus(paymentId);
  }

  async getPaymentTypeInfo(
    paymentId: string
  ): Promise<"subscription" | "order" | null> {
    return await this.getPaymentType(paymentId);
  }
}

export const webSocketService = new WebSocketService();
