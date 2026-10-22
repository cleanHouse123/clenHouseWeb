import { useState } from "react";
import { Check, Tag, X } from "lucide-react";
import { Button } from "@/core/components/ui/button/button";
import { Input } from "@/core/components/ui/inputs/input";
import { cn } from "@/core/lib/utils";
import { kopecksToRublesNumber } from "@/core/utils/priceUtils";
import type { CouponPreview } from "../api";

const formatRubles = (kopecks: number): string =>
    `${kopecksToRublesNumber(kopecks).toLocaleString("ru-RU")} ₽`;

interface CouponFieldProps {
    appliedCode: string | null;
    /** Чем заменить строку со скидкой, если применённых цен несколько */
    summary?: React.ReactNode;
    preview: CouponPreview | null;
    error: string | null;
    isChecking: boolean;
    onApply: (code: string) => void;
    onReset: () => void;
    className?: string;
}

/**
 * Поле ввода промокода. Пока код не применён — свёрнуто в ссылку,
 * чтобы не отвлекать тех, у кого промокода нет.
 */
export const CouponField = ({
    appliedCode,
    summary,
    preview,
    error,
    isChecking,
    onApply,
    onReset,
    className,
}: CouponFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [code, setCode] = useState("");

    const handleReset = () => {
        setCode("");
        onReset();
    };

    // Промокод вытесняет автоскидку «первый заказ за 1 ₽»: бывает невыгоден
    const isWorseThanAutoDiscount =
        preview !== null && preview.priceWithoutCoupon < preview.finalAmount;

    if (appliedCode && (preview || summary)) {
        return (
            <div className={cn("space-y-1.5", className)}>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <p className="flex min-w-0 items-center gap-2 text-sm text-green-800">
                        <Check className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {summary ?? (
                                <>
                                    Промокод {appliedCode} применён, −
                                    {formatRubles(preview!.discountAmount)}
                                </>
                            )}
                        </span>
                    </p>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="shrink-0 text-xs text-green-800 underline underline-offset-2"
                    >
                        Убрать
                    </button>
                </div>

                {preview && isWorseThanAutoDiscount && (
                    <p className="text-xs text-orange-700">
                        Без промокода этот заказ стоит{" "}
                        {formatRubles(preview!.priceWithoutCoupon)} — скидка на первый
                        заказ выгоднее.
                    </p>
                )}
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex items-center gap-1.5 text-sm text-primary underline underline-offset-2",
                    className
                )}
            >
                <Tag className="h-4 w-4" />
                У меня есть промокод
            </button>
        );
    }

    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex items-center gap-2">
                <Input
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    placeholder="Промокод"
                    autoComplete="off"
                    className="h-10"
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            onApply(code);
                        }
                    }}
                />
                <Button
                    type="button"
                    variant="outline"
                    className="h-10 shrink-0"
                    disabled={isChecking || !code.trim()}
                    onClick={() => onApply(code)}
                >
                    {isChecking ? "Проверяем..." : "Применить"}
                </Button>
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        handleReset();
                    }}
                    className="shrink-0 text-muted-foreground"
                    aria-label="Закрыть поле промокода"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
};
