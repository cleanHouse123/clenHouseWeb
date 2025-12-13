/**
 * Обработчик push уведомлений для service worker
 * Этот файл будет инжектирован в основной service worker через vite-plugin-pwa
 */

// Обработка входящих push уведомлений
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push получен');

  let notificationData = {
    title: 'ЧистоДом',
    body: 'У вас новое уведомление',
    icon: '/favicon/android-chrome-192x192.png',
    badge: '/favicon/android-chrome-192x192.png',
    tag: 'default',
    requireInteraction: false,
    data: {},
  };

  // Если данные пришли с сервера, используем их
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
        data: data.data || {},
      };
    } catch (e) {
      // Если не JSON, пробуем как текст
      const text = event.data.text();
      if (text) {
        notificationData.body = text;
      }
    }
  }

  const promiseChain = self.registration.showNotification(notificationData.title, {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    data: notificationData.data,
    vibrate: [200, 100, 200],
    actions: notificationData.actions || [],
  });

  event.waitUntil(promiseChain);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Уведомление кликнуто');

  event.notification.close();

  // Если есть URL в данных уведомления, открываем его
  const urlToOpen = event.notification.data?.url || '/';

  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then(function (windowClients) {
      // Проверяем, есть ли уже открытое окно с этим URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Если окна нет, открываем новое
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});

// Обработка закрытия уведомления
self.addEventListener('notificationclose', function (event) {
  console.log('[Service Worker] Уведомление закрыто', event.notification);
  // Здесь можно отправить аналитику на сервер
});

