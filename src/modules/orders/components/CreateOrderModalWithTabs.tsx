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
import { CalendarIcon, Plus, MapPin, X, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createUTCFromDateTimeInput } from '@/core/utils/dateUtils';
import { cn } from '@/core/lib/utils';
import { OrderFormData } from '../types';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { SubscriptionStatusCard } from './SubscriptionStatusCard';
import { OrdersInfo } from '@/modules/subscriptions/components/OrdersInfo';
import AutocompleteAddress from '@/modules/address/ui/autocomplete';
import { Tabs } from '@/core/components/ui/tabs';
import { ScheduledOrderList } from '@/modules/scheduled-orders/components/ScheduledOrderList';
import { 
  useMySchedules, 
  useCreateScheduledOrder, 
  useUpdateScheduledOrder, 
  useDeleteScheduledOrder, 
  useActivateScheduledOrder, 
  useDeactivateScheduledOrder,
  useScheduledOrderFormUtils 
} from '@/modules/scheduled-orders/hooks/useScheduledOrders';
import { ScheduledOrderFormData } from '@/modules/scheduled-orders/types';

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

export const CreateOrderModalWithTabs = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false
}: CreateOrderModalProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('single');
    const { data: userSubscription } = useUserSubscription();

    // Hooks для работы с расписаниями
    const { data: scheduledOrders, isLoading: isLoadingSchedules } = useMySchedules();
    const createScheduledOrderMutation = useCreateScheduledOrder();
    const updateScheduledOrderMutation = useUpdateScheduledOrder();
    const deleteScheduledOrderMutation = useDeleteScheduledOrder();
    const activateScheduledOrderMutation = useActivateScheduledOrder();
    const deactivateScheduledOrderMutation = useDeactivateScheduledOrder();
    const { transformFormDataToDto } = useScheduledOrderFormUtils();

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
        console.log('Form data received:', data);

        // Используем новую утилиту для создания UTC даты
        const scheduledAt = createUTCFromDateTimeInput(`${data.scheduledDate}T${data.scheduledTime}`);

        const orderData: OrderFormData = {
            address: data.address,
            description: data.description,
            scheduledAt,
            notes: data.notes,
            paymentMethod: data.paymentMethod
        };

        onSubmit(orderData);
    };

    const handleScheduledOrderSubmit = (data: ScheduledOrderFormData) => {
        const dto = transformFormDataToDto(data);
        createScheduledOrderMutation.mutate(dto);
    };

    const handleScheduledOrderEdit = (id: string, data: ScheduledOrderFormData) => {
        const dto = transformFormDataToDto(data);
        updateScheduledOrderMutation.mutate({ id, data: dto });
    };

    const handleScheduledOrderDelete = (id: string) => {
        deleteScheduledOrderMutation.mutate(id);
    };

    const handleScheduledOrderToggleActive = (id: string, isActive: boolean) => {
        if (isActive) {
            activateScheduledOrderMutation.mutate(id);
        } else {
            deactivateScheduledOrderMutation.mutate(id);
        }
    };

    const hasActiveSubscription = userSubscription?.status === 'active';

    const paymentMethodOptions = hasActiveSubscription
        ? [{ value: 'subscription', label: 'По подписке', icon: '📋' }]
        : [
            { value: 'online', label: 'Оплата онлайн', icon: '💳' },
        ];

    const tabs = [
        { id: 'single', label: 'Разовый заказ', icon: <Plus className="h-4 w-4" /> },
        { id: 'schedule', label: 'Расписание', icon: <Clock className="h-4 w-4" /> },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-4xl max-h-[95vh] overflow-y-auto p-0 gap-0">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Создать заказ
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Заполните форму для создания нового заказа
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs 
                    tabs={tabs} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab}
                    className="px-6"
                />

                {/* Content */}
                <div className="px-6 py-6">
                    {activeTab === 'single' ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                {/* Subscription Status */}
                                {hasActiveSubscription && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <SubscriptionStatusCard hasActiveSubscription={hasActiveSubscription} />
                                        <div className="mt-3">
                                            <OrdersInfo />
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Адрес
                                            </FormLabel>
                                            <FormControl>
                                                <AutocompleteAddress
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Описание заказа</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Опишите, что нужно сделать"
                                                    className="resize-none"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Scheduled Date */}
                                <FormField
                                    control={form.control}
                                    name="scheduledDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Дата выполнения</FormLabel>
                                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: ru })
                                                            ) : (
                                                                <span>Выберите дату</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                            setCalendarOpen(false);
                                                        }}
                                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Scheduled Time */}
                                <FormField
                                    control={form.control}
                                    name="scheduledTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Время выполнения</FormLabel>
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

                                {/* Notes */}
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Дополнительные заметки</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Дополнительная информация"
                                                    className="resize-none"
                                                    rows={2}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Payment Method */}
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                Способ оплаты
                                            </FormLabel>
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

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                                        {isLoading ? 'Создание...' : 'Создать заказ'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <ScheduledOrderList
                            scheduledOrders={scheduledOrders || []}
                            isLoading={isLoadingSchedules}
                            onEdit={handleScheduledOrderEdit}
                            onDelete={handleScheduledOrderDelete}
                            onToggleActive={handleScheduledOrderToggleActive}
                            onCreate={handleScheduledOrderSubmit}
                            showActions={true}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
