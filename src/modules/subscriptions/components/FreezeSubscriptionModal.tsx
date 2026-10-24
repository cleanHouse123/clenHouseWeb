import { useState } from 'react';
import { PauseCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button/button';

/** Предел из пункта 6.4 Оферты */
const MAX_FREEZE_DAYS = 14;

interface FreezeSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (days: number) => void;
    /** Сколько дней паузы уже израсходовано за период */
    freezeDaysUsed?: number;
    isPending?: boolean;
}

/**
 * Приостановка подписки. Срок выбирается сразу, подписка оживает сама —
 * так нельзя забыть разморозить и незаметно потратить все 14 дней.
 */
export const FreezeSubscriptionModal = ({
    isOpen,
    onClose,
    onConfirm,
    freezeDaysUsed = 0,
    isPending = false,
}: FreezeSubscriptionModalProps) => {
    const remaining = MAX_FREEZE_DAYS - freezeDaysUsed;
    const [days, setDays] = useState(Math.min(7, remaining));

    const options = [3, 7, 14].filter((value) => value <= remaining);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <PauseCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <span>Приостановить подписку</span>
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-700 mt-2">
                        Выносы на это время не списываются, а срок подписки продлевается
                        ровно на столько же.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">На сколько дней</p>
                        <div className="flex gap-2">
                            {options.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setDays(value)}
                                    className={`flex-1 rounded-[12px] border px-3 py-2.5 text-sm transition-colors ${days === value
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        {remaining === MAX_FREEZE_DAYS
                            ? `Всего за период можно приостановить на ${MAX_FREEZE_DAYS} дней`
                            : `Осталось дней паузы за этот период: ${remaining}`}
                    </p>

                    <p className="text-xs text-gray-500">
                        Оформить паузу нужно не позднее чем за 2 дня до ближайшего выноса.
                    </p>

                    <div className="flex gap-3 justify-end pt-1">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            Отмена
                        </Button>
                        <Button
                            onClick={() => onConfirm(days)}
                            disabled={isPending || remaining <= 0}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            Приостановить на {days} дн.
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
