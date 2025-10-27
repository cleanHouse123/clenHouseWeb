import { axiosInstance } from '@/core/config/axios';
import {
  ScheduledOrderResponseDto,
  CreateScheduledOrderDto,
  UpdateScheduledOrderDto,
} from '../types';

const SCHEDULED_ORDERS_ENDPOINT = '/scheduled-orders';

export const scheduledOrdersApi = {
  // Создать расписание заказов
  createScheduledOrder: async (data: CreateScheduledOrderDto): Promise<ScheduledOrderResponseDto> => {
    const response = await axiosInstance.post(`${SCHEDULED_ORDERS_ENDPOINT}`, data);
    return response.data;
  },

  // Получить мои расписания
  getMySchedules: async (): Promise<ScheduledOrderResponseDto[]> => {
    const response = await axiosInstance.get(`${SCHEDULED_ORDERS_ENDPOINT}/my-schedules`);
    return response.data;
  },

  // Получить расписание по ID
  getScheduleById: async (id: string): Promise<ScheduledOrderResponseDto> => {
    const response = await axiosInstance.get(`${SCHEDULED_ORDERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Обновить расписание
  updateSchedule: async (id: string, data: UpdateScheduledOrderDto): Promise<ScheduledOrderResponseDto> => {
    const response = await axiosInstance.patch(`${SCHEDULED_ORDERS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Активировать расписание
  activateSchedule: async (id: string): Promise<ScheduledOrderResponseDto> => {
    const response = await axiosInstance.patch(`${SCHEDULED_ORDERS_ENDPOINT}/${id}/activate`);
    return response.data;
  },

  // Деактивировать расписание
  deactivateSchedule: async (id: string): Promise<ScheduledOrderResponseDto> => {
    const response = await axiosInstance.patch(`${SCHEDULED_ORDERS_ENDPOINT}/${id}/deactivate`);
    return response.data;
  },

  // Удалить расписание
  deleteSchedule: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${SCHEDULED_ORDERS_ENDPOINT}/${id}`);
  },
};
