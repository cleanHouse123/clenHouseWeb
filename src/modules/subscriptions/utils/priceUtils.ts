/**
 * Конвертирует копейки в рубли для отображения на фронтенде
 * @param kopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns строка с ценой в рублях
 */
export const kopecksToRubles = (
  kopecks: number,
  showDecimals: boolean = false
): string => {
  const rubles = kopecks / 100;

  if (showDecimals) {
    return `${rubles.toFixed(2)}₽`;
  }

  return `${Math.round(rubles)}₽`;
};

/**
 * Конвертирует копейки в рубли и возвращает только число
 * @param kopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns число в рублях
 */
export const kopecksToRublesNumber = (
  kopecks: number,
  showDecimals: boolean = false
): number => {
  const rubles = kopecks / 100;

  if (showDecimals) {
    return parseFloat(rubles.toFixed(2));
  }

  return Math.round(rubles);
};
