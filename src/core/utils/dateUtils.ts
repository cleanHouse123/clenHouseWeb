import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Locale } from "../feauture/locale/locale-context";

const localeMap = {
  ru,
  en: enUS,
};

/**
 * Утилиты для работы с датами в UTC формате
 * Все функции корректно обрабатывают UTC даты от бэкенда
 */

/**
 * Создает UTC дату из локального времени браузера
 * Используется для отправки дат на бэкенд
 */
export const createUTCDate = (localDate: Date = new Date()): string => {
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
};

/**
 * Создает UTC дату с добавлением указанного количества месяцев
 */
export const createUTCDateWithMonths = (months: number, fromDate: Date = new Date()): string => {
  const futureDate = new Date(fromDate);
  futureDate.setMonth(futureDate.getMonth() + months);
  return createUTCDate(futureDate);
};

/**
 * Создает UTC дату с добавлением указанного количества лет
 */
export const createUTCDateWithYears = (years: number, fromDate: Date = new Date()): string => {
  const futureDate = new Date(fromDate);
  futureDate.setFullYear(futureDate.getFullYear() + years);
  return createUTCDate(futureDate);
};

/**
 * Проверяет, является ли строка валидной UTC датой
 */
export const isValidUTCDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes('T');
};

/**
 * Универсальная функция для безопасного преобразования даты в Date объект
 * Поддерживает строки, Date объекты и null/undefined
 */
export const toDate = (date: Date | string | null | undefined): Date => {
  if (!date) return new Date();
  
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? new Date() : date;
  }
  
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  
  return new Date();
};

/**
 * Универсальная функция для безопасного преобразования даты в ISO строку
 * Поддерживает строки, Date объекты и null/undefined
 */
export const toISOString = (date: Date | string | null | undefined): string => {
  if (!date) return new Date().toISOString();
  
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
  }
  
  if (date instanceof Date) {
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }
  
  return new Date().toISOString();
};

/**
 * Создает UTC дату только с датой (без времени) из локальной даты
 * Используется для дат расписания, где важен только день
 */
export const createUTCDateOnly = (localDate: Date): string => {
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();
  const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  return utcDate.toISOString();
};

/**
 * Создает локальную дату только с датой (без времени) из UTC строки
 * Используется для отображения дат расписания в формах
 */
export const createLocalDateOnly = (utcDateString: string): Date => {
  try {
    const utcDate = new Date(utcDateString);
    
    if (isNaN(utcDate.getTime())) {
      console.warn('Invalid date string:', utcDateString);
      return new Date();
    }
    
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const day = utcDate.getUTCDate();
    return new Date(year, month, day, 0, 0, 0, 0);
  } catch (error) {
    console.error('Error parsing date:', utcDateString, error);
    return new Date();
  }
};

/**
 * Конвертирует локальное время в UTC для отправки на бэкенд
 */
