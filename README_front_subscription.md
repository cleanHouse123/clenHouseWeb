# Система подписок - Frontend

## Обзор

Система подписок позволяет пользователям оформлять подписки на услуги уборки с автоматической оплатой. Реализована моковая система оплаты с WebSocket уведомлениями в реальном времени.

## Архитектура

### Модульная структура

```
src/modules/subscriptions/
├── api/                    # API методы
│   └── index.ts           # HTTP запросы к серверу
├── hooks/                 # React Query хуки
│   ├── useSubscriptions.tsx    # Основные хуки подписок
│   └── usePaymentWebSocket.tsx # WebSocket подключение
├── services/              # Сервисы
│   └── websocket.ts       # WebSocket сервис
├── components/            # UI компоненты
│   ├── SubscriptionTypeSelector.tsx  # Выбор типа подписки
│   ├── UserSubscriptionCard.tsx       # Карточка текущей подписки
│   └── PaymentModal.tsx              # Модальное окно оплаты
├── types/                 # TypeScript типы
│   └── index.ts          # Интерфейсы данных
└── pages/                 # Страницы
    └── subscriptions/     # Страница управления подписками
```

## Типы данных

### UserSubscription

```typescript
interface UserSubscription {
  id: string; // UUID подписки
  userId: string; // UUID пользователя
  type: "monthly" | "yearly"; // Тип подписки
  price: number; // Стоимость
  status: "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED"; // Статус
  startDate: string; // Дата начала (ISO)
  endDate: string; // Дата окончания (ISO)
  createdAt: string; // Дата создания
  updatedAt: string; // Дата обновления
}
```

### CreateSubscriptionRequest

```typescript
interface CreateSubscriptionRequest {
  userId: string; // UUID пользователя
  type: "monthly" | "yearly"; // Тип подписки
  price: number; // Стоимость
  startDate: string; // Дата начала (ISO)
  endDate: string; // Дата окончания (ISO)
}
```

## API методы

### subscriptionApi

#### getUserSubscription(userId: string)

- **URL**: `GET /subscriptions/user/${userId}`
- **Описание**: Получает текущую подписку пользователя
- **Возвращает**: `UserSubscription | null`

#### createSubscription(data: CreateSubscriptionRequest)

- **URL**: `POST /subscriptions`
- **Описание**: Создает новую подписку
- **Возвращает**: `CreateSubscriptionResponse`

#### createPaymentLink(data: PaymentLinkRequest)

- **URL**: `POST /subscriptions/payment/create`
- **Описание**: Создает ссылку на оплату
- **Возвращает**: `PaymentLinkResponse`

#### simulatePayment(paymentId: string)

- **URL**: `POST /subscriptions/payment/simulate/${paymentId}`
- **Описание**: Симулирует успешную оплату
- **Возвращает**: `SimulatePaymentResponse`

## React Query хуки

### useUserSubscription()

```typescript
const { data: userSubscription, isLoading, error } = useUserSubscription();
```

- Получает текущую подписку пользователя
- Автоматически использует `userId` из `useGetMe()`
- Кэширует данные на 2 минуты
- Не повторяет запрос при 401 ошибке

### useCreateSubscription()

```typescript
const { mutateAsync: createSubscription, isPending } = useCreateSubscription();

await createSubscription({
  type: "monthly",
  price: 1000,
});
```

- Создает новую подписку
- Автоматически генерирует `startDate` и `endDate`
- Использует `userId` из `useGetMe()`
- Показывает toast уведомления

### useCreatePaymentLink()

```typescript
const { mutateAsync: createPaymentLink, isPending } = useCreatePaymentLink();

await createPaymentLink({
  subscriptionId: "uuid",
  subscriptionType: "monthly",
  amount: 1000,
});
```

- Создает ссылку на оплату
- Требует реальный `subscriptionId` из ответа создания подписки

### useSimulatePayment()

