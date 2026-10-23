/**
 * Расписания живут по московскому времени: бэкенд так же считает дни недели
 * и время выноса. В России нет перехода на летнее время с 2014 года, поэтому
 * достаточно фиксированного сдвига.
 */
const MOSCOW_OFFSET_MINUTES = 180;

/** Время момента по Москве в формате "HH:mm" */
export const moscowTimeOf = (iso: string): string => {
    const shifted = new Date(new Date(iso).getTime() + MOSCOW_OFFSET_MINUTES * 60_000);
    const hours = String(shifted.getUTCHours()).padStart(2, '0');
    const minutes = String(shifted.getUTCMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};
