### Обзор

Система подписок позволяет пользователям оформлять подписки на услуги уборки с автоматической оплатой. Реализована моковая система оплаты с WebSocket уведомлениями.

### Типы подписок

- **monthly** - месячная подписка
- **yearly** - годовая подписка
- **one_time** - разовая оплата

### API эндпоинты

#### Создание подписки

```http
POST /subscriptions
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "monthly",
  "price": 1000
}
```

#### Создание ссылки на оплату

```http
POST /subscriptions/payment/create
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "subscriptionId": "123e4567-e89b-12d3-a456-426614174000",
  "subscriptionType": "monthly",
  "amount": 1000
}
```

**Ответ:**

```json
{
  "paymentUrl": "https://mock-payment.example.com/pay/123e4567-e89b-12d3-a456-426614174000",
  "paymentId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending"
}
```

#### Симуляция успешной оплаты (для тестирования)

```http
POST /subscriptions/payment/simulate/{paymentId}
Authorization: Bearer <jwt-token>
```

#### Получение информации о платеже

```http
GET /subscriptions/payment/{paymentId}
Authorization: Bearer <jwt-token>
```

### WebSocket подключение

#### Установка зависимостей на фронте

```bash
npm install socket.io-client
# или
yarn add socket.io-client
```

#### Подключение к WebSocket

```javascript
import { io } from "socket.io-client";

// Подключение к WebSocket серверу
const socket = io("ws://localhost:3000", {
  transports: ["websocket"],
});

// Подключение к комнате оплаты пользователя
socket.emit("join_payment_room", {
  userId: "user-id-here",
});

// Слушаем уведомления об успешной оплате
socket.on("payment_success", (data) => {
  console.log("Подписка успешно оформлена!", data);
  /*
  data содержит:
  {
    userId: "user-id",
    subscriptionId: "subscription-id", 
    message: "Подписка успешно оформлена!",
    timestamp: "2024-01-01T12:00:00.000Z"
  }
  */
});

// Слушаем уведомления об ошибках оплаты
socket.on("payment_error", (data) => {
  console.log("Ошибка оплаты:", data);
  /*
  data содержит:
  {
    userId: "user-id",
    subscriptionId: "subscription-id",
    error: "Ошибка оплаты", 
    timestamp: "2024-01-01T12:00:00.000Z"
  }
  */
});

// Отключение от комнаты при выходе
socket.emit("leave_payment_room", {
  userId: "user-id-here",
});
```

### Полный флоу оплаты на фронте

```javascript
class SubscriptionService {
  constructor() {
    this.socket = io("ws://localhost:3000");
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on("payment_success", (data) => {
      this.handlePaymentSuccess(data);
    });

    this.socket.on("payment_error", (data) => {
      this.handlePaymentError(data);
    });
  }

  async createSubscription(subscriptionData) {
    try {
      // 1. Создаем подписку
      const subscription = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      const subscriptionResult = await subscription.json();

      // 2. Создаем ссылку на оплату
      const payment = await fetch("/api/subscriptions/payment/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscriptionResult.id,
          subscriptionType: subscriptionData.type,
          amount: subscriptionData.price,
        }),
      });

      const paymentResult = await payment.json();

      // 3. Подключаемся к WebSocket комнате
      this.socket.emit("join_payment_room", {
        userId: subscriptionData.userId,
      });

      // 4. Переходим на страницу оплаты
      window.open(paymentResult.paymentUrl, "_blank");

      return paymentResult;
    } catch (error) {
      console.error("Ошибка создания подписки:", error);
      throw error;
    }
  }

  handlePaymentSuccess(data) {
    // Обновляем UI - показываем успешное сообщение
    this.showSuccessMessage("Подписка успешно оформлена!");

    // Обновляем статус подписки в приложении
    this.updateSubscriptionStatus(data.subscriptionId, "active");

    // Перенаправляем на страницу успеха
    this.redirectToSuccessPage(data.subscriptionId);
  }

  handlePaymentError(data) {
    // Показываем ошибку пользователю
    this.showErrorMessage("Ошибка оплаты. Попробуйте еще раз.");

    // Обновляем статус подписки
    this.updateSubscriptionStatus(data.subscriptionId, "failed");
  }

  // Для тестирования - симуляция оплаты
  async simulatePayment(paymentId) {
    try {
      const response = await fetch(
        `/api/subscriptions/payment/simulate/${paymentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      const result = await response.json();
      console.log("Оплата симулирована:", result);
      return result;
    } catch (error) {
      console.error("Ошибка симуляции оплаты:", error);
      throw error;
    }
  }
}

// Использование
const subscriptionService = new SubscriptionService();

// Создание подписки
subscriptionService.createSubscription({
  userId: "user-id",
  type: "monthly",
  price: 1000,
});
```

### Статусы подписок

- **PENDING** - ожидает оплаты
- **ACTIVE** - активна
- **CANCELLED** - отменена
- **EXPIRED** - истекла