```typescript
const { mutateAsync: simulatePayment, isPending } = useSimulatePayment();

await simulatePayment("payment-id");
```

- Симулирует успешную оплату
- Обновляет статус подписки через WebSocket

## WebSocket интеграция

### WebSocketService

```typescript
class WebSocketService {
  // Подключение к серверу
  connect(): void;

  // Подключение к комнате оплаты
  joinPaymentRoom(data: JoinPaymentRoomRequest): void;

  // Отключение от комнаты
  leavePaymentRoom(data: LeavePaymentRoomRequest): void;

  // Слушатели событий
  onPaymentSuccess(callback: (data) => void): void;
  onPaymentError(callback: (data) => void): void;
}
```

### usePaymentWebSocket()

```typescript
const { isConnected } = usePaymentWebSocket();
```

- Автоматически подключается к WebSocket при наличии пользователя
- Подписывается на события `payment_success` и `payment_error`
- Показывает toast уведомления о статусе оплаты
- Обновляет кэш React Query при успешной оплате

## Компоненты UI

### SubscriptionTypeSelector

```typescript
<SubscriptionTypeSelector
  onSelect={(type, price) => handleSelectSubscription(type, price)}
  isLoading={isCreatingSubscription}
/>
```

- Показывает карточки "Месячная" и "Годовая" подписки
- Месячная: 1000₽/месяц
- Годовая: 9600₽/год (экономия 20%)
- Вызывает `onSelect` при выборе

### UserSubscriptionCard

```typescript
<UserSubscriptionCard userSubscription={userSubscription} />
```

- Отображает информацию о текущей подписке
- Показывает статус, даты, стоимость
- Предупреждает об истечении срока

### PaymentModal

```typescript
<PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={handleClosePaymentModal}
  subscriptionType={selectedType}
  subscriptionPrice={selectedPrice}
  paymentUrl={paymentUrl}
  onSimulatePayment={handleSimulatePayment}
  isLoading={isSimulatingPayment}
/>
```

- Модальное окно для симуляции оплаты
- Показывает информацию о подписке
- Кнопка "Симулировать успешную оплату"

## Страница подписок

### SubscriptionsPage

```typescript
export const SubscriptionsPage = () => {
  // Состояние
  const [selectedType, setSelectedType] = useState<"monthly" | "yearly" | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Хуки
  const { data: user, isLoading: isLoadingUser } = useGetMe();
  const { data: userSubscription, isLoading: isLoadingUserSubscription } =
    useUserSubscription();
  const { mutateAsync: createSubscription } = useCreateSubscription();
  const { mutateAsync: createPaymentLink } = useCreatePaymentLink();
  const { mutateAsync: simulatePayment } = useSimulatePayment();
  const { isConnected } = usePaymentWebSocket();

  // Логика
  const handleSelectSubscription = async (type, price) => {
    // 1. Создаем подписку
    const subscriptionResult = await createSubscription({ type, price });

    // 2. Создаем ссылку на оплату
    const paymentData = await createPaymentLink({
      subscriptionId: subscriptionResult.subscription.id,
      subscriptionType: type,
      amount: price,
    });

    // 3. Открываем модальное окно
    setIsPaymentModalOpen(true);
  };
};
```

## Флоу создания подписки

### 1. Выбор типа подписки

- Пользователь выбирает "Месячная" или "Годовая"
- Нажимает кнопку "Выбрать"

### 2. Создание подписки

```typescript
// Автоматически генерируются даты
const now = new Date();
const startDate = now.toISOString();
const endDate = new Date(now);
if (type === "monthly") {
  endDate.setMonth(endDate.getMonth() + 1);
} else {
  endDate.setFullYear(endDate.getFullYear() + 1);
}

// Отправляется запрос
await createSubscription({
  userId: user.userId, // Из useGetMe()
  type: "monthly",
  price: 1000,
  startDate: startDate,
  endDate: endDate.toISOString(),
});
```

