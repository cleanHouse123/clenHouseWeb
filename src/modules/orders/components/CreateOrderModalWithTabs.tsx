import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { CalendarIcon, Plus, MapPin, CreditCard, CheckCircle, Edit2, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createUTCFromDateTimeInput } from '@/core/utils/dateUtils';
import { cn } from '@/core/lib/utils';
import { OrderFormData } from '../types';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';
import { AddressModal, AddressModalData } from './AddressModal';
import { useWorkTime } from '@/modules/work-time/hooks/useWorkTime';
// Tabs removed as only single order form is used now
// import { Tabs } from '@/core/components/ui/tabs';
// import { ScheduledOrderList } from '@/modules/scheduled-orders/components/ScheduledOrderList';
// import {
//     useMySchedules,
//     useCreateScheduledOrder,
//     useUpdateScheduledOrder,
//     useDeleteScheduledOrder,
//     useActivateScheduledOrder,
//     useDeactivateScheduledOrder,
//     useScheduledOrderFormUtils
// } from '@/modules/scheduled-orders/hooks/useScheduledOrders';
// import { ScheduledOrderFormData } from '@/modules/scheduled-orders/types';

const createOrderSchema = z.object({
    address: z.string().min(1, 'Адрес обязателен').max(500, 'Адрес слишком длинный'),
    building: z.coerce.number().min(1, 'Дом должен быть больше 0').optional(),
    buildingBlock: z.string().max(50, 'Корпус слишком длинный').optional(),
    entrance: z.string().max(50, 'Подъезд слишком длинный').optional(),
    floor: z.coerce.number().min(1, 'Этаж должен быть больше 0').optional(),
    apartment: z.coerce.number().min(1, 'Квартира должна быть больше 0').optional(),
    domophone: z.string().max(50, 'Домофон слишком длинный').optional(),
    description: z.string().max(1000, 'Описание слишком длинное').optional(),
    scheduledDate: z.date().optional(),
    scheduledTime: z.string().optional(),
    notes: z.string().max(500, 'Заметки слишком длинные').optional(),
    paymentMethod: z.enum(['subscription', 'online'] as const),
    numberPackages: z.coerce.number().min(2, 'Количество пакетов должно быть не менее 2'),
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
    const [addressData, setAddressData] = useState<AddressModalData | null>(null);
    const { data: userSubscription } = useUserSubscription();
    const { data: workTimes, isLoading: isWorkTimeLoading } = useWorkTime();
    console.log(workTimes, "workTimes");

    const latestWorkTime = workTimes?.at(-1);
    console.log(latestWorkTime, "latestWorkTime");

    const minTime = latestWorkTime?.startTime;
    const maxTime = latestWorkTime?.endTime;

    console.log(minTime);
    console.log(maxTime);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Hooks для работы с расписаниями (закомментировано, т.к. табы удалены)
    // const { data: scheduledOrders, isLoading: isLoadingSchedules } = useMySchedules();
    // const createScheduledOrderMutation = useCreateScheduledOrder();
    // const updateScheduledOrderMutation = useUpdateScheduledOrder();
    // const deleteScheduledOrderMutation = useDeleteScheduledOrder();
    // const activateScheduledOrderMutation = useActivateScheduledOrder();
    // const deactivateScheduledOrderMutation = useDeactivateScheduledOrder();
    // const { transformFormDataToDto } = useScheduledOrderFormUtils();

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
            paymentMethod: 'online',
            numberPackages: 2,
        },
    });

    useEffect(() => {
        form.setValue('paymentMethod', userSubscription?.status === 'active' ? 'subscription' : 'online');
    }, [userSubscription, form]);

    // Отслеживаем изменение способа оплаты
    const paymentMethod = useWatch({
        control: form.control,
        name: 'paymentMethod',
    });

    // По подписке 1 заказ соответствует 2 пакетам
    useEffect(() => {
        if (paymentMethod === 'subscription') {
            form.setValue('numberPackages', 2);
        }
    }, [paymentMethod, form]);

    useEffect(() => {
        if (!isOpen) {
            setAddressData(null);
            form.reset();
        }
    }, [isOpen, form]);
    const handleAddressModalSubmit = (data: AddressModalData) => {
        setAddressData(data);
        form.setValue('address', data.address);
        form.clearErrors('address');
        setIsAddressModalOpen(false);
    };

    const handleSubmit = (data: CreateOrderFormData) => {
        if (!addressData) {
            return;
        }

        // Формируем scheduledAt только если указаны и дата, и время
        let scheduledAt: string | undefined;
        if (data.scheduledDate && data.scheduledTime) {
            const year = data.scheduledDate.getFullYear();
            const month = String(data.scheduledDate.getMonth() + 1).padStart(2, '0');
            const day = String(data.scheduledDate.getDate()).padStart(2, '0');
            const datePart = `${year}-${month}-${day}`;
            scheduledAt = createUTCFromDateTimeInput(`${datePart}T${data.scheduledTime}`);
        }

        const orderData: OrderFormData = {
            address: addressData.address,
            ...(addressData.addressId && { addressId: addressData.addressId }),
            ...(addressData.addressDetails && { addressDetails: addressData.addressDetails }),
            description: data.description,
            ...(scheduledAt && { scheduledAt }),
            notes: data.notes,
            paymentMethod: data.paymentMethod,
            numberPackages: data.numberPackages,
            coordinates: addressData.coordinates,
        };

        onSubmit(orderData);

        setAddressData(null);
        form.reset();
    };

    // Функции для работы с расписаниями (закомментировано, т.к. табы удалены)
    // const handleScheduledOrderSubmit = (data: ScheduledOrderFormData) => {
    //     const dto = transformFormDataToDto(data);
    //     createScheduledOrderMutation.mutate(dto);
    // };

    // const handleScheduledOrderEdit = (id: string, data: ScheduledOrderFormData) => {
    //     const dto = transformFormDataToDto(data);
    //     updateScheduledOrderMutation.mutate({ id, data: dto });
    // };

    // const handleScheduledOrderDelete = (id: string) => {
    //     deleteScheduledOrderMutation.mutate(id);
    // };

    // const handleScheduledOrderToggleActive = (id: string, isActive: boolean) => {
    //     if (isActive) {
    //         activateScheduledOrderMutation.mutate(id);
    //     } else {
    //         deactivateScheduledOrderMutation.mutate(id);
    //     }
    // };

    const hasActiveSubscription = userSubscription?.status === 'active';

    // Вычисляем информацию о подписке
    const isUnlimited = hasActiveSubscription && userSubscription?.ordersLimit === -1;
    const remainingOrders = hasActiveSubscription && !isUnlimited
        ? (userSubscription?.ordersLimit || 0) - (userSubscription?.usedOrders || 0)
        : null;
    const hasRemainingOrders = remainingOrders === null || remainingOrders > 0;

    const paymentMethodOptions = [
        { value: 'online', label: 'Оплата онлайн', icon: '💳' },
    ]

    // Tabs config removed

    if (hasActiveSubscription && hasRemainingOrders) {
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

                {/* Tabs removed */}

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 pr-8 pb-4 mb-4 custom-scrollbar">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                            console.log('errors', errors);
                        })} className="space-y-6">
                            {/* Subscription Status */}
                            {hasActiveSubscription && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>У вас активная подписка</span>
                                    </div>
                                    {isUnlimited ? (
                                        <p className="text-sm text-green-600">
                                            Безлимитные заказы {userSubscription?.usedOrders !== undefined && `(использовано: ${userSubscription.usedOrders})`}
                                        </p>
                                    ) : remainingOrders !== null && (
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-600">
                                                Доступно: <span className="font-medium text-gray-900">{userSubscription?.ordersLimit || 0}</span>
                                            </span>
                                            <span className="text-gray-600">
                                                Использовано: <span className="font-medium text-gray-900">{userSubscription?.usedOrders || 0}</span>
                                            </span>
                                            <span className="text-green-700 font-medium">
                                                Осталось: {remainingOrders} {remainingOrders === 1 ? 'заказ' : remainingOrders < 5 ? 'заказа' : 'заказов'}
                                            </span>
                                        </div>
                                    )}
                                    {!hasRemainingOrders && remainingOrders !== null && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                                            <p className="text-sm text-yellow-800">
                                                Лимит заказов по подписке исчерпан. Используйте оплату онлайн.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Address Section */}
                            <div className="space-y-2">
                                <FormLabel className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Адрес
                                </FormLabel>
                                {addressData ? (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 mb-2">
                                                    {addressData.address}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                    {addressData.addressDetails?.building && (
                                                        <div>
                                                            <span className="font-medium">Дом:</span> {addressData.addressDetails.building}
                                                        </div>
                                                    )}
                                                    {addressData.addressDetails?.buildingBlock && (
                                                        <div>
                                                            <span className="font-medium">Корпус:</span> {addressData.addressDetails.buildingBlock}
                                                        </div>
                                                    )}
                                                    {addressData.addressDetails?.entrance && (
                                                        <div>
                                                            <span className="font-medium">Подъезд:</span> {addressData.addressDetails.entrance}
                                                        </div>
                                                    )}
                                                    {addressData.addressDetails?.floor && (
                                                        <div>
                                                            <span className="font-medium">Этаж:</span> {addressData.addressDetails.floor}
                                                        </div>
                                                    )}
                                                    {addressData.addressDetails?.apartment && (
                                                        <div>
                                                            <span className="font-medium">Квартира:</span> {addressData.addressDetails.apartment}
                                                        </div>
                                                    )}
                                                    {addressData.addressDetails?.domophone && (
                                                        <div>
                                                            <span className="font-medium">Домофон:</span> {addressData.addressDetails.domophone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsAddressModalOpen(true)}
                                                    className="h-8"
                                                >
                                                    <Edit2 className="h-3 w-3 mr-1" />
                                                    Изменить
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setAddressData(null);
                                                        form.setValue('address', '');
                                                        form.setError('address', { message: 'Адрес обязателен' });
                                                    }}
                                                    className="h-8"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="w-full justify-start"
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Выбрать адрес
                                    </Button>
                                )}
                            </div>
                            {/* Address */}
                            {/* <FormField
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
                            /> */}

                            {/* Address Details */}
                            {/* <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                            </div> */}

                            {/* Payment Method */}
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => {
                                    console.log('paymentMethodOptions', paymentMethodOptions);
                                    console.log('field.value', field.value);
                                    return <FormItem>
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
                                }}
                            />

                            {/* Packages Count */}
                            <FormField
                                control={form.control}
                                name="numberPackages"
                                render={({ field }) => {
                                    const isSubscription = paymentMethod === 'subscription';

                                    if (isSubscription) {
                                        return (
                                            <FormItem>
                                                <FormLabel>Количество пакетов</FormLabel>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex items-start gap-2">
                                                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-blue-900">
                                                                По подписке можно выносить только 1 заказ (2 пакета) до 60 литров
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }

                                    return (
                                        <FormItem>
                                            <FormLabel>Количество пакетов</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                value={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Выберите количество пакетов" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: 3 }, (_, i) => i + 2).map((num) => (
                                                        <SelectItem key={num} value={String(num)}>
                                                            {num} {num === 1 ? 'пакет' : num < 5 ? 'пакета' : 'пакетов'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-sm text-muted-foreground mt-1">1 заказ = 2 пакета</p>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
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
                                        <FormLabel>Дата выполнения (опционально)</FormLabel>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <span className="line-clamp-1">
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: ru })
                                                            ) : (
                                                                "Выберите дату (необязательно)"
                                                            )}
                                                        </span>
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 flex-shrink-0" />
                                                    </button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        if (!date) {
                                                            form.setValue('scheduledTime', '');
                                                        }
                                                        setCalendarOpen(false);
                                                    }}
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Если не указано, время выноса будет установлено автоматически
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Scheduled Time */}
                            {form.watch('scheduledDate') && (
                                <FormField
                                    control={form.control}
                                    name="scheduledTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Время выполнения (опционально)</FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Выберите время"
                                                    minTime={minTime ?? undefined}
                                                    maxTime={maxTime ?? undefined}
                                                    disabled={isLoading || isWorkTimeLoading}
                                                />
                                            </FormControl>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Можно указать любое время, даже в прошлом
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

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

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isLoading || !addressData} className="min-w-[120px]">
                                    {isLoading ? 'Создание...' : 'Создать заказ'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onSubmit={handleAddressModalSubmit}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
};
