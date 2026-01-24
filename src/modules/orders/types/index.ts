// Enums
export type OrderStatus =
  | "new"
  | "paid"
  | "assigned"
  | "in_progress"
  | "done"
  | "canceled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "subscription" | "online";

// User Response DTO (упрощенная версия)
export interface UserResponseDto {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
}

// Payment Response DTO
export interface PaymentResponseDto {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

// Order Response DTO
export interface OrderResponseDto {
  id: string;
  customer: UserResponseDto;
  currier?: UserResponseDto;
  address: string;
  description?: string;
  price: number;
  status: OrderStatus;
  scheduledAt?: string;
  assignedAt?: string;
  notes?: string;
  numberPackages?: number;
  isOverdue?: boolean;
  overdueMinutes?: number;
  payments: PaymentResponseDto[];
  createdAt: string;
  updatedAt: string;
}

// Address Details
export interface AddressDetails {
  building?: number;
  buildingBlock?: string;
  entrance?: string;
  floor?: number;
  apartment?: number;
  domophone?: string;
}

// Create Order DTO
export interface CreateOrderDto {
  customerId: string;
  address: string;
  addressId?: string;
  addressDetails?: AddressDetails;
  description?: string;
  scheduledAt?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  numberPackages?: number;
  coordinates?: {
    geo_lat: string;
    geo_lon: string;
  };
}

// Update Order Status DTO
export interface UpdateOrderStatusDto {
  status: OrderStatus;
  currierId?: string;
}

// Order List Response
export interface OrderListResponse {
  orders: OrderResponseDto[];
  total: number;
  page: number;
  limit: number;
}

// Order Query Parameters
export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
  currierId?: string;
}

// Order Form Data
export interface OrderFormData {
  address: string;
  addressId?: string;
  addressDetails?: AddressDetails;
  description?: string;
  scheduledAt?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  numberPackages?: number;
  coordinates?: {
    geo_lat: string;
    geo_lon: string;
  };
}

// Order Status Badge Props
export interface OrderStatusBadgeProps {
  status: OrderStatus;
}

// Order Card Props
export interface OrderCardProps {
  order: OrderResponseDto;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
}

// Create Order Modal Props
export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
}

// Order List Props
export interface OrderListProps {
  orders: OrderResponseDto[];
  isLoading?: boolean;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
  onOrderClick?: (order: OrderResponseDto) => void;
}

// Order Details Props
export interface OrderDetailsProps {
  order: OrderResponseDto;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  onCancel?: (orderId: string) => void;
  showActions?: boolean;
}

// Payment Types
export interface OrderPaymentRequest {
  orderId: string;
  amount: number;
}

export interface OrderPaymentResponse {
  paymentUrl: string;
  paymentId: string;
  status: "pending";
}

export interface OrderPaymentStatus {
  id: string;
  orderId: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
}
