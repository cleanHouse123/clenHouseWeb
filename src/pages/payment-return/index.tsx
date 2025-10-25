import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { toast } from 'sonner';
import { axiosInstance } from '@/core/config/axios';

type PaymentStatus = 'processing' | 'success' | 'error';

export const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PaymentStatus>('processing');
    const [error, setError] = useState<string | null>(null);

    const paymentId = searchParams.get('paymentId');
    const paymentType = searchParams.get('type') || sessionStorage.getItem('paymentType') || 'order';
    const returnUrl = sessionStorage.getItem('returnUrl') || (paymentType === 'subscription' ? '/subscriptions' : '/orders');

    useEffect(() => {
        if (!paymentId) {
            setStatus('error');
            setError('Payment ID не найден');
            return;
        }

        // Очищаем sessionStorage при загрузке страницы
        sessionStorage.removeItem('pendingPaymentId');
        sessionStorage.removeItem('returnUrl');

        // Проверяем статус платежа каждые 2 секунды
        const checkPaymentStatus = async () => {
            try {
                const response = await axiosInstance.get(`/payment-status/${paymentId}`);
                const payment = response.data;

                // Проверяем успешные статусы
                if (payment.status === 'paid' || payment.status === 'success') {
                    setStatus('success');

                    const isSubscription = paymentType === 'subscription';

                    // Показываем уведомление об успешной оплате
                    toast.success(
                        isSubscription ? 'Подписка успешно оплачена!' : 'Заказ успешно оплачен!',
                        {
                            description: isSubscription ? 'Ваша подписка активирована' : 'Ваш заказ принят в обработку',
                            duration: 5000,
                        }
                    );

                    // Перенаправляем на соответствующую страницу через 3 секунды
                    setTimeout(() => {
                        navigate(returnUrl);
                    }, 3000);
                } else if (payment.status === 'failed' || payment.status === 'canceled') {
                    // Ошибка платежа
                    setStatus('error');
                    setError('Платеж не был завершен');
                }
            } catch (error: any) {
                console.error('Ошибка проверки статуса платежа:', error);
                // Не выставляем ошибку сразу, продолжаем проверку
            }
        };

        // Проверяем сразу
        checkPaymentStatus();

        // Проверяем каждые 2 секунды, пока не получим финальный статус
        const interval = setInterval(checkPaymentStatus, 2000);

        return () => clearInterval(interval);
    }, [paymentId, paymentType, navigate, returnUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === 'processing' && (
                    <div>
                        <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Обработка платежа...
                        </h2>
                        <p className="text-gray-600">
                            Пожалуйста, подождите
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            ✅ Платеж успешно завершен!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {paymentType === 'subscription'
                                ? 'Спасибо за оплату! Ваша подписка активирована.'
                                : 'Спасибо за оплату. Ваш заказ принят в обработку.'
                            }
                        </p>
                        <p className="text-gray-600 mb-4">
                            Вы будете перенаправлены на страницу {paymentType === 'subscription' ? 'подписок' : 'заказов'} через несколько секунд...
                        </p>
                        <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 text-green-500 animate-spin" />
                        </div>
                        <Button
                            onClick={() => navigate(returnUrl)}
                            className="mt-4"
                        >
                            {paymentType === 'subscription' ? 'Перейти к подпискам' : 'Перейти к заказам'} сейчас
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            ❌ Ошибка при оплате
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {error || 'К сожалению, произошла ошибка при обработке платежа.'}
                        </p>
                        <Button onClick={() => navigate(returnUrl)} className="w-full">
                            Вернуться к {paymentType === 'subscription' ? 'подпискам' : 'заказам'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};