import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { Switch } from '@/core/components/ui/switch';
import { usePushNotifications } from '@/core/hooks/usePushNotifications';
import { authApi } from '@/modules/auth/api';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PushNotificationSettingsProps {
  className?: string;
}

/**
 * Компонент для управления push уведомлениями
 */
export function PushNotificationSettings({
  className,
}: PushNotificationSettingsProps) {
  const [vapidKey, setVapidKey] = useState<string | undefined>(undefined);
  const [isLoadingKey, setIsLoadingKey] = useState(false);

  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    subscriptionData,
  } = usePushNotifications(vapidKey);

  // Загружаем VAPID ключ с сервера
  useEffect(() => {
    const loadVapidKey = async () => {
      if (!isSupported) return;

      setIsLoadingKey(true);
      try {
        const { publicKey } = await authApi.getVapidPublicKey();
        setVapidKey(publicKey);
      } catch (error) {
        console.error('Ошибка загрузки VAPID ключа:', error);
        // Можно попробовать использовать без ключа (некоторые браузеры поддерживают)
      } finally {
        setIsLoadingKey(false);
      }
    };

    loadVapidKey();
  }, [isSupported]);

  // Сохраняем подписку на сервере когда она создана
  useEffect(() => {
    const saveSubscription = async () => {
      if (subscriptionData && isSubscribed) {
        try {
          await authApi.savePushSubscription(subscriptionData);
          console.log('Push подписка сохранена на сервере');
        } catch (error) {
          console.error('Ошибка сохранения push подписки:', error);
          toast.error('Не удалось сохранить подписку на сервере');
        }
      }
    };

    saveSubscription();
  }, [subscriptionData, isSubscribed]);

  // Если push уведомления не поддерживаются
  if (!isSupported) {
    return (
      <Card radius="r16" padding="md" background="white" bordered shadow className={className}>
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <BellOff className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Push уведомления
              </p>
              <p className="text-xs text-muted-foreground">
                Не поддерживается в вашем браузере
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      try {
        await subscribe();
      } catch (error) {
        console.error('Ошибка подписки:', error);
      }
    } else {
      try {
        await unsubscribe();
        if (subscriptionData) {
          try {
            await authApi.removePushSubscription(subscriptionData.endpoint);
          } catch (error) {
            console.error('Ошибка удаления подписки с сервера:', error);
          }
        }
      } catch (error) {
        console.error('Ошибка отписки:', error);
      }
    }
  };

  const isLoadingState = isLoading || isLoadingKey;

  return (
    <Card radius="r16" padding="md" background="white" bordered shadow className={className}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              {isSubscribed ? (
                <Bell className="h-4 w-4 text-blue-600" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Push уведомления
              </p>
              <p className="text-xs text-muted-foreground">
                {permission === 'denied'
                  ? 'Разрешение отклонено. Включите в настройках браузера'
                  : isSubscribed
                  ? 'Вы будете получать уведомления о заказах'
                  : 'Получайте уведомления о статусе заказов'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingState && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Switch
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={isLoadingState || permission === 'denied'}
            />
          </div>
        </div>
        {permission === 'denied' && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Чтобы включить уведомления, разрешите их в настройках браузера:
            </p>
            <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>Chrome/Edge: Настройки → Конфиденциальность → Уведомления</li>
              <li>Firefox: Настройки → Приватность → Уведомления</li>
              <li>Safari: Настройки → Веб-сайты → Уведомления</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

