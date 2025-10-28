import { ScheduleFrequency, FrequencyOption, DayOfWeekOption } from '../types';
import { formatDateOnly, toDate, convertUTCTimeToLocal } from '@/core/utils/dateUtils';

// Опции частоты
export const frequencyOptions: FrequencyOption[] = [
  {
    value: ScheduleFrequency.DAILY,
    label: 'Ежедневно',
    description: 'Каждый день',
  },
  // {
  //   value: ScheduleFrequency.EVERY_OTHER_DAY,
  //   label: 'Через день',
  //   description: 'Каждый второй день',
  // },
  {
    value: ScheduleFrequency.WEEKLY,
    label: 'Еженедельно',
    description: 'Один раз в неделю',
  },
  // {
  //   value: ScheduleFrequency.CUSTOM,
  //   label: 'Настраиваемое',
  //   description: 'Выберите дни недели',
  // },
];

// Опции дней недели
export const dayOfWeekOptions: DayOfWeekOption[] = [
  { value: 0, label: 'Воскресенье', shortLabel: 'Вс' },
  { value: 1, label: 'Понедельник', shortLabel: 'Пн' },
  { value: 2, label: 'Вторник', shortLabel: 'Вт' },
  { value: 3, label: 'Среда', shortLabel: 'Ср' },
  { value: 4, label: 'Четверг', shortLabel: 'Чт' },
  { value: 5, label: 'Пятница', shortLabel: 'Пт' },
  { value: 6, label: 'Суббота', shortLabel: 'Сб' },
];

// Получить опцию частоты по значению
export const getFrequencyOption = (frequency: ScheduleFrequency): FrequencyOption => {
  return frequencyOptions.find(option => option.value === frequency) || frequencyOptions[0];
};

// Получить опцию дня недели по значению
export const getDayOfWeekOption = (dayValue: number): DayOfWeekOption => {
  return dayOfWeekOptions.find(option => option.value === dayValue) || dayOfWeekOptions[0];
};

// Получить названия дней недели по массиву значений
export const getDaysOfWeekLabels = (daysOfWeek: number[]): string[] => {
  return daysOfWeek.map(day => getDayOfWeekOption(day).shortLabel);
};

// Форматировать расписание для отображения
export const formatScheduleDescription = (
  frequency: ScheduleFrequency,
  daysOfWeek?: number[],
  preferredTime?: string
): string => {
  const frequencyOption = getFrequencyOption(frequency);
  let description = frequencyOption.label;

  if (frequency === ScheduleFrequency.CUSTOM && daysOfWeek && daysOfWeek.length > 0) {
    const dayLabels = getDaysOfWeekLabels(daysOfWeek);
    description = `По дням: ${dayLabels.join(', ')}`;
  }

  if (preferredTime) {
    const localTime = convertUTCTimeToLocal(preferredTime);
    description += ` в ${localTime}`;
  }

  return description;
};

// Проверить, нужны ли дни недели для выбранной частоты
export const needsDaysOfWeek = (frequency: ScheduleFrequency): boolean => {
  return frequency === ScheduleFrequency.CUSTOM;
};

// Проверить, нужен ли выбор времени для выбранной частоты
export const needsPreferredTime = (frequency: ScheduleFrequency): boolean => {
  return frequency !== ScheduleFrequency.CUSTOM;
};

// Получить следующую дату выполнения на основе расписания
export const getNextExecutionDate = (
  frequency: ScheduleFrequency,
  startDate: Date | string,
  daysOfWeek?: number[],
  lastCreatedAt?: Date | string
): Date => {
  const now = new Date();
  const baseDate = lastCreatedAt ? toDate(lastCreatedAt) : toDate(startDate);

  switch (frequency) {
    case ScheduleFrequency.DAILY:
      const nextDay = new Date(baseDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;

    case ScheduleFrequency.EVERY_OTHER_DAY:
      const nextOtherDay = new Date(baseDate);
      nextOtherDay.setDate(nextOtherDay.getDate() + 2);
      return nextOtherDay;

    case ScheduleFrequency.WEEKLY:
      const nextWeek = new Date(baseDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;

    case ScheduleFrequency.CUSTOM:
      if (!daysOfWeek || daysOfWeek.length === 0) {
        return now;
      }

      // Найти следующий день из выбранных дней недели
      const currentDay = now.getDay();
      const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
      
      // Ищем следующий день в текущей неделе
      for (const day of sortedDays) {
        if (day > currentDay) {
          const nextDate = new Date(now);
          nextDate.setDate(now.getDate() + (day - currentDay));
          return nextDate;
        }
      }

      // Если не нашли в текущей неделе, берем первый день следующей недели
      const firstDayNextWeek = new Date(now);
      firstDayNextWeek.setDate(now.getDate() + (7 - currentDay + sortedDays[0]));
      return firstDayNextWeek;

    default:
      return now;
  }
};

// Проверить, активно ли расписание
export const isScheduleActive = (
  scheduledOrder: {
    isActive: boolean;
    startDate: Date | string;
    endDate?: Date | string;
  }
): boolean => {
  const now = new Date();
  
  if (!scheduledOrder.isActive) {
    return false;
  }

  const startDate = toDate(scheduledOrder.startDate);
  if (now < startDate) {
    return false;
  }

  if (scheduledOrder.endDate) {
    const endDate = toDate(scheduledOrder.endDate);
    if (now > endDate) {
      return false;
    }
  }

  return true;
};

// Получить статус расписания
export const getScheduleStatus = (
  scheduledOrder: {
    isActive: boolean;
    startDate: Date | string;
    endDate?: Date | string;
  }
): 'active' | 'inactive' | 'pending' | 'expired' => {
  const now = new Date();

  if (!scheduledOrder.isActive) {
    return 'inactive';
  }

  const startDate = toDate(scheduledOrder.startDate);
  if (now < startDate) {
    return 'pending';
  }

  if (scheduledOrder.endDate) {
    const endDate = toDate(scheduledOrder.endDate);
    if (now > endDate) {
      return 'expired';
    }
  }

  return 'active';
};

// Форматировать дату расписания для отображения
export const formatScheduleDate = (utcDate: string | Date): string => {
  return formatDateOnly(utcDate, 'ru');
};

// Форматировать время расписания для отображения
export const formatScheduleTime = (utcTimeString: string): string => {
  return convertUTCTimeToLocal(utcTimeString);
};
