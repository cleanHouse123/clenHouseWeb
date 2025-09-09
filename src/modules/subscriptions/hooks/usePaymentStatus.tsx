import { useState, useEffect } from 'react';
import { webSocketService } from '../services/websocket';

interface PaymentStatus {
    id: string;
    subscriptionId?: string;
    orderId?: string;
    amount: number;
    status: 'pending' | 'processing' | 'paid' | 'success' | 'failed' | 'refunded';
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
}

interface UsePaymentStatusProps {
    paymentId?: string;
    autoCheck?: boolean;
    intervalMs?: number;
}

export const usePaymentStatus = ({
    paymentId,
    autoCheck = true,
    intervalMs = 5000
}: UsePaymentStatusProps = {}) => {
    const [status, setStatus] = useState<PaymentStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Проверка статуса платежа
    const checkStatus = async () => {
        if (!paymentId) return;

        setLoading(true);
        setError(null);

        try {
            const paymentStatus = await webSocketService.getPaymentStatus(paymentId);
            setStatus(paymentStatus);
        } catch (err: any) {
            setError(err.message || 'Ошибка при проверке статуса платежа');
        } finally {
            setLoading(false);
        }
    };

    // Определение типа платежа
    const getPaymentType = async (): Promise<'subscription' | 'order' | null> => {
        if (!paymentId) return null;

        try {
            return await webSocketService.getPaymentTypeInfo(paymentId);
        } catch (err) {
            console.error('Ошибка определения типа платежа:', err);
            return null;
        }
    };

    // Автоматическая проверка статуса
    useEffect(() => {
        if (!paymentId || !autoCheck) return;

        // Проверяем статус сразу
        checkStatus();

        // Настраиваем периодическую проверку
        const interval = setInterval(checkStatus, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [paymentId, autoCheck, intervalMs]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (paymentId) {
                webSocketService.stopPaymentStatusCheck(paymentId);
            }
        };
    }, [paymentId]);

    return {
        status,
        loading,
        error,
        checkStatus,
        getPaymentType,
        isSuccess: status?.status === 'paid' || status?.status === 'success',
        isFailed: status?.status === 'failed',
        isPending: status?.status === 'pending',
        isProcessing: status?.status === 'processing',
    };
};
