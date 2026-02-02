import { Card, CardContent, CardHeader } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';

const TELEGRAM_BOT_NAME =
  import.meta.env.VITE_TELEGRAM_BOT_NAME || 'chistoDoma2_bot';
const BOT_LINK = `https://t.me/${TELEGRAM_BOT_NAME}`;

export function PhoneLinkRequiredScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md" radius="r20" padding="lg">
        <CardHeader className="text-center">
          <h1 className="text-xl font-semibold">
            Привязка номера телефона
          </h1>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Вы вошли через Telegram. Для доступа к приложению необходимо
            привязать номер телефона. Перейдите в Telegram-бот по кнопке ниже и
            нажмите «Поделиться контактом».
          </p>
          <Button asChild size="lg" className="w-full">
            <a href={BOT_LINK} target="_blank" rel="noopener noreferrer">
              Перейти в бот
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
