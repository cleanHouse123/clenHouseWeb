import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
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
import { useCreateOrderModal, CreateOrderProvider } from '@/core/contexts/CreateOrderContext';

const ScheduledOrdersContent = () => {
  const navigate = useNavigate();
  const { openCreateOrderModal } = useCreateOrderModal();
  
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 }
  };

  const handleCreateOrder = () => {
    openCreateOrderModal();
  };

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Хлебные крошки */}
          <div className="flex flex-col gap-[20px] bg-white rounded-[32px] p-[16px] md:p-[36px]">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={() => navigate('/dashboard')}
                className="hover:text-gray-700 transition-colors cursor-pointer"
              >
                Личный кабинет
              </button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Расписания заказов</span>
            </nav>

            {/* Заголовок и действия */}
            <div className="flex flex-col md:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Расписания заказов
                </h1>
                <p className="text-lg text-gray-600">
                  Управление автоматическими заказами
                </p>
              </div>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={handleCreateOrder}
                className="sm:col-span-2 lg:col-span-1 cursor-pointer group"
              >
                <div className="gap-[10px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl p-4 h-[99px] flex flex-row justify-between transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-[8px]">
                      Создать расписание
                    </h3>
                    <p className="text-orange-100 text-sm sm:text-base">
                      Автоматические заказы
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Список расписаний */}
          <div className="bg-white rounded-[32px] p-[18px] md:p-[36px]">
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
      </main>
    </div>
  );
};

export const ScheduledOrdersPage = () => {
  return (
    <CreateOrderProvider onOrderCreated={() => window.location.reload()}>
      <ScheduledOrdersContent />
    </CreateOrderProvider>
  );
};
