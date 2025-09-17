# Система управления подписками

## Что сделано

Создана полная система управления планами подписок, которая позволяет:

- Хранить планы подписок в базе данных PostgreSQL
- Управлять подписками через админку (CRUD операции)
- Получать список подписок в клиентском приложении

## Backend (NestJS + TypeORM)

### Структура базы данных

Таблица `subscription_plans` с полями:

- `id` - UUID (primary key)
- `type` - тип подписки (string)
- `name` - название подписки (string)
- `description` - описание (text)
- `price` - цена (decimal)
- `duration` - длительность (string)
- `features` - список возможностей (string[])
- `icon` - slug иконки (string)
- `badgeColor` - цвет значка (string)
- `popular` - популярная подписка (boolean, по умолчанию false)
- `createdAt` - дата создания
- `updatedAt` - дата обновления

### Созданные файлы

```
src/subscription/
├── entities/subscription-plan.entity.ts
├── dto/create-subscription-plan.dto.ts
├── dto/update-subscription-plan.dto.ts
├── dto/subscription-plan-response.dto.ts
├── services/subscription-plans.service.ts
├── controllers/subscription-plans.controller.ts
└── subscription.module.ts (обновлен)

src/migrations/
└── 1734432000000-CreateSubscriptionPlansTable.ts
```

## API Endpoints

### 1. Получить все планы подписок

```
GET /subscription-plans

Требования: Нет авторизации
Ответ: SubscriptionPlan[]
```

### 2. Получить план по ID

```
GET /subscription-plans/:id

Требования: Нет авторизации
Ответ: SubscriptionPlan
```

### 3. Создать новый план

```
POST /subscription-plans

Требования:
- JWT токен админа в заголовке Authorization
- Тело запроса с данными плана

Headers:
  Authorization: Bearer <admin_jwt_token>

Body:
{
  "type": "monthly",
  "name": "Базовый план",
  "description": "Описание плана",
  "price": 999.99,
  "duration": "1 месяц",
  "features": ["Функция 1", "Функция 2"],
  "icon": "calendar",
  "badgeColor": "blue",
  "popular": false
}

Ответ: SubscriptionPlan
```

### 4. Обновить план

```
PATCH /subscription-plans/:id

Требования:
- JWT токен админа в заголовке Authorization
- Тело запроса с обновляемыми полями

Headers:
  Authorization: Bearer <admin_jwt_token>

Body: (любые поля из CreateSubscriptionPlanDto)
{
  "name": "Новое название",
  "price": 1299.99
}

Ответ: SubscriptionPlan
```

### 5. Удалить план

```
DELETE /subscription-plans/:id

Требования:
- JWT токен админа в заголовке Authorization

Headers:
  Authorization: Bearer <admin_jwt_token>

Ответ: { "message": "Subscription plan deleted successfully" }
```

## Авторизация

### Публичные endpoint'ы (без токена):

- `GET /subscription-plans` - получить все планы
- `GET /subscription-plans/:id` - получить план по ID

### Административные endpoint'ы (требуют JWT токен админа):

- `POST /subscription-plans` - создать план
- `PATCH /subscription-plans/:id` - обновить план
- `DELETE /subscription-plans/:id` - удалить план

Для административных операций используются guards:

- `JwtAuthGuard` - проверка JWT токена
- `AdminGuard` - проверка роли администратора

## Frontend примеры

В папке `examples/` созданы готовые React компоненты:

### Админка (`admin-react/`)

- Таблица со списком планов
- Форма создания/редактирования
- API функции для работы с сервером

### Клиент (`client-react/`)

- Карточки планов подписок
- Компоненты иконок
- Выбор плана подписки

## Валидация данных

Все поля проходят валидацию через class-validator:

- `type`, `name`, `description`, `duration`, `icon`, `badgeColor` - обязательные строки
- `price` - обязательное число
- `features` - обязательный массив строк
- `popular` - опциональный boolean

## Использование

1. Добавить миграцию в конфигурацию TypeORM
2. Выполнить миграцию для создания таблицы
3. Использовать API endpoints для управления планами
4. Интегрировать React компоненты из examples/

## Доступные иконки

- calendar, zap, star, crown, diamond, shield, rocket, heart

## Доступные цвета значков

- blue, green, yellow, red, purple, orange, pink, gray
