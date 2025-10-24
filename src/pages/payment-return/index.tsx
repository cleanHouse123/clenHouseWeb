import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { toast } from 'sonner';

type PaymentStatus = 'processing' | 'success' | 'error';

export const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PaymentStatus>('processing');
    const [error, setError] = useState<string | null>(null);

    const paymentId = searchParams.get('paymentId');
    const paymentStatus = searchParams.get('status');
    const paymentType = searchParams.get('type'); // 'order' или 'subscription'
    const errorParam = searchParams.get('error');
    const returnUrl = sessionStorage.getItem('returnUrl') || (paymentType === 'subscription' ? '/subscriptions' : '/orders');

    useEffect(() => {
        // Очищаем sessionStorage при загрузке страницы
        sessionStorage.removeItem('pendingPaymentId');
        sessionStorage.removeItem('returnUrl');

        if (errorParam) {
            setStatus('error');
            setError('Произошла ошибка при обработке платежа');
            return;
        }

        if (paymentId && paymentStatus === 'success') {
            setStatus('success');

            const isSubscription = paymentType === 'subscription';

            // Показываем уведомление об успешной оплате
            toast.success(isSubscription ? 'Подписка успешно оплачена!' : 'Заказ успешно оплачен!', {
                description: isSubscription ? 'Ваша подписка активирована' : 'Ваш заказ принят в обработку',
                duration: 5000,
            });

            // Перенаправляем на соответствующую страницу через 3 секунды
            setTimeout(() => {
                navigate(returnUrl);
            }, 3000);
        } else {
            // Если нет параметров или статус не success, показываем ошибку
            setStatus('error');
            setError('Платеж не был завершен');
        }
    }, [paymentId, paymentStatus, errorParam, navigate, returnUrl]);

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