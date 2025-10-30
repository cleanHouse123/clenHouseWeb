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
  Copy as CopyIcon,
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
  // Удаляем дубли "..., N, д. N" из адреса, если встречаются
  const normalizedAddress = (() => {
    const raw = scheduledOrder.address || '';
    // Ищем шаблон в конце строки: ", д. <номер>"
    const dupMatch = raw.match(/,?\s*д\.\s*(\d+[A-Za-zА-Яа-я-\/]*)\s*$/);
    if (!dupMatch) return raw;
    const num = dupMatch[1];
    // Проверяем, что перед этим уже есть ", <тот же номер>" без префикса "д."
    const alreadyHasNumber = new RegExp(`,\\s*${num}(?:,|$)`).test(raw);
    if (alreadyHasNumber) {
      return raw.replace(/,?\s*д\.\s*\d+[A-Za-zА-Яа-я-\/]*\s*$/, '').trim();
    }
    return raw;
  })();
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

  const handleCopyAddress = async () => {
    try {
      const textToCopy = scheduledOrder.address || '';
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success('Адрес скопирован');
    } catch (_e) {
      toast.error('Не удалось скопировать адрес');
    }
  };

  return (
    <>
      <Card 
        radius="r16" 
        padding="md" 
        background="white" 
        bordered={true}
        shadow={true}
        className="w-full border border-gray-200"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="whitespace-normal break-words hyphens-auto select-none">{normalizedAddress}</span>
              </CardTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant={currentStatus.variant} className="text-xs">
                  {currentStatus.label}
                </Badge>
                <span className="text-sm text-gray-600">
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
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyAddress}>
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Скопировать адрес
                  </DropdownMenuItem>
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
                <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{scheduledOrder.description}</p>
              </div>
            )}

            {/* Заметки */}
            {scheduledOrder.notes && (
              <div className="flex items-start gap-2">
                <StickyNote className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{scheduledOrder.notes}</p>
              </div>
            )}

            {/* Даты */}
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Начало: {formatScheduleDate(scheduledOrder.startDate)}</span>
              </div>
              {scheduledOrder.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Окончание: {formatScheduleDate(scheduledOrder.endDate)}</span>
                </div>
              )}
            </div>

            {/* Последнее выполнение */}
            {scheduledOrder.lastCreatedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  Последний заказ: {formatScheduleDate(scheduledOrder.lastCreatedAt)}
                </span>
              </div>
            )}

            {/* Создано */}
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
              Создано: {formatScheduleDate(scheduledOrder.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
