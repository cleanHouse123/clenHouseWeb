# Исправление ошибки Docker сборки

## Проблема

```
npm error The `npm ci` command can only install with an existing package-lock.json
```

## Причина

В проекте используется `yarn.lock`, а не `package-lock.json`, но Dockerfile использует `npm ci`.

## Решения

### Вариант 1: Использовать yarn (Рекомендуется)

Dockerfile уже исправлен для использования yarn:

```dockerfile
# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build
```

### Вариант 1.1: Упрощенная версия
Используйте `Dockerfile.simple`:

```bash
mv Dockerfile.simple Dockerfile
```

Эта версия копирует все файлы сразу и не устанавливает yarn отдельно.

### Вариант 2: Использовать npm

Переименуйте `Dockerfile.npm` в `Dockerfile`:

```bash
mv Dockerfile.npm Dockerfile
```

### Вариант 3: Создать package-lock.json

```bash
# Удалить yarn.lock
rm yarn.lock

# Установить зависимости через npm
npm install

# Теперь можно использовать npm ci
```

## Проверка

После исправления Dockerfile:

1. Соберите образ: `docker build -t cleanhouse-web .`
2. Запустите контейнер: `docker run -p 80:80 cleanhouse-web`
3. Проверьте: http://localhost

## Для TimeWeb

Если вы деплоите на TimeWeb, используйте файлы из папки `dist/` + `.htaccess`, а не Dockerfile.
