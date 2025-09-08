import { useState, useEffect } from 'react';

interface PendingPaymentData {
    paymentUrl: string;
    paymentId: string;
    userId: string;
    timestamp: number;
}

export const usePendingPayment = () => {
    const [pendingPayment, setPendingPayment] = useState<PendingPaymentData | null>(null);

    // Загружаем сохраненный платеж при инициализации
    useEffect(() => {
        const savedPayment = localStorage.getItem('pending_payment');
        if (savedPayment) {
            try {
                const paymentData = JSON.parse(savedPayment);
                // Проверяем, что платеж не старше 24 часов
                const isExpired = Date.now() - paymentData.timestamp > 24 * 60 * 60 * 1000;
                if (!isExpired) {
                    setPendingPayment(paymentData);
                } else {
                    // Удаляем устаревший платеж
                    localStorage.removeItem('pending_payment');
                }
            } catch (error) {
                console.error('Ошибка при загрузке сохраненного платежа:', error);
                localStorage.removeItem('pending_payment');
            }
        }
    }, []);

    // Функция для очистки сохраненного платежа
    const clearPendingPayment = () => {
        localStorage.removeItem('pending_payment');
        setPendingPayment(null);
    };

    // Функция для проверки наличия активного платежа
    const hasPendingPayment = () => {
        return pendingPayment !== null;
    };

    return {
        pendingPayment,
        clearPendingPayment,
        hasPendingPayment
    };
};
