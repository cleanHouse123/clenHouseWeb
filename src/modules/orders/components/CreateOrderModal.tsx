import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button/button';
import { Dialog, DialogContent } from '@/core/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Textarea } from '@/core/components/ui/inputs/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/inputs/select';
import { Calendar } from '@/core/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
import { TimePicker } from '@/core/components/ui/time-picker';
import { CalendarIcon, Plus, MapPin, X, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/core/lib/utils';
import { OrderFormData } from '../types';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { SubscriptionStatusCard } from './SubscriptionStatusCard';
import AutocompleteAddress from '@/modules/address/ui/autocomplete';
import { Address } from '@/modules/address/types';

const createOrderSchema = z.object({
    address: z.string().min(1, 'Адрес обязателен').max(500, 'Адрес слишком длинный'),
    description: z.string().max(1000, 'Описание слишком длинное').optional(),
    scheduledDate: z.date({
        required_error: 'Дата обязательна',
        invalid_type_error: 'Выберите корректную дату',
    }),
    scheduledTime: z.string().min(1, 'Время обязательно'),
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
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
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

    const handleClose = () => {
        setSelectedAddress(null);
        form.reset();
        onClose();
    };

    const handleSubmit = (data: CreateOrderFormData) => {
        console.log('Form data received:', data);

        // Теперь scheduledDate и scheduledTime обязательны
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
        const scheduledAt = `${year}-${month}-${day}T${hour}:${minute}:${second}.000`;

        const orderData: OrderFormData = {
            address: data.address,
            description: data.description,
            scheduledAt,
            notes: data.notes,
            paymentMethod: data.paymentMethod,
            coordinates: selectedAddress?.geo_lat && selectedAddress?.geo_lon
                ? {
                    geo_lat: selectedAddress.geo_lat,
                    geo_lon: selectedAddress.geo_lon,
                }
                : undefined,
        };

        onSubmit(orderData);

        setSelectedAddress(null);
        form.reset();
    };

    const hasActiveSubscription = userSubscription?.status === 'active';

    const paymentMethodOptions = hasActiveSubscription
        ? [{ value: 'subscription', label: 'По подписке', icon: '📋' }]
        : [
            { value: 'online', label: 'Оплата онлайн', icon: '💳' },
        ];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Создать заказ</h2>
                                <p className="text-sm text-gray-500">Заполните форму для вызова курьера</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Статус подписки */}
                    <SubscriptionStatusCard hasActiveSubscription={hasActiveSubscription} />

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                            {/* Адрес */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
                                            <MapPin className="h-5 w-5" />
                                            Адрес забора мусора *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <AutocompleteAddress
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onAddressSelect={setSelectedAddress}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-2" />
                                    </FormItem>
                                )}
                            />

                            {/* Описание */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold text-gray-900 mb-3">
                                            Описание мусора
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Опишите тип и количество мусора (например: бытовые отходы, мебель, строительный мусор)"

                                                className="min-h-[100px] text-base bg-white placeholder:text-gray-400"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-2" />
                                    </FormItem>
                                )}
                            />


                            {/* Дата и время */}
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    Когда забрать мусор?
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Дата */}
                                    <FormField
                                        control={form.control}
                                        name="scheduledDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Дата *
                                                </FormLabel>
                                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    'w-full justify-start text-left border-gray-100 text-black hover:text-black font-normal h-10',
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
                                                            className="rounded-md  bg-white placeholder:text-gray-400"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Время */}
                                    <FormField
                                        control={form.control}
                                        name="scheduledTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Время *
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
                                </div>
                            </div>

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
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Способ оплаты
                                </h3>

                                {userSubscription?.status === 'active' ? (
                                    <div className="p-4 rounded-xl border-2 ">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                                <CreditCard className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-green-900">Оплата по подписке</p>
                                                <p className="text-sm text-green-700">
                                                    Подписка активна до {userSubscription.endDate ? new Date(userSubscription.endDate).toLocaleDateString('ru-RU', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) : 'неизвестно'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Скрытое поле для формы */}
                                        <input type="hidden" {...form.register('paymentMethod')} value="subscription" />
                                    </div>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 bg-white">
                                                            <SelectValue placeholder="Выберите способ оплаты" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {paymentMethodOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-lg">{option.icon}</span>
                                                                    <span className="font-medium">{option.label}</span>
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
                            </div>

                            {/* Кнопки */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1 h-12 text-base font-medium"
                                    disabled={isLoading}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 text-base font-medium bg-orange-500 hover:bg-orange-600"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Создание...
                                        </div>
                                    ) : (
                                        'Создать заказ'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
