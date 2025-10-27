import { ScheduledOrderList } from '@/modules/scheduled-orders/components/ScheduledOrderList';
import {
  useActivateScheduledOrder,
  useCreateScheduledOrder,
  useDeactivateScheduledOrder,
  useDeleteScheduledOrder,
  useMySchedules,
  useScheduledOrderFormUtils,
  useUpdateScheduledOrder
} from '@/modules/scheduled-orders/hooks/useScheduledOrders';
import { ScheduledOrderFormData } from '@/modules/scheduled-orders/types';
import { Calendar, Clock, Settings } from 'lucide-react';

export const ScheduledOrdersPage = () => {
  // Hooks для работы с расписаниями
  const { data: scheduledOrders, isLoading: isLoadingSchedules } = useMySchedules();
  const createScheduledOrderMutation = useCreateScheduledOrder();
  const updateScheduledOrderMutation = useUpdateScheduledOrder();
  const deleteScheduledOrderMutation = useDeleteScheduledOrder();
  const activateScheduledOrderMutation = useActivateScheduledOrder();
  const deactivateScheduledOrderMutation = useDeactivateScheduledOrder();
  const { transformFormDataToDto } = useScheduledOrderFormUtils();

  const handleCreateSchedule = (data: ScheduledOrderFormData) => {
    const dto = transformFormDataToDto(data);
    createScheduledOrderMutation.mutate(dto);
  };

  const handleEditSchedule = (id: string, data: ScheduledOrderFormData) => {
    const dto = transformFormDataToDto(data);
    updateScheduledOrderMutation.mutate({ id, data: dto });
  };

  const handleDelete = (id: string) => {
    deleteScheduledOrderMutation.mutate(id);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    if (isActive) {
      activateScheduledOrderMutation.mutate(id);
    } else {
      deactivateScheduledOrderMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-500" />
              Расписания заказов
            </h1>
            <p className="text-gray-600 mt-2">
              Управляйте автоматическими заказами и их расписанием
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего расписаний</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoadingSchedules ? '...' : scheduledOrders?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Активных</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoadingSchedules 
                  ? '...' 
                  : scheduledOrders?.filter(s => s.isActive).length || 0
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Неактивных</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoadingSchedules 
                  ? '...' 
                  : scheduledOrders?.filter(s => !s.isActive).length || 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Orders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <ScheduledOrderList
          scheduledOrders={scheduledOrders || []}
          isLoading={isLoadingSchedules}
          onEdit={handleEditSchedule}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onCreate={handleCreateSchedule}
          showActions={true}
        />
      </div>
    </div>
  );
};
