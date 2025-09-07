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
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  userId: string;
  type: "monthly" | "yearly";
  price: number;
  startDate: string;
  endDate: string;
}

export interface CreateSubscriptionResponse extends UserSubscription {
  message?: string;
}

export interface PaymentLinkRequest {
  subscriptionId: string;
  subscriptionType: "monthly" | "yearly";
  amount: number;
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
    userId: string;
    subscriptionId: string;
    message?: string;
    error?: string;
    timestamp: string;
  };
}

export interface JoinPaymentRoomRequest {
  userId: string;
  paymentId?: string;
}

export interface LeavePaymentRoomRequest {
  userId: string;
  paymentId?: string;
}
