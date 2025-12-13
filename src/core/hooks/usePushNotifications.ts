import { useState, useEffect, useCallback } from 'react';
import {
  pushNotificationService,
  PushSubscriptionData,
} from '../services/pushNotificationService';
import { toast } from 'sonner';

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
  subscriptionData: PushSubscriptionData | null;
}

/**
 * Хук для работы с push уведомлениями
 * @param applicationServerKey - VAPID публичный ключ (опционально, можно получить с сервера)
 */
export function usePushNotifications(
  applicationServerKey?: string
): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    'default'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] =
    useState<PushSubscriptionData | null>(null);

  // Проверка поддержки и инициализация
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = pushNotificationService.isSupported();
        setIsSupported(supported);

        if (supported) {
          await pushNotificationService.initialize();
          const currentPermission = pushNotificationService.getPermission();
          setPermission(currentPermission);

          // Проверяем существующую подписку
          const subscription = await pushNotificationService.getSubscription();
          if (subscription) {
            setIsSubscribed(true);
            const data = pushNotificationService.subscriptionToJSON(subscription);
            setSubscriptionData(data);
          }
        }
      } catch (error) {
        console.error('Ошибка инициализации push уведомлений:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupport();
  }, []);

  // Подписка на push уведомления
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error('Push уведомления не поддерживаются в вашем браузере');
      return;
    }

    setIsLoading(true);
    try {
      // Сначала запрашиваем разрешение
      const perm = await pushNotificationService.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        if (perm === 'denied') {
          toast.error(
            'Разрешение на уведомления отклонено. Разрешите в настройках браузера.'
          );
        } else {
          toast.error('Разрешение на уведомления не получено');
        }
        return;
      }

      // Подписываемся
      const subscription = await pushNotificationService.subscribe(
        applicationServerKey
      );

      if (subscription) {
        setIsSubscribed(true);
        const data = pushNotificationService.subscriptionToJSON(subscription);
        setSubscriptionData(data);
        toast.success('Подписка на уведомления активирована');
      }
    } catch (error) {
      console.error('Ошибка подписки на push уведомления:', error);
      toast.error('Не удалось подписаться на уведомления');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, applicationServerKey]);

  // Отписка от push уведомлений
  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await pushNotificationService.unsubscribe();
      if (result) {
        setIsSubscribed(false);
        setSubscriptionData(null);
        toast.success('Подписка на уведомления отменена');
      } else {
        toast.error('Не удалось отписаться от уведомлений');
      }
    } catch (error) {
      console.error('Ошибка отписки от push уведомлений:', error);
      toast.error('Не удалось отписаться от уведомлений');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Запрос разрешения
  const requestPermission = useCallback(async () => {
    try {
      const perm = await pushNotificationService.requestPermission();
      setPermission(perm);
      return perm;
    } catch (error) {
      console.error('Ошибка запроса разрешения:', error);
      return 'denied' as NotificationPermission;
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    requestPermission,
    subscriptionData,
  };
}

