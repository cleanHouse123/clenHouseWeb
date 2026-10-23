import { Repeat } from 'lucide-react';
import { OrderRepeat } from '../types';

const FREQUENCIES: Array<{ value: OrderRepeat['frequency']; label: string }> = [
    { value: 'daily', label: 'Каждый день' },
    { value: 'every_other_day', label: 'Через день' },
    { value: 'weekly', label: 'Раз в неделю' },
    { value: 'custom', label: 'Свои дни' },
];

/** Понедельник первым: воскресенье в русском календаре последнее */
const WEEKDAYS = [
    { value: 1, short: 'Пн' },
    { value: 2, short: 'Вт' },
    { value: 3, short: 'Ср' },
    { value: 4, short: 'Чт' },
    { value: 5, short: 'Пт' },
    { value: 6, short: 'Сб' },
    { value: 0, short: 'Вс' },
];

const FREQUENCY_SUMMARY: Record<OrderRepeat['frequency'], string> = {
    daily: 'каждый день',
    every_other_day: 'через день',
    weekly: 'раз в неделю',
    custom: '',
};

const DAY_NAMES: Record<number, string> = {
    1: 'понедельникам',
    2: 'вторникам',
    3: 'средам',
    4: 'четвергам',
    5: 'пятницам',
    6: 'субботам',
    0: 'воскресеньям',
};

interface RepeatPickupFieldProps {
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
    value: OrderRepeat;
    onChange: (value: OrderRepeat) => void;
    /** Время выноса из заказа, "HH:mm" — расписание наследует его */
    pickupTime?: string;
    /** Сколько выносов осталось по подписке, null — безлимит */
    remainingOrders: number | null;
}

/**
 * Повтор выноса прямо в оформлении заказа. Адрес, детали и время берутся
 * из заказа, поэтому здесь остаётся только частота — заводить расписание
 * отдельной формой на четырнадцать полей не нужно.
 */
export const RepeatPickupField = ({
    enabled,
    onEnabledChange,
    value,
    onChange,
    pickupTime,
    remainingOrders,
}: RepeatPickupFieldProps) => {
    const canRepeat = Boolean(pickupTime);

    const toggleDay = (day: number) => {
        const days = value.daysOfWeek ?? [];
        const next = days.includes(day)
            ? days.filter((item) => item !== day)
            : [...days, day];

        onChange({ ...value, daysOfWeek: next });
    };

    const selectedDays = value.daysOfWeek ?? [];
    const daysSummary = WEEKDAYS.filter((day) => selectedDays.includes(day.value))
        .map((day) => DAY_NAMES[day.value])
        .join(', ');

    const summary =
        value.frequency === 'custom'
            ? daysSummary
                ? `по ${daysSummary}`
                : 'выберите дни недели'
            : FREQUENCY_SUMMARY[value.frequency];

    return (
        <div className="rounded-[12px] border border-gray-200 bg-white p-4">
            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={enabled}
                    disabled={!canRepeat}
                    onChange={(event) => onEnabledChange(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-orange-500 disabled:opacity-40"
                />
                <span>
                    <span className="block text-[15px] font-medium text-gray-900">
                        Повторять этот вынос
                    </span>
                    <span className="block text-[13px] text-gray-500">
                        {canRepeat
                            ? 'Адрес и время возьмём из этого заказа'
                            : 'Сначала выберите дату и время выноса'}
                    </span>
                </span>
            </label>

            {enabled && canRepeat && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="mb-2 text-[13px] text-gray-500">Как часто</p>
                    <div className="grid grid-cols-2 gap-2">
                        {FREQUENCIES.map((frequency) => {
                            const isSelected = value.frequency === frequency.value;

                            return (
                                <button
                                    key={frequency.value}
                                    type="button"
                                    onClick={() =>
                                        onChange({ ...value, frequency: frequency.value })
                                    }
                                    className={`rounded-[8px] border px-3 py-2.5 text-left text-sm transition-colors ${isSelected
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {frequency.label}
                                </button>
                            );
                        })}
                    </div>

                    {value.frequency === 'custom' && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {WEEKDAYS.map((day) => {
                                const isSelected = selectedDays.includes(day.value);

                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={`rounded-[8px] border px-3 py-1.5 text-sm transition-colors ${isSelected
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                            }`}
                                    >
                                        {day.short}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <p className="mt-3.5 flex items-start gap-2 text-[13px] text-gray-500">
                        <Repeat className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>
                            Дальше — {summary} в {pickupTime}
                        </span>
                    </p>

                    {remainingOrders !== null && (
                        <p className="mt-2 text-[13px] text-gray-500">
                            Списывается с лимита подписки. Осталось {remainingOrders}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
