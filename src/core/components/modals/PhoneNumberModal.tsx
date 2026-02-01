import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button/button';
import { Input } from '@/core/components/ui/inputs/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/core/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Phone, AlertCircle } from 'lucide-react';
import { useUpdateMe } from '@/modules/auth/hooks/useUpdateMe';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';

// Функция для форматирования номера телефона
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) {
    const cleaned = '7' + digits.slice(1);
    if (cleaned.length <= 1) return '+7';
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  if (digits.startsWith('7')) {
    if (digits.length <= 1) return '+7';
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `+7 (${digits}`;
  if (digits.length <= 6) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 8) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
};

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Номер телефона обязателен')
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '');
        return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'));
      },
      {
        message: 'Введите корректный номер телефона',
      }
    ),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  required?: boolean; // Если true, модальное окно нельзя закрыть без ввода номера
}

export const PhoneNumberModal = ({ isOpen, onClose, required = false }: PhoneNumberModalProps) => {
  const { mutate: updateMe, isPending } = useUpdateMe();
  const { data: user } = useGetMe();

  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: user?.phone || '',
    },
  });

  const onSubmit = async (data: PhoneFormData) => {
    const digits = data.phoneNumber.replace(/\D/g, '');
    const formattedPhone = digits.startsWith('8') ? `+7${digits.slice(1)}` : `+${digits}`;

    updateMe(
      { phone: formattedPhone },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!required) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {required ? 'Добавьте номер телефона' : 'Изменить номер телефона'}
          </DialogTitle>
          <DialogDescription>
            {required
              ? 'Для продолжения работы необходимо указать номер телефона'
              : 'Введите новый номер телефона для вашего профиля'}
          </DialogDescription>
        </DialogHeader>

        {required && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Номер телефона обязателен для работы с системой
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="+7 (999) 999-99-99"
                        className="pl-10"
                        autoComplete="tel"
                        maxLength={18}
                        inputMode="numeric"
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              {!required && (
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Отмена
                </Button>
              )}
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? 'Сохранение...' : required ? 'Сохранить и продолжить' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
