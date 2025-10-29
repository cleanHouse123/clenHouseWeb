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
 * Корректно конвертирует локальное время в UTC с учетом таймзоны
 */
export const createUTCDate = (localDate: Date = new Date()): string => {
  // toISOString() автоматически конвертирует локальное время в UTC
  return localDate.toISOString();
};

/**
 * Создает UTC дату с добавлением указанного количества месяцев
 */
export const createUTCDateWithMonths = (
  months: number,
  fromDate: Date = new Date()
): string => {
  const futureDate = new Date(fromDate);
  futureDate.setMonth(futureDate.getMonth() + months);
  return createUTCDate(futureDate);
};

/**
 * Создает UTC дату с добавлением указанного количества лет
 */
export const createUTCDateWithYears = (
  years: number,
  fromDate: Date = new Date()
): string => {
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
  return !isNaN(date.getTime()) && dateString.includes("T");
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

  if (typeof date === "string") {
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

  if (typeof date === "string") {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();
  }

  if (date instanceof Date) {
    return isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  }

  return new Date().toISOString();
};

/**
 * Создает UTC дату только с датой (без времени) из локальной даты
 * Используется для дат расписания, где важен только день
 * Создает начало дня в локальной таймзоне, конвертированное в UTC
 */
export const createUTCDateOnly = (localDate: Date): string => {
  // Создаем дату с началом дня в локальной таймзоне (00:00:00)
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();
  const localMidnight = new Date(year, month, day, 0, 0, 0, 0);

  // Конвертируем локальное начало дня в UTC
  return localMidnight.toISOString();
};

/**
 * Создает локальную дату только с датой (без времени) из UTC строки
 * Используется для отображения дат расписания в формах
 */
export const createLocalDateOnly = (utcDateString: string): Date => {
  try {
    const utcDate = new Date(utcDateString);

    if (isNaN(utcDate.getTime())) {
      console.warn("Invalid date string:", utcDateString);
      return new Date();
    }

    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const day = utcDate.getUTCDate();
    return new Date(year, month, day, 0, 0, 0, 0);
  } catch (error) {
    console.error("Error parsing date:", utcDateString, error);
    return new Date();
  }
};

/**
 * Конвертирует локальное время в UTC для отправки на бэкенд
 */
export const convertLocalTimeToUTC = (localTimeString: string): string => {
  if (!localTimeString) return "";

  try {
    const [hours, minutes] = localTimeString.split(":");
    const localDate = new Date();
    localDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const utcHours = localDate.getUTCHours();
    const utcMinutes = localDate.getUTCMinutes();

    return `${utcHours.toString().padStart(2, "0")}:${utcMinutes
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error(
      "Error converting local time to UTC:",
      localTimeString,
      error
    );
    return "";
  }
};

/**
 * Конвертирует UTC время в локальное для отображения в форме
 */
export const convertUTCTimeToLocal = (utcTimeString: string): string => {
  if (!utcTimeString) return "";

  try {
    const [hours, minutes] = utcTimeString.split(":");
    const utcDate = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        parseInt(hours),
        parseInt(minutes)
      )
    );

    const localHours = utcDate.getHours();
    const localMinutes = utcDate.getMinutes();

    return `${localHours.toString().padStart(2, "0")}:${localMinutes
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Error converting UTC time to local:", utcTimeString, error);
    return "";
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
export const formatDateTime = (
  date: Date | string | null | undefined,
  locale: Locale = "ru"
) => {
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
export const formatDateShort = (
  date: Date | string | null | undefined,
  locale: Locale = "ru"
) => {
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
export const formatDateOnly = (
  date: Date | string | null | undefined,
  locale: Locale = "ru"
) => {
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
 * Конвертирует UTC время в локальное для отображения пользователю
 */
export const formatDateTimeLocal = (
  dateString: string,
  locale: Locale = "ru"
) => {
  try {
    if (!isValidUTCDate(dateString)) {
      return locale === "ru" ? "Неверная дата" : "Invalid date";
    }

    // Парсим UTC дату - Date объект автоматически конвертирует UTC в локальное время
    const date = new Date(dateString);

    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    // toLocaleString автоматически использует локальное время из Date объекта
    return date.toLocaleString(localeString, {
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
export const isExpiringSoon = (
  dateString: string,
  daysThreshold: number = 3
): boolean => {
  const daysLeft = getDaysUntil(dateString);
  return daysLeft <= daysThreshold && daysLeft > 0;
};

/**
 * Форматирует UTC дату для использования в input[type="datetime-local"]
 * Конвертирует UTC время в локальное для отображения в форме
 * Возвращает дату в формате YYYY-MM-DDTHH:MM без Z (локальное время)
 */
export const formatForDateTimeInput = (dateString: string): string => {
  try {
    if (!isValidUTCDate(dateString)) {
      return "";
    }

    // Парсим UTC дату
    const utcDate = new Date(dateString);

    // Конвертируем UTC компоненты в локальное время для отображения
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, "0");
    const day = String(utcDate.getDate()).padStart(2, "0");
    const hours = String(utcDate.getHours()).padStart(2, "0");
    const minutes = String(utcDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    return "";
  }
};

/**
 * Создает UTC дату из input[type="datetime-local"] значения
 * Корректно обрабатывает локальное время пользователя и конвертирует в UTC
 *
 * @param dateTimeInput - строка в формате "YYYY-MM-DDTHH:MM" или "YYYY-MM-DD" или "HH:MM"
 * @returns ISO строка в UTC формате (с окончанием Z)
 */
export const createUTCFromDateTimeInput = (dateTimeInput: string): string => {
  try {
    if (!dateTimeInput) {
      return createUTCDate();
    }

    // Создаем Date объект из строки
    // ВАЖНО: когда строка без Z, JavaScript интерпретирует её как локальное время
    let localDate: Date;

    if (dateTimeInput.includes("T") && dateTimeInput.includes(":")) {
      // Формат: "2024-01-15T14:00" - полная дата и время (локальное)
      localDate = new Date(dateTimeInput);
    } else if (dateTimeInput.includes(":")) {
      // Формат: "14:00" - только время, используем сегодняшнюю дату
      const [hours, minutes] = dateTimeInput.split(":");
      const today = new Date();
      localDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours, 10),
        parseInt(minutes, 10),
        0,
        0
      );
    } else {
      // Только дата: "2024-01-15" - используем начало дня
      localDate = new Date(dateTimeInput + "T00:00:00");
    }

    // Проверяем валидность
    if (isNaN(localDate.getTime())) {
      console.warn("Invalid date input:", dateTimeInput);
      return createUTCDate();
    }

    // Конвертируем локальное время в UTC
    // toISOString() автоматически конвертирует timestamp (который хранится в UTC) в ISO строку UTC
    return localDate.toISOString();
  } catch (error) {
    console.error(
      "Error converting local datetime to UTC:",
      dateTimeInput,
      error
    );
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

export const formatTimeRange = (scheduledAt: string) => {
  // Парсим UTC дату - Date объект автоматически конвертирует в локальное время
  const date = new Date(scheduledAt);
  // Используем локальные методы для отображения времени в таймзоне пользователя
  const startHour = date.getHours();
  const startMinute = date.getMinutes();

  // Вычисляем время окончания (начало + 20 минут)
  let endMinute = startMinute + 20;
  let endHour = startHour;
  // Обрабатываем переполнение минут
  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  return `${formatTime(startHour, startMinute)}-${formatTime(
    endHour,
    endMinute
  )}`;
};
