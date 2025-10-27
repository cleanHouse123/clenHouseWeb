export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // в днях
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  type: "monthly" | "yearly";
  price: number;
  status: "pending" | "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  paymentUrl?: string; // Ссылка на оплату, если подписка не оплачена
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
  usedOrders?: number; // количество использованных заказов
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionByPlanRequest {
  planId: string;
}

export interface CreateSubscriptionRequest {
  userId: string;
  type: "monthly" | "yearly";
  price: number;
  startDate: string;
  endDate: string;
  ordersLimit?: number;
}

export interface CreateSubscriptionResponse extends UserSubscription {
  message?: string;
}

export interface PaymentLinkRequest {
  subscriptionId: string;
  planId: string;
  subscriptionType: "monthly" | "yearly";
  amount: number; // В копейках
}

export interface PaymentLinkResponse {
  paymentUrl: string;
  paymentId: string;
  status: "pending";
}

export interface SimulatePaymentRequest {
  paymentId: string;
  success: boolean;
}

export interface SimulatePaymentResponse {
  success: boolean;
  message: string;
}

export interface PaymentWebSocketEvent {
  type: "payment_success" | "payment_error";
  data: {
    paymentId: string;
    userId: string;
    subscriptionId?: string;
    orderId?: string;
    amount: number;
    message?: string;
    error?: string;
    timestamp: string;
  };
}

export interface JoinPaymentRoomRequest {
  paymentId: string;
  userId: string;
}

export interface LeavePaymentRoomRequest {
  paymentId: string;
  userId: string;
}

// Типы для планов подписок
export interface SubscriptionPlan {
  id: string;
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInKopecks: number;
  duration: string;
  features: string[];
  icon: string;
  badgeColor: "blue" | "green";
  popular: boolean;
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
  usedOrders?: number; // количество использованных заказов
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanDto {
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInKopecks: number;
  duration: string;
  features: string[];
  icon: string;
  badgeColor: "blue" | "green";
  popular: boolean;
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
}

export interface UpdateSubscriptionPlanDto
  extends Partial<CreateSubscriptionPlanDto> {}

export interface SubscriptionPlanFormData {
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInRubles: number;
  duration: string;
  features: string[];
  icon: string;
  badgeColor: "blue" | "green";
  popular: boolean;
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
}
