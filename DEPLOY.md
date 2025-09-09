# Инструкции по деплою на TimeWeb

## Проблема

При переходе по ссылке https://cleanhouse123-clenhouseweb-125e.twc1.net/ получаем 404 Not Found.

## Причина

Nginx не настроен для SPA (Single Page Application) - все маршруты должны перенаправляться на index.html.

## Решение

### 1. Загрузить файлы на сервер

```bash
# Собрать проект
npm run build

# Загрузить содержимое папки dist/ на сервер
# Путь на сервере: /var/www/html/ (или аналогичный)
```

### 2. Настроить Nginx (если используется nginx)

Скопировать содержимое файла `nginx.conf` в конфигурацию nginx:

```nginx
server {
    listen 80;
    server_name cleanhouse123-clenhouseweb-125e.twc1.net;
    root /var/www/html;
    index index.html;

    # SPA fallback - все маршруты идут на index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Service Worker не кэшируется
    location = /sw.js {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        try_files $uri =404;
    }
}
```

### 3. Настроить Apache (если используется Apache)

Скопировать файл `.htaccess` в корень сайта:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 4. Проверить права доступа

```bash
# Установить правильные права
chmod 644 /var/www/html/*
chmod 755 /var/www/html/
```

### 5. Перезапустить веб-сервер

```bash
# Для nginx
sudo systemctl reload nginx

# Для Apache
sudo systemctl reload apache2
```

## Файлы для загрузки

- Все файлы из папки `dist/`
- `nginx.conf` (если используется nginx)
- `.htaccess` (если используется Apache)

## Проверка

После настройки:

1. https://cleanhouse123-clenhouseweb-125e.twc1.net/ - должен открываться
2. https://cleanhouse123-clenhouseweb-125e.twc1.net/orders - должен открываться
3. https://cleanhouse123-clenhouseweb-125e.twc1.net/subscriptions - должен открываться
4. PWA должна работать на мобильных устройствах
