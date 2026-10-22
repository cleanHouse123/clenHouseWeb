import { useCallback, useState } from "react";
import { couponApi, CouponPreview, ValidateCouponParams } from "../api";

const getErrorMessage = (error: unknown): string => {
    const response = (error as { response?: { data?: { message?: unknown } } })
        ?.response;
    const message = response?.data?.message;

    if (typeof message === "string") return message;
    if (Array.isArray(message) && typeof message[0] === "string") {
        return message[0];
    }
    return "Не удалось проверить промокод";
};

interface UseCouponPreviewReturn {
    /** Применённый промокод, уходит вместе с заказом или оплатой подписки */
    appliedCode: string | null;
    preview: CouponPreview | null;
    error: string | null;
    isChecking: boolean;
    apply: (code: string) => Promise<boolean>;
    reset: () => void;
}

/**
 * Проверяет промокод на бэкенде и хранит применённый код.
 * Цена пересчитывается там же, поэтому клиент показывает ровно то,
 * что спишется при оплате.
 */
export const useCouponPreview = (
    params: Omit<ValidateCouponParams, "code">
): UseCouponPreviewReturn => {
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [preview, setPreview] = useState<CouponPreview | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const reset = useCallback(() => {
        setAppliedCode(null);
        setPreview(null);
        setError(null);
    }, []);

    const apply = useCallback(
        async (code: string): Promise<boolean> => {
            const trimmed = code.trim();
            if (!trimmed) {
                setError("Введите промокод");
                return false;
            }

            setIsChecking(true);
            setError(null);
            try {
                const result = await couponApi.validate({
                    ...params,
                    code: trimmed,
                });
                setPreview(result);
                setAppliedCode(trimmed);
                return true;
            } catch (err) {
                setPreview(null);
                setAppliedCode(null);
                setError(getErrorMessage(err));
                return false;
            } finally {
                setIsChecking(false);
            }
        },
        [params]
    );

    return { appliedCode, preview, error, isChecking, apply, reset };
};
