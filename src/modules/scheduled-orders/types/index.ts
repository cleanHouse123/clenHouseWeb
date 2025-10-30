// Enums
export enum ScheduleFrequency {
  DAILY = 'daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

// User Response DTO (упрощенная версия)
export interface UserResponseDto {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
}

// Scheduled Order Response DTO
export interface ScheduledOrderResponseDto {
  id: string;
  customerId: string;
  customer: UserResponseDto;
  address: string;
  addressDetails?: {
    building?: number;
    buildingBlock?: string;
    entrance?: string;
    floor?: number;
    apartment?: number;
    domophone?: string;
  };
  description?: string;
  notes?: string;
  frequency: ScheduleFrequency;
  preferredTime?: string;
  daysOfWeek?: number[];
  startDate: Date | string; // Может быть Date объектом или ISO строкой
  endDate?: Date | string; // Может быть Date объектом или ISO строкой
  isActive: boolean;
  lastCreatedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Create Scheduled Order DTO
export interface CreateScheduledOrderDto {
  address: string;
  addressDetails?: {
    building?: number;
    buildingBlock?: string;
    entrance?: string;
    floor?: number;
    apartment?: number;
    domophone?: string;
  };
  description?: string;
  notes?: string;
  frequency: ScheduleFrequency;
  preferredTime?: string;
  daysOfWeek?: number[];
  startDate: string;
  endDate?: string;
}

// Update Scheduled Order DTO
export interface UpdateScheduledOrderDto {
  address?: string;
  description?: string;
  notes?: string;
  frequency?: ScheduleFrequency;
  preferredTime?: string;
  daysOfWeek?: number[];
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

// Scheduled Order Form Data
export interface ScheduledOrderFormData {
  address: string;
  building?: number;
  buildingBlock?: string;
  entrance?: string;
  floor?: number;
  apartment?: number;
  domophone?: string;
  description?: string;
  notes?: string;
  frequency: ScheduleFrequency;
  preferredTime?: string;
  daysOfWeek?: number[];
  startDate: Date;
  endDate?: Date;
}

// Scheduled Order Card Props
export interface ScheduledOrderCardProps {
  scheduledOrder: ScheduledOrderResponseDto;
  onEdit?: (scheduledOrder: ScheduledOrderResponseDto) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  showActions?: boolean;
}

// Scheduled Order List Props
export interface ScheduledOrderListProps {
  scheduledOrders: ScheduledOrderResponseDto[];
  isLoading?: boolean;
  onEdit?: (id: string, data: ScheduledOrderFormData) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onCreate?: (data: ScheduledOrderFormData) => void;
  showActions?: boolean;
}

// Create Scheduled Order Modal Props
export interface CreateScheduledOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduledOrderFormData) => void;
  isLoading?: boolean;
  editData?: ScheduledOrderResponseDto;
}

// Edit Scheduled Order Modal Props
export interface EditScheduledOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduledOrderFormData) => void;
  isLoading?: boolean;
  scheduledOrder: ScheduledOrderResponseDto;
}

// Frequency Options
export interface FrequencyOption {
  value: ScheduleFrequency;
  label: string;
  description: string;
}

// Day of Week Options
export interface DayOfWeekOption {
  value: number;
  label: string;
  shortLabel: string;
}

// Scheduled Order Status Badge Props
export interface ScheduledOrderStatusBadgeProps {
  isActive: boolean;
}

// Scheduled Order Details Props
export interface ScheduledOrderDetailsProps {
  scheduledOrder: ScheduledOrderResponseDto;
  onEdit?: (scheduledOrder: ScheduledOrderResponseDto) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  showActions?: boolean;
}
