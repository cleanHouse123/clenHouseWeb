import { axiosInstance } from "@/core/config/axios";
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderListResponse,
  OrderQueryParams,
  UpdateOrderStatusDto,
} from "../types";

export const ordersApi = {
  // Создать заказ
  createOrder: async (data: CreateOrderDto): Promise<OrderResponseDto> => {
    const response = await axiosInstance.post("/orders", data);
    return response.data;
  },

  // Получить список заказов
  getOrders: async (params?: OrderQueryParams): Promise<OrderListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.customerId) queryParams.append("customerId", params.customerId);
    if (params?.currierId) queryParams.append("currierId", params.currierId);

    const response = await axiosInstance.get(
      `/orders?${queryParams.toString()}`
    );
    return response.data;
  },

  // Получить заказ по ID
  getOrderById: async (id: string): Promise<OrderResponseDto> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  // Получить заказы клиента
  getCustomerOrders: async (
    customerId: string,
    params?: Omit<OrderQueryParams, "customerId">
  ): Promise<OrderListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);

    const response = await axiosInstance.get(
      `/orders/customer/${customerId}?${queryParams.toString()}`
    );

    // Сервер возвращает массив заказов, преобразуем в ожидаемый формат
    const orders = Array.isArray(response.data) ? response.data : [];
    return {
      orders,
      total: orders.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },

  // Получить заказы курьера
  getCurrierOrders: async (
    currierId: string,
    params?: Omit<OrderQueryParams, "currierId">
  ): Promise<OrderListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);

    const response = await axiosInstance.get(
      `/orders/currier/${currierId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Обновить статус заказа
  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusDto
  ): Promise<OrderResponseDto> => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, data);
    return response.data;
  },

  // Курьер берет заказ
  takeOrder: async (id: string): Promise<OrderResponseDto> => {
    const response = await axiosInstance.patch(`/orders/${id}/take`);
    return response.data;
  },

  // Курьер начинает выполнение
  startOrder: async (id: string): Promise<OrderResponseDto> => {
    const response = await axiosInstance.patch(`/orders/${id}/start`);
    return response.data;
  },

  // Курьер завершает заказ
  completeOrder: async (id: string): Promise<OrderResponseDto> => {
    const response = await axiosInstance.patch(`/orders/${id}/complete`);
    return response.data;
  },

  // Курьер отменяет заказ
  cancelOrder: async (id: string): Promise<OrderResponseDto> => {
    const response = await axiosInstance.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  // Удалить заказ
  deleteOrder: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response.data;
  },

  // Создать ссылку на оплату
  createPaymentLink: async (
    orderId: string,
    amount: number
  ): Promise<{
    paymentUrl: string;
    paymentId: string;
    status: string;
  }> => {
    const response = await axiosInstance.post("/orders/payment/create", {
      orderId,
      amount,
    });
    return response.data;
  },

  // Проверить статус платежа заказа
  checkPaymentStatus: async (
    paymentId: string
  ): Promise<{
    id: string;
    orderId: string;
    amount: number;
    status: "pending" | "paid" | "failed";
    createdAt: string;
  }> => {
    const response = await axiosInstance.get(
      `/orders/payment/status/${paymentId}`
    );
    return response.data;
  },
};
