# API для проверки статуса платежей

## Описание

Универсальный API для проверки статуса платежей как подписок, так и заказов по ID платежа.

## Базовый URL

```
GET /payment-status/{paymentId}
```

## Эндпоинты

### 1. Проверить статус платежа

**GET** `/payment-status/{paymentId}`

Проверяет статус платежа по ID и возвращает полную информацию.

#### Параметры

- `paymentId` (string, required) - UUID платежа
  - Пример: `34f5753f-e8d8-4adf-b7dd-f319054de6fc`

#### Ответы

**200 OK** - Платеж найден

```json
{
  "id": "34f5753f-e8d8-4adf-b7dd-f319054de6fc",
  "subscriptionId": "123e4567-e89b-12d3-a456-426614174000", // для подписок
  "orderId": null, // для заказов
  "amount": 1000.0,
  "status": "success",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:05:00.000Z",
  "paidAt": "2024-01-15T10:05:00.000Z"
}
```

**400 Bad Request** - Неверный формат ID

```json
{
  "statusCode": 400,
  "message": "Неверный формат ID платежа",
  "error": "Bad Request"
}
```

**404 Not Found** - Платеж не найден

```json
{
  "statusCode": 404,
  "message": "Платеж не найден",
  "error": "Not Found"
}
```

### 2. Определить тип платежа

**GET** `/payment-status/{paymentId}/type`

Определяет тип платежа (подписка или заказ) по ID.

#### Параметры

- `paymentId` (string, required) - UUID платежа

#### Ответы

**200 OK** - Тип определен

```json
{
  "paymentId": "34f5753f-e8d8-4adf-b7dd-f319054de6fc",
  "type": "subscription", // или "order"
  "exists": true
}
```

**200 OK** - Платеж не найден

```json
{
  "paymentId": "34f5753f-e8d8-4adf-b7dd-f319054de6fc",
  "type": null,
  "exists": false
}
```

## Примеры использования

### cURL

```bash
# Проверить статус платежа
curl -X GET "http://localhost:3000/payment-status/34f5753f-e8d8-4adf-b7dd-f319054de6fc"

# Определить тип платежа
curl -X GET "http://localhost:3000/payment-status/34f5753f-e8d8-4adf-b7dd-f319054de6fc/type"
```

### JavaScript

```javascript
// Проверить статус платежа
const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch(`/payment-status/${paymentId}`);
    const data = await response.json();

    if (response.ok) {
      console.log("Статус платежа:", data.status);
      console.log("Сумма:", data.amount);
      console.log("Тип:", data.subscriptionId ? "подписка" : "заказ");
    } else {
      console.error("Ошибка:", data.message);
    }
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
};

// Определить тип платежа
const getPaymentType = async (paymentId) => {
  try {
    const response = await fetch(`/payment-status/${paymentId}/type`);
    const data = await response.json();

    if (data.exists) {
      console.log("Тип платежа:", data.type);
    } else {
      console.log("Платеж не найден");
    }
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
};
```

### React Hook

```javascript
import { useState, useEffect } from "react";

export const usePaymentStatus = (paymentId) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId) return;

    const checkStatus = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/payment-status/${paymentId}`);
        const data = await response.json();

        if (response.ok) {
          setStatus(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Ошибка при проверке статуса платежа");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [paymentId]);

  return { status, loading, error };
};
```

## Логика работы

1. **Валидация UUID** - проверяется формат ID платежа
2. **Поиск в подписках** - сначала ищется в сервисе подписок
3. **Поиск в заказах** - если не найден, ищется в сервисе заказов
4. **Возврат результата** - возвращается информация о платеже или ошибка

## Статусы платежей

- `pending` - Ожидает обработки
- `processing` - В процессе обработки
- `success` - Успешно обработан
- `failed` - Ошибка обработки
- `refunded` - Возвращен

## Безопасность

- ✅ Публичный доступ (не требует авторизации)
- ✅ Валидация UUID
- ✅ Обработка ошибок
- ✅ Логирование ошибок
- ✅ Защита от SQL инъекций (через TypeORM)
