import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Textarea } from '@/core/components/ui/inputs/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/inputs/select';
import { Calendar } from '@/core/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
import { TimePicker } from '@/core/components/ui/time-picker';
import { CalendarIcon, Plus, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/core/lib/utils';
import { OrderFormData } from '../types';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { SubscriptionStatusCard } from './SubscriptionStatusCard';
import AutocompleteAddress from '@/modules/address/ui/autocomplete';

const createOrderSchema = z.object({
    address: z.string().min(1, 'Адрес обязателен').max(500, 'Адрес слишком длинный'),
    description: z.string().max(1000, 'Описание слишком длинное').optional(),
    scheduledDate: z.date().optional(),
    scheduledTime: z.string().optional(),
    notes: z.string().max(500, 'Заметки слишком длинные').optional(),
    paymentMethod: z.enum(['subscription', 'online'] as const),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: OrderFormData) => void;
    isLoading?: boolean;
}

export const CreateOrderModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false
}: CreateOrderModalProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const { data: userSubscription } = useUserSubscription();

    const form = useForm<CreateOrderFormData>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            address: '',
            description: '',
            scheduledDate: undefined,
            scheduledTime: '',
            notes: '',
            paymentMethod: userSubscription?.status === 'active' ? 'subscription' : 'online',
        },
    });

    const handleSubmit = (data: CreateOrderFormData) => {
        let scheduledAt: string | undefined;

        if (data.scheduledDate && data.scheduledTime) {
            const [hours, minutes] = data.scheduledTime.split(':');
            const scheduledDateTime = new Date(data.scheduledDate);
            scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            // Создаем строку в локальном формате без суффикса Z
            const year = scheduledDateTime.getFullYear();
            const month = String(scheduledDateTime.getMonth() + 1).padStart(2, '0');
            const day = String(scheduledDateTime.getDate()).padStart(2, '0');
            const hour = String(scheduledDateTime.getHours()).padStart(2, '0');
            const minute = String(scheduledDateTime.getMinutes()).padStart(2, '0');
            const second = String(scheduledDateTime.getSeconds()).padStart(2, '0');
            scheduledAt = `${year}-${month}-${day}T${hour}:${minute}:${second}.000`;
        } else if (data.scheduledDate) {
            scheduledAt = data.scheduledDate.toISOString();
        }

        const orderData: OrderFormData = {
            address: data.address,
            description: data.description,
            scheduledAt,
            notes: data.notes,
            paymentMethod: data.paymentMethod,
        };

        onSubmit(orderData);
    };

    const hasActiveSubscription = userSubscription?.status === 'active';

    const paymentMethodOptions = hasActiveSubscription
        ? [{ value: 'subscription', label: 'По подписке', icon: '📋' }]
        : [
            { value: 'online', label: 'Оплата онлайн', icon: '💳' },
        ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Создать заказ
                    </DialogTitle>
                </DialogHeader>

                {/* Статус подписки */}
                <SubscriptionStatusCard hasActiveSubscription={hasActiveSubscription} />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Адрес */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        Адрес *
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <AutocompleteAddress
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm mt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Описание */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Описание заказа (опционально)"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Запланированная дата */}
                        <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        Запланированная дата
                                    </FormLabel>
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                        format(field.value, 'PPP', { locale: ru })
                                                    ) : (
                                                        <span>Выберите дату</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-50" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    field.onChange(date);
                                                    setCalendarOpen(false);
                                                }}
                                                disabled={(date) => {
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    return date < today;
                                                }}
                                                className="rounded-md border bg-background"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Запланированное время */}
                        <FormField
                            control={form.control}
                            name="scheduledTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Запланированное время
                                    </FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Выберите время"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Заметки
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Заметки</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Дополнительные заметки (опционально)"
                                            className="min-h-[60px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* Способ оплаты */}
                        {userSubscription?.status === 'active' ? (
                            <FormItem>
                                <FormLabel>Способ оплаты *</FormLabel>
                                <div className="flex items-center gap-2 p-3 rounded-lg border bg-green-50 border-green-200">
                                    <span className="text-green-700 font-medium">
                                        Подписка активна до {userSubscription.endDate ? new Date(userSubscription.endDate).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'неизвестно'}
                                    </span>
                                </div>
                                {/* Скрытое поле для формы */}
                                <input type="hidden" {...form.register('paymentMethod')} value="subscription" />
                            </FormItem>
                        ) : (
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Способ оплаты *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите способ оплаты" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {paymentMethodOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{option.icon}</span>
                                                            <span>{option.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Кнопки */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Создание...' : 'Создать заказ'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
