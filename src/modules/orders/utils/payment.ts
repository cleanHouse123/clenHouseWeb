import { OrderResponseDto } from '../types';

/**
 * Заказ закрыт лимитом подписки: денег за него не брали.
 *
 * `price` при этом хранит обычную стоимость выноса — она нужна для расчёта
 * возврата по подписке (пункт 6.7 Оферты), поэтому не обнуляется. Показывать
 * её клиенту как стоимость заказа нельзя: он за этот вынос не платил.
 */
export const isPaidBySubscription = (
  order: Pick<OrderResponseDto, 'payments'>,
): boolean =>
  order.payments?.some((payment) => payment.method === 'subscription') ?? false;
