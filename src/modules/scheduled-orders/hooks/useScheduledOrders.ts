import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { scheduledOrdersApi } from '../api';
import {
  ScheduledOrderResponseDto,
  CreateScheduledOrderDto,
  UpdateScheduledOrderDto,
  ScheduledOrderFormData,
} from '../types';
import { 
  createUTCDateOnly, 
  createLocalDateOnly, 
  convertLocalTimeToUTC, 
  convertUTCTimeToLocal 
} from '@/core/utils/dateUtils';

// Query keys
export const scheduledOrdersKeys = {
  all: ['scheduled-orders'] as const,
  mySchedules: () => [...scheduledOrdersKeys.all, 'my-schedules'] as const,
  scheduleById: (id: string) => [...scheduledOrdersKeys.all, 'schedule', id] as const,
};

// Получить мои расписания
export const useMySchedules = () => {
  return useQuery({
    queryKey: scheduledOrdersKeys.mySchedules(),
    queryFn: scheduledOrdersApi.getMySchedules,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Получить расписание по ID
export const useScheduleById = (id: string) => {
  return useQuery({
    queryKey: scheduledOrdersKeys.scheduleById(id),
    queryFn: () => scheduledOrdersApi.getScheduleById(id),
    enabled: !!id,
  });
};

// Создать расписание
export const useCreateScheduledOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduledOrderDto) => scheduledOrdersApi.createScheduledOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.mySchedules() });
      toast.success('Расписание создано успешно');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка при создании расписания';
      toast.error(message);
    },
  });
};

// Обновить расписание
export const useUpdateScheduledOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduledOrderDto }) =>
      scheduledOrdersApi.updateSchedule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.mySchedules() });
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.scheduleById(id) });
      toast.success('Расписание обновлено успешно');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка при обновлении расписания';
      toast.error(message);
    },
  });
};

// Активировать расписание
export const useActivateScheduledOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduledOrdersApi.activateSchedule(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.mySchedules() });
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.scheduleById(id) });
      toast.success('Расписание активировано');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка при активации расписания';
      toast.error(message);
    },
  });
};

// Деактивировать расписание
export const useDeactivateScheduledOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduledOrdersApi.deactivateSchedule(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.mySchedules() });
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.scheduleById(id) });
      toast.success('Расписание деактивировано');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка при деактивации расписания';
      toast.error(message);
    },
  });
};

// Удалить расписание
export const useDeleteScheduledOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduledOrdersApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduledOrdersKeys.mySchedules() });
      toast.success('Расписание удалено успешно');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка при удалении расписания';
      toast.error(message);
    },
  });
};

// Утилиты для преобразования данных формы
export const useScheduledOrderFormUtils = () => {
  const transformFormDataToDto = (formData: ScheduledOrderFormData): CreateScheduledOrderDto => {
    const addressDetails: CreateScheduledOrderDto['addressDetails'] = {};
    if (formData.building) addressDetails.building = formData.building;
    if (formData.buildingBlock) addressDetails.buildingBlock = formData.buildingBlock;
    if (formData.entrance) addressDetails.entrance = formData.entrance;
    if (formData.floor) addressDetails.floor = formData.floor;
    if (formData.apartment) addressDetails.apartment = formData.apartment;
    if (formData.domophone) addressDetails.domophone = formData.domophone;

    const hasAddressDetails = Object.keys(addressDetails).length > 0;

    return {
      address: formData.address,
      ...(hasAddressDetails && { addressDetails }),
      description: formData.description,
      notes: formData.notes,
      frequency: formData.frequency,
      preferredTime: formData.preferredTime ? convertLocalTimeToUTC(formData.preferredTime) : undefined,
      daysOfWeek: formData.daysOfWeek,
      startDate: createUTCDateOnly(formData.startDate),
      endDate: formData.endDate ? createUTCDateOnly(formData.endDate) : undefined,
    };
  };

  const transformDtoToFormData = (dto: ScheduledOrderResponseDto): ScheduledOrderFormData => {
    return {
      address: dto.address,
      building: dto.addressDetails?.building,
      buildingBlock: dto.addressDetails?.buildingBlock,
      entrance: dto.addressDetails?.entrance,
      floor: dto.addressDetails?.floor,
      apartment: dto.addressDetails?.apartment,
      domophone: dto.addressDetails?.domophone,
      description: dto.description,
      notes: dto.notes,
      frequency: dto.frequency,
      preferredTime: dto.preferredTime ? convertUTCTimeToLocal(dto.preferredTime) : undefined,
      daysOfWeek: dto.daysOfWeek,
      startDate: createLocalDateOnly(typeof dto.startDate === 'string' ? dto.startDate : dto.startDate.toISOString()),
      endDate: dto.endDate ? createLocalDateOnly(typeof dto.endDate === 'string' ? dto.endDate : dto.endDate.toISOString()) : undefined,
    };
  };

  return {
    transformFormDataToDto,
    transformDtoToFormData,
  };
};