### 3. Создание ссылки на оплату

```typescript
// Используется реальный subscriptionId из ответа
const paymentData = await createPaymentLink({
  subscriptionId: subscriptionResult.subscription.id, // Реальный UUID
  subscriptionType: "monthly",
  amount: 1000,
});
```

### 4. Симуляция оплаты

- Открывается модальное окно с информацией о подписке
- Пользователь нажимает "Симулировать успешную оплату"
- Отправляется запрос на симуляцию

### 5. WebSocket уведомления

- Сервер отправляет событие `payment_success`
- Frontend получает уведомление через WebSocket
- Показывается toast "Подписка успешно оформлена!"
- Обновляется кэш React Query
- Модальное окно закрывается

## Интеграция с аутентификацией

### Использование useGetMe()

Все хуки подписок используют `useGetMe()` для получения данных пользователя:

```typescript
const { data: user, isLoading: isLoadingUser } = useGetMe();
```

### Проверка состояния загрузки

```typescript
// Страница ждет загрузки пользователя
{(isLoadingUser || isLoadingUserSubscription) ? (
  <LoadingIndicator />
) : userSubscription ? (
  // Показать текущую подписку
) : user ? (
  // Показать селектор подписок
) : (
  // Ошибка загрузки пользователя
)}
```

### Валидация UUID

```typescript
// Проверка формата userId
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(user.userId)) {
  throw new Error(`Неверный формат ID пользователя: ${user.userId}`);
}
```

## Обработка ошибок

### Валидация на сервере

- `userId must be a UUID` - проверка формата ID пользователя
- `subscriptionId must be a UUID` - проверка формата ID подписки
- `startDate must be a valid ISO 8601 date string` - проверка даты начала
- `endDate must be a valid ISO 8601 date string` - проверка даты окончания

### Обработка в хуках

```typescript
onError: (error: any) => {
  let errorMessage = "Ошибка создания подписки";

  if (error?.response?.data?.message) {
    if (Array.isArray(error.response.data.message)) {
      errorMessage = error.response.data.message.join(", ");
    } else {
      errorMessage = error.response.data.message;
    }
  }

  toast.error("Ошибка создания подписки", {
    description: errorMessage,
    duration: 5000,
  });
};
```

## Кэширование и синхронизация

### React Query настройки

```typescript
{
  queryKey: ['user-subscription', user?.userId],
  staleTime: 2 * 60 * 1000,        // 2 минуты
  gcTime: 5 * 60 * 1000,          // 5 минут
  refetchOnWindowFocus: false,     // не перезагружать при фокусе
  refetchOnMount: false,          // не перезагружать при монтировании
  retry: (failureCount, error) => {
    if (error?.response?.status === 401) return false;
    return failureCount < 2;
  }
}
```

### Обновление кэша

```typescript
// После успешных операций
queryClient.invalidateQueries({
  queryKey: ["user-subscription", user?.userId],
});
```

## WebSocket события

### payment_success

```typescript
{
  type: "payment_success",
  data: {
    userId: "uuid",
    subscriptionId: "uuid",
    message: "Подписка успешно оформлена!",
    timestamp: "2024-01-01T12:00:00.000Z"
  }
}
```

### payment_error

```typescript
{
  type: "payment_error",
  data: {
    userId: "uuid",
    subscriptionId: "uuid",
    error: "Ошибка оплаты",
    timestamp: "2024-01-01T12:00:00.000Z"
  }
}
```

## Статусы подписок

- **PENDING** - ожидает оплаты
- **ACTIVE** - активна
- **CANCELLED** - отменена
- **EXPIRED** - истекла

## Ограничения

- У пользователя может быть только одна активная подписка
- При создании новой подписки старая автоматически отменяется
- Подписка может быть только месячной или годовой

## Зависимости

```json
{
  "socket.io-client": "^4.7.5",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "sonner": "^1.0.0"
}
```
