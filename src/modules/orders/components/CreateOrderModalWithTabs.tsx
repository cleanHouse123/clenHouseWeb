import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button/button';
import { Dialog, DialogContent } from '@/core/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Textarea } from '@/core/components/ui/inputs/textarea';
import { Input } from '@/core/components/ui/inputs/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/inputs/select';
import { Calendar } from '@/core/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
import { TimePicker } from '@/core/components/ui/time-picker';
import { CalendarIcon, Plus, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createUTCFromDateTimeInput } from '@/core/utils/dateUtils';
import { cn } from '@/core/lib/utils';
import { OrderFormData, AddressDetails } from '../types';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import AutocompleteAddress from '@/modules/address/ui/autocomplete';
import { Address } from '@/modules/address/types';
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
    building: z.coerce.number().min(1, 'Дом должен быть больше 0').optional(),
    buildingBlock: z.string().max(50, 'Корпус слишком длинный').optional(),
    entrance: z.string().max(50, 'Подъезд слишком длинный').optional(),
    floor: z.coerce.number().min(1, 'Этаж должен быть больше 0').optional(),
    apartment: z.coerce.number().min(1, 'Квартира должна быть больше 0').optional(),
    domophone: z.string().max(50, 'Домофон слишком длинный').optional(),
    description: z.string().max(1000, 'Описание слишком длинное').optional(),
    scheduledDate: z.date({
        required_error: 'Дата обязательна',
        invalid_type_error: 'Дата обязательна',
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
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const { data: userSubscription } = useUserSubscription();

    const handleAddressSelect = (address: Address) => {
        console.log('Address selected in modal, full address:', address);
        console.log('Address geo_lat:', address.geo_lat);
        console.log('Address geo_lon:', address.geo_lon);
        setSelectedAddress(address);
    };

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
            building: undefined,
            buildingBlock: '',
            entrance: '',
            floor: undefined,
            apartment: undefined,
            domophone: '',
            description: '',
            scheduledDate: undefined,
            scheduledTime: '',
            notes: '',
            paymentMethod: userSubscription?.status === 'active' ? 'subscription' : 'online',
        },
    });

    const handleSubmit = (data: CreateOrderFormData) => {
        console.log('Form data received:', data);
        console.log('Selected address:', selectedAddress);

        // Формируем YYYY-MM-DD из объекта Date и создаем UTC строку
        const year = data.scheduledDate.getFullYear();
        const month = String(data.scheduledDate.getMonth() + 1).padStart(2, '0');
        const day = String(data.scheduledDate.getDate()).padStart(2, '0');
        const datePart = `${year}-${month}-${day}`;
        const scheduledAt = createUTCFromDateTimeInput(`${datePart}T${data.scheduledTime}`);

        const coordinates = selectedAddress?.geo_lat && selectedAddress?.geo_lon
            ? {
                geo_lat: selectedAddress.geo_lat,
                geo_lon: selectedAddress.geo_lon,
            }
            : undefined;

        console.log('Coordinates to send:', coordinates);

        const addressDetails: AddressDetails = {};

        // Если в выбранном адресе уже есть номер дома, поле "Дом" из формы не используем
        const hasHouseInSelected = !!selectedAddress?.house;

        if (data.building && !hasHouseInSelected) addressDetails.building = data.building;
        if (data.buildingBlock) addressDetails.buildingBlock = data.buildingBlock;
        if (data.entrance) addressDetails.entrance = data.entrance;
        if (data.floor) addressDetails.floor = data.floor;
        if (data.apartment) addressDetails.apartment = data.apartment;
        if (data.domophone) addressDetails.domophone = data.domophone;

        const hasAddressDetails = Object.keys(addressDetails).length > 0;

        const orderData: OrderFormData = {
            address: data.address,
            ...(hasAddressDetails && { addressDetails }),
            description: data.description,
            scheduledAt,
            notes: data.notes,
            paymentMethod: data.paymentMethod,
            coordinates,
        };

        console.log('Final order data:', orderData);

        onSubmit(orderData);

        setSelectedAddress(null);
        form.reset();
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

    const paymentMethodOptions =  [
        { value: 'online', label: 'Оплата онлайн', icon: '💳' },
    ]

    const tabs = [
        { id: 'single', label: 'Разовый заказ', icon: <Plus className="h-4 w-4" /> },
    ]
  
    if (hasActiveSubscription) {
        const isUnlimited = userSubscription?.ordersLimit === -1;
        const remainingOrders = isUnlimited 
            ? null 
            : (userSubscription?.ordersLimit || 0) - (userSubscription?.usedOrders || 0);
        const subscriptionLabel = isUnlimited 
            ? 'По подписке: безлимит'
            : `По подписке: осталось ${remainingOrders} заказов`;
        paymentMethodOptions.push({ value: 'subscription', label: subscriptionLabel, icon: '📋' });

        // tabs.push({ id: 'schedule', label: 'Расписание', icon: <Clock className="h-4 w-4" /> });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-4xl max-h-[85vh] sm:max-h-[95vh] p-0 gap-0 shadow-2xl flex flex-col overflow-x-hidden">
                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 px-4 sm:px-6 py-4 sm:py-6 rounded-t-[24px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-[12px] flex items-center justify-center flex-shrink-0">
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Создать заказ
                            </h2>
                            <p className="text-sm text-gray-600">
                                Заполните форму для создания нового заказа
                            </p>
                        </div>
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 pr-8 pb-4 mb-4 custom-scrollbar">
                    {activeTab === 'single' ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                {/* Subscription Status */}
                                {hasActiveSubscription && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>У вас активная подписка</span>
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
                                                    onChange={(value) => {
                                                        console.log('Address onChange:', value);
                                                        // Если адрес изменился вручную, очищаем selectedAddress
                                                        // чтобы координаты не передавались для вручную введенных адресов
                                                        if (selectedAddress && selectedAddress.display !== value) {
                                                            console.log('Address changed manually, clearing selected address');
                                                            setSelectedAddress(null);
                                                        }
                                                        field.onChange(value);
                                                    }}
                                                    onAddressSelect={handleAddressSelect}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Address Details */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <FormField
                                        control={form.control}
                                        name="building"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Дом</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Дом"
                                                        className="w-full rounded-lg"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="buildingBlock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Корпус</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Корпус"
                                                        className="w-full rounded-lg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="entrance"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Подъезд</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Подъезд"
                                                        className="w-full rounded-lg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="floor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Этаж</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Этаж"
                                                        className="w-full rounded-lg"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="apartment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Квартира</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Квартира"
                                                        className="w-full rounded-lg"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="domophone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Домофон</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Домофон"
                                                        className="w-full rounded-lg"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

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
