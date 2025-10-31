import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { toast } from 'sonner';
import { axiosInstance } from '@/core/config/axios';
import { AppLayout } from '@/core/components/layout/AppLayout';

type PaymentStatus = 'processing' | 'success' | 'error';

export const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PaymentStatus>('processing');
    const [error, setError] = useState<string | null>(null);

    const retryCountRef = useRef(0);
    const hasRedirectedRef = useRef(false);

    const paymentId = searchParams.get('paymentId');
    const paymentType = searchParams.get('type') || sessionStorage.getItem('paymentType') || 'order';

    useEffect(() => {
        if (!paymentId) {
            setStatus('error');
            setError('Payment ID не найден');
            return;
        }

        // Очищаем sessionStorage при загрузке страницы
        sessionStorage.removeItem('pendingPaymentId');
        sessionStorage.removeItem('returnUrl');
        sessionStorage.removeItem('paymentType');

        // Проверяем статус платежа каждую секунду
        const checkPaymentStatus = async () => {
            if (hasRedirectedRef.current) {
                return;
            }

            try {
                const response = await axiosInstance.get(`/payment-status/${paymentId}`);
                const payment = response.data;

                // Проверяем успешные статусы
                if (payment.status === 'paid' || payment.status === 'success') {
                    setStatus('success');
                    hasRedirectedRef.current = true;

                    const isSubscription = paymentType === 'subscription';

                    // Показываем уведомление об успешной оплате с деталями
                    if (isSubscription) {
                        toast.success('Подписка успешно оформлена!', {
                            description: 'Ваша подписка активирована и готова к использованию',
                            duration: 5000,
                        });
                    } else if (payment.orderId) {
                        // Для заказов показываем информацию о заказе
                        toast.success('Заказ успешно оплачен!', {
                            description: `Ваш заказ принят в обработку`,
                            duration: 5000,
                        });
                    }

                    // Перенаправляем на dashboard через 3 секунды
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3000);
                    return;
                } else if (payment.status === 'failed' || payment.status === 'canceled') {
                    // Ошибка платежа
                    setStatus('error');
                    setError('Платеж не был завершен');
                    hasRedirectedRef.current = true;

                    // Перенаправляем на dashboard через 3 секунды
                    toast.error('Оплата не прошла', {
                        description: 'Платеж не был завершен',
                        duration: 3000,
                    });
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3000);
                    return;
                }
            } catch (error: any) {
                console.error('Ошибка проверки статуса платежа:', error);
            } finally {
                if (hasRedirectedRef.current) {
                    return;
                }

                // Увеличиваем счетчик неудачных попыток
                retryCountRef.current += 1;

                // Если достигли 10 неудачных попыток, редиректим на dashboard
                if (retryCountRef.current >= 10) {
                    console.log('Достигнуто максимальное количество попыток, редирект на dashboard');
                    hasRedirectedRef.current = true;
                    toast.error('Оплата не прошла', {
                        description: 'Не удалось проверить статус платежа',
                        duration: 3000,
                    });
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                    return;
                }
                console.log(`Попытка ${retryCountRef.current}/10`);
            }
        };

        // Проверяем сразу
        checkPaymentStatus();

        // Проверяем каждую секунду, пока не получим финальный статус
        const interval = setInterval(checkPaymentStatus, 1000);

        return () => clearInterval(interval);
    }, [paymentId, paymentType, navigate]);

    return (
        <AppLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center animate-in fade-in duration-500">
                    {status === 'processing' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="relative inline-block mb-6">
                                <Loader2 className="h-16 w-16 text-orange-500 mx-auto animate-spin" />
                                <div className="absolute inset-0 rounded-full border-4 border-orange-200 animate-ping" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 animate-pulse">
                                Обработка платежа...
                            </h2>
                            <p className="text-gray-600">
                                Пожалуйста, подождите
                            </p>
                            <div className="mt-6 flex justify-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            {/* {retryCount > 0 && (
                                <p className="text-sm text-orange-600 mt-2">
                                    Попытка {retryCount}/5 проверки статуса
                                </p>
                            )} */}
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="animate-in fade-in zoom-in duration-700">
                            <div className="relative inline-block mb-6">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-in zoom-in duration-500" />
                                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 animate-in slide-in-from-top duration-500">
                                ✅ Платеж успешно завершен!
                            </h2>
                            <p className="text-gray-600 mb-4 animate-in slide-in-from-left duration-700">
                                {paymentType === 'subscription'
                                    ? 'Спасибо за оплату! Ваша подписка активирована.'
                                    : 'Спасибо за оплату. Ваш заказ принят в обработку.'
                                }
                            </p>
                            <p className="text-gray-600 mb-4 animate-in slide-in-from-right duration-700">
                                Вы будете перенаправлены на главную страницу через несколько секунд...
                            </p>
                            <div className="flex justify-center mb-4">
                                <Loader2 className="h-6 w-6 text-green-500 animate-spin" />
                            </div>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                className="mt-4 animate-in fade-in duration-1000"
                            >
                                Перейти на главную
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="animate-in fade-in zoom-in duration-700">
                            <div className="relative inline-block mb-6">
                                <AlertCircle className="h-16 w-16 text-red-500 mx-auto animate-in zoom-in duration-500" />
                                <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-pulse" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 animate-in slide-in-from-top duration-500">
                                ❌ Ошибка при оплате
                            </h2>
                            <p className="text-gray-600 mb-4 animate-in slide-in-from-left duration-700">
                                {error || 'К сожалению, произошла ошибка при обработке платежа.'}
                            </p>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                className="w-full animate-in fade-in duration-1000"
                            >
                                Вернуться на главную
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};