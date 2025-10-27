import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import {
  Calendar,
  Clock,
  Edit,
  FileText,
  MapPin,
  MoreVertical,
  Pause,
  Play,
  StickyNote,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { ScheduledOrderCardProps } from '../types';
import {
  formatScheduleDate,
  formatScheduleDescription,
  getScheduleStatus
} from '../utils/scheduleUtils';

export const ScheduledOrderCard = ({
  scheduledOrder,
  onEdit,
  onDelete,
  onToggleActive,
  showActions = true
}: ScheduledOrderCardProps) => {
  const status = getScheduleStatus(scheduledOrder);
  const statusConfig = {
    active: { label: 'Активно', variant: 'default' as const, color: 'text-green-600' },
    inactive: { label: 'Неактивно', variant: 'secondary' as const, color: 'text-gray-600' },
    pending: { label: 'Ожидает', variant: 'outline' as const, color: 'text-yellow-600' },
    expired: { label: 'Истекло', variant: 'destructive' as const, color: 'text-red-600' },
  };

  const currentStatus = statusConfig[status];

  const handleToggleActive = () => {
    onToggleActive?.(scheduledOrder.id, !scheduledOrder.isActive);
  };

  const handleDelete = () => {
    toast.error('Удаление расписания', {
      description: 'Вы уверены, что хотите удалить это расписание?',
      action: {
        label: 'Удалить',
        onClick: () => {
          onDelete?.(scheduledOrder.id);
          toast.success('Расписание удалено');
        }
      },
      cancel: {
        label: 'Отмена',
        onClick: () => {}
      }
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="truncate">{scheduledOrder.address}</span>
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={currentStatus.variant} className="text-xs">
                  {currentStatus.label}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatScheduleDescription(
                    scheduledOrder.frequency,
                    scheduledOrder.daysOfWeek,
                    scheduledOrder.preferredTime
                  )}
                </span>
              </div>
            </div>
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(scheduledOrder)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggleActive}>
                    {scheduledOrder.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Деактивировать
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Активировать
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Описание */}
            {scheduledOrder.description && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-700">{scheduledOrder.description}</p>
              </div>
            )}

            {/* Заметки */}
            {scheduledOrder.notes && (
              <div className="flex items-start gap-2">
                <StickyNote className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-600">{scheduledOrder.notes}</p>
              </div>
            )}

            {/* Даты */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Начало: {formatScheduleDate(new Date(scheduledOrder.startDate))}</span>
              </div>
              {scheduledOrder.endDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Окончание: {formatScheduleDate(new Date(scheduledOrder.endDate))}</span>
                </div>
              )}
            </div>

            {/* Последнее выполнение */}
            {scheduledOrder.lastCreatedAt && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  Последний заказ: {formatScheduleDate(new Date(scheduledOrder.lastCreatedAt))}
                </span>
              </div>
            )}

            {/* Создано */}
            <div className="text-xs text-gray-400 pt-2 border-t">
              Создано: {formatScheduleDate(new Date(scheduledOrder.createdAt))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
