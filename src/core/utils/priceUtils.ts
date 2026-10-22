/**
 * Конвертирует цену из копеек в рубли и возвращает число
 * @param priceInKopecks - цена в копейках
 * @returns цена в рублях
 */
export const kopecksToRubles = (priceInKopecks: number): number => {
  return priceInKopecks / 100;
};

/**
 * Конвертирует цену из копеек в рубли и возвращает строку с символом рубля
 * @param priceInKopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns строка с ценой в рублях
 */
export const kopecksToRublesString = (
  priceInKopecks: number,
  showDecimals: boolean = false
): string => {
  const rubles = priceInKopecks / 100;

  if (showDecimals) {
    return `₽${rubles.toFixed(2)}`;
  }

  return `₽${Math.round(rubles)}`;
};

/**
 * Конвертирует цену из копеек в рубли и возвращает только число без символа валюты
 * @param priceInKopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns число в рублях
 */
export const kopecksToRublesNumber = (
  priceInKopecks: number,
  showDecimals: boolean = false
): number => {
  const rubles = priceInKopecks / 100;

  if (showDecimals) {
    return parseFloat(rubles.toFixed(2));
  }

  return Math.round(rubles);
};

/**
 * Форматирует цену для отображения в UI
 * @param priceInKopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns отформатированная строка с ценой
 */
export const formatPrice = (
  priceInKopecks: number,
  showDecimals: boolean = false
): string => {
  const rubles = priceInKopecks / 100;

  if (showDecimals) {
    return `${rubles.toFixed(2)}₽`;
  }

  return `${Math.round(rubles)}₽`;
};

/**
 * Форматирует сумму в копейках для показа клиенту.
 * Копейки выводятся только когда они есть: 15920 → «159,20 ₽», 19900 → «199 ₽».
 * Нужно там, где сумма может быть не целой в рублях — например после скидки по промокоду.
 */
export const formatKopecks = (priceInKopecks: number): string => {
  const rubles = priceInKopecks / 100;
  const hasKopecks = priceInKopecks % 100 !== 0;

  return `${rubles.toLocaleString('ru-RU', {
    minimumFractionDigits: hasKopecks ? 2 : 0,
    maximumFractionDigits: 2,
  })} ₽`;
};