export const convertLocalTimeToUTC = (localTimeString: string): string => {
  if (!localTimeString) return '';
  
  try {
    const [hours, minutes] = localTimeString.split(':');
    const localDate = new Date();
    localDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const utcHours = localDate.getUTCHours();
    const utcMinutes = localDate.getUTCMinutes();
    
    return `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting local time to UTC:', localTimeString, error);
    return '';
  }
};

/**
 * Конвертирует UTC время в локальное для отображения в форме
 */
export const convertUTCTimeToLocal = (utcTimeString: string): string => {
  if (!utcTimeString) return '';
  
  try {
    const [hours, minutes] = utcTimeString.split(':');
    const utcDate = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      parseInt(hours),
      parseInt(minutes)
    ));
    
    const localHours = utcDate.getHours();
    const localMinutes = utcDate.getMinutes();
    
    return `${localHours.toString().padStart(2, '0')}:${localMinutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting UTC time to local:', utcTimeString, error);
    return '';
  }
};

/**
 * Форматирует UTC дату в относительное время (например, "2 дня назад")
 * Поддерживает строки, Date объекты и null/undefined
 */
export const formatDateRelative = (
  date: Date | string | null | undefined,
  locale: Locale = "ru"
) => {
  try {
    const dateObj = toDate(date);
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: localeMap[locale],
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

/**
 * Форматирует UTC дату в полный формат с временем (локальное отображение)
 * Поддерживает строки, Date объекты и null/undefined
 */
export const formatDateTime = (date: Date | string | null | undefined, locale: Locale = "ru") => {
  try {
    const dateObj = toDate(date);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return dateObj.toLocaleString(localeString, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

/**
 * Форматирует UTC дату в короткий формат с временем
 * Поддерживает строки, Date объекты и null/undefined
 */
export const formatDateShort = (date: Date | string | null | undefined, locale: Locale = "ru") => {
  try {
    const dateObj = toDate(date);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return dateObj.toLocaleDateString(localeString, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

/**
 * Форматирует UTC дату в числовой формат
 * Поддерживает строки, Date объекты и null/undefined
 */
export const formatDateNumeric = (
  date: Date | string | null | undefined,
  locale: Locale = "ru"
) => {
  try {
    const dateObj = toDate(date);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return dateObj.toLocaleDateString(localeString, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

/**
 * Форматирует UTC дату только в дату без времени (локальное отображение)
 * Поддерживает строки, Date объекты и null/undefined
 */
export const formatDateOnly = (date: Date | string | null | undefined, locale: Locale = "ru") => {
  try {
    const dateObj = toDate(date);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return dateObj.toLocaleDateString(localeString, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

/**
 * Форматирует UTC дату с корректной обработкой часового пояса
 * Извлекает UTC компоненты и создает локальную дату для отображения
 */
export const formatDateTimeLocal = (
  dateString: string,
  locale: Locale = "ru"
) => {
  try {
    if (!isValidUTCDate(dateString)) {
      return locale === "ru" ? "Неверная дата" : "Invalid date";
    }

    // Парсим дату и извлекаем компоненты без конвертации часового пояса
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return new Date(year, month, day, hours, minutes).toLocaleString(
      localeString,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

/**
 * Вычисляет количество дней между текущей датой и указанной UTC датой
 */
export const getDaysUntil = (dateString: string): number => {
  try {
    if (!isValidUTCDate(dateString)) {
      return 0;
    }

    const targetDate = new Date(dateString);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    return 0;
  }
};

/**
 * Проверяет, истекает ли подписка в ближайшие дни
 */
export const isExpiringSoon = (dateString: string, daysThreshold: number = 3): boolean => {
  const daysLeft = getDaysUntil(dateString);
  return daysLeft <= daysThreshold && daysLeft > 0;
};

/**
 * Форматирует UTC дату для использования в input[type="datetime-local"]
 * Возвращает дату в формате YYYY-MM-DDTHH:MM без Z
 */
export const formatForDateTimeInput = (dateString: string): string => {
  try {
    if (!isValidUTCDate(dateString)) {
      return '';
    }

    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    return '';
  }
};

/**
 * Создает UTC дату из input[type="datetime-local"] значения
 */
export const createUTCFromDateTimeInput = (dateTimeInput: string): string => {
  try {
    if (!dateTimeInput) {
      return createUTCDate();
    }

    // Добавляем секунды и миллисекунды, если их нет
    const normalizedInput = dateTimeInput.includes(':') 
      ? `${dateTimeInput}:00.000Z`
      : `${dateTimeInput}T00:00:00.000Z`;

    return normalizedInput;
  } catch (error) {
    return createUTCDate();
  }
};

// Deprecated functions - оставляем для обратной совместимости
/**
 * @deprecated Используйте formatDateOnly вместо этой функции
 */
export const formatDateRelativeLocal = (
  dateString: string,
  locale: Locale = "ru"
) => {
  return formatDateOnly(dateString, locale);
};
