/**
 * За сколько часов до выноса отмена ещё возвращает вынос в подписку.
 * Должно совпадать с SUBSCRIPTION_PICKUP_RETURN_HOURS на бэкенде —
 * решение принимает он, здесь мы только предупреждаем заранее.
 */
export const PICKUP_RETURN_HOURS = 3;

const HOUR = 60 * 60 * 1000;

/** Вернётся ли вынос в подписку, если отменить заказ прямо сейчас */
export const willReturnPickup = (
    scheduledAt: string | undefined,
    now: Date = new Date(),
): boolean => {
    if (!scheduledAt) {
        return true;
    }

    return now.getTime() <= new Date(scheduledAt).getTime() - PICKUP_RETURN_HOURS * HOUR;
};
