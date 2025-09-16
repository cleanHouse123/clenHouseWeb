import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Locale } from "../feauture/locale/locale-context";

const localeMap = {
  ru,
  en: enUS,
};

export const formatDateRelative = (
  dateString: string,
  locale: Locale = "ru"
) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: localeMap[locale],
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

export const formatDateTime = (dateString: string, locale: Locale = "ru") => {
  try {
    const date = new Date(dateString);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

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

export const formatDateShort = (dateString: string, locale: Locale = "ru") => {
  try {
    const date = new Date(dateString);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return date.toLocaleDateString(localeString, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return locale === "ru" ? "Неверная дата" : "Invalid date";
  }
};

export const formatDateNumeric = (
  dateString: string,
  locale: Locale = "ru"
) => {
  try {
    const date = new Date(dateString);
    const localeString = locale === "ru" ? "ru-RU" : "en-US";

    return date.toLocaleDateString(localeString, {
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

export const formatDateTimeLocal = (
  dateString: string,
  locale: Locale = "ru"
) => {
  try {
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

export const formatDateRelativeLocal = (
  dateString: string,
  locale: Locale = "ru"
) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
