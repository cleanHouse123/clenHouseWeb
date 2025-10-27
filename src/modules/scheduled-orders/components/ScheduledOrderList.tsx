import { useState } from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Plus, Calendar, Clock } from 'lucide-react';
import { ScheduledOrderListProps } from '../types';
import { ScheduledOrderCard } from './ScheduledOrderCard';
import { ScheduledOrderModal } from './ScheduledOrderModal';
import { useScheduledOrderFormUtils } from '../hooks/useScheduledOrders';
import { ScheduledOrderFormData, ScheduledOrderResponseDto } from '../types';

export const ScheduledOrderList = ({
  scheduledOrders,
  isLoading = false,
  onEdit,
  onDelete,
  onToggleActive,
  onCreate,
  showActions = true
}: ScheduledOrderListProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ScheduledOrderFormData | undefined>();
  const [editingOrderId, setEditingOrderId] = useState<string | undefined>();
  const { transformDtoToFormData } = useScheduledOrderFormUtils();

  const handleCreate = () => {
    setEditingOrder(undefined);
    setEditingOrderId(undefined);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (scheduledOrder: ScheduledOrderResponseDto) => {
    const formData = transformDtoToFormData(scheduledOrder);
    setEditingOrder(formData);
    setEditingOrderId(scheduledOrder.id);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (data: ScheduledOrderFormData) => {
    if (editingOrder && editingOrderId) {
      // Редактирование существующего расписания
      onEdit?.(editingOrderId, data);
    } else {
      // Создание нового расписания
      onCreate?.(data);
    }
    setIsCreateModalOpen(false);
    setEditingOrder(undefined);
    setEditingOrderId(undefined);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingOrder(undefined);
    setEditingOrderId(undefined);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-[16px] border border-gray-100 p-4">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {scheduledOrders.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет расписаний
          </h3>
          <p className="text-gray-600 mb-4">
            Создайте расписание для автоматического создания заказов
          </p>
          <Button 
            onClick={handleCreate} 
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white mx-auto"
          >
            <Plus className="h-4 w-4" />
            Создать первое расписание
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {scheduledOrders.map((scheduledOrder) => (
            <ScheduledOrderCard
              key={scheduledOrder.id}
              scheduledOrder={scheduledOrder}
              onEdit={handleEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              showActions={showActions}
            />
          ))}
        </div>
      )}

      {/* Модальное окно создания/редактирования */}
      <ScheduledOrderModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editData={editingOrder}
        title={editingOrder ? 'Редактировать расписание' : 'Создать расписание'}
      />
    </div>
  );
};
