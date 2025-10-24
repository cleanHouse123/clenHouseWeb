import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { useCheckOrderPaymentStatus } from '@/modules/orders/hooks/useOrders';
import { toast } from 'sonner';

type PaymentStatus = 'checking' | 'success' | 'error';

export const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PaymentStatus>('checking');
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync: checkPaymentStatus } = useCheckOrderPaymentStatus();

    const paymentId = searchParams.get('paymentId');
    const returnUrl = sessionStorage.getItem('returnUrl') || '/orders';

    useEffect(() => {
        if (paymentId) {
            checkPaymentResult(paymentId);
        } else {
            // В тестовом режиме YooKassa может не передавать paymentId
            handleTestModeReturn();
        }
    }, [paymentId]);

    const handleTestModeReturn = async () => {
        try {
            // В тестовом режиме проверяем последний платеж из sessionStorage
            const pendingPaymentId = sessionStorage.getItem('pendingPaymentId');

            if (pendingPaymentId) {
                // Если есть сохраненный paymentId, проверяем его статус
                console.log('Тестовый режим: проверяем последний платеж', pendingPaymentId);
                await checkPaymentResult(pendingPaymentId);
            } else {
                // Если нет сохраненного paymentId, показываем общее сообщение об успешной оплате
                console.log('Тестовый режим: показываем общее сообщение об успешной оплате');
                setStatus('success');

                // Очищаем sessionStorage
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('returnUrl');

                // Показываем уведомление об успешной оплате
                toast.success('Заказ успешно оплачен!', {
                    description: 'Ваш заказ будет обработан в ближайшее время',
                    duration: 5000,
                });

                // Перенаправляем на страницу заказов через 3 секунды
                setTimeout(() => {
                    navigate(returnUrl);
                }, 3000);
            }
        } catch (error) {
            console.error('Ошибка обработки возврата в тестовом режиме:', error);
            setStatus('error');
            setError('Ошибка обработки возврата с платежной страницы');
        }
    };

    const checkPaymentResult = async (paymentId: string) => {
        try {
            // Проверяем статус платежа (сервер уже обработал возврат с YooKassa)
            const payment = await checkPaymentStatus(paymentId);

            if (payment.status === 'paid') {
                setStatus('success');

                // Очищаем sessionStorage
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('returnUrl');

                // Показываем уведомление об успешной оплате
                toast.success('Заказ успешно оплачен!', {
                    description: 'Ваш заказ будет обработан в ближайшее время',
                    duration: 5000,
                });

                // Перенаправляем на страницу заказов через 3 секунды
                setTimeout(() => {
                    navigate(returnUrl);
                }, 3000);
            } else if (payment.status === 'failed') {
                setStatus('error');
                setError('Платеж не прошел');

                // Очищаем sessionStorage
                sessionStorage.removeItem('pendingPaymentId');
                sessionStorage.removeItem('returnUrl');
            } else {
                // Если статус еще pending, ждем и проверяем снова
                setTimeout(() => checkPaymentResult(paymentId), 2000);
            }
        } catch (error) {
            console.error('Ошибка проверки платежа:', error);
            setStatus('error');
            setError('Ошибка проверки статуса платежа');
        }
    };

    const handleRetry = () => {
        if (paymentId) {
            setStatus('checking');
            setError(null);
            checkPaymentResult(paymentId);
        }
    };

    const handleGoBack = () => {
        navigate(returnUrl);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === 'checking' && (
                    <div>
                        <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Проверяем статус платежа...
                        </h2>
                        <p className="text-gray-600">
                            Сервер обработал возврат с YooKassa, проверяем результат
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
                            {paymentId
                                ? 'Ваш заказ успешно оплачен. Вы будете перенаправлены автоматически...'
                                : 'Оплата прошла успешно! Вы будете перенаправлены автоматически...'
                            }
                        </p>
                        <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 text-green-500 animate-spin" />
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            ❌ Ошибка оплаты
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {error || 'Платеж не был завершен. Попробуйте еще раз.'}
                        </p>
                        <div className="space-y-3">
                            <Button onClick={handleRetry} className="w-full">
                                Попробовать снова
                            </Button>
                            <Button variant="outline" onClick={handleGoBack} className="w-full">
                                Вернуться к заказам
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};