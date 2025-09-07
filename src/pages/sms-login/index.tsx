import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/inputs/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/core/components/ui/inputs/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { useSendSms } from '@/modules/auth/hooks/useSendSms';
import { useVerifySms } from '@/modules/auth/hooks/useVerifySms';
import { Phone, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Схема валидации для номера телефона
const phoneSchema = z.object({
    phoneNumber: z.string()
        .min(1, 'Введите номер телефона')
        .regex(/^\+?[1-9][\d\s]{1,14}$/, 'Введите корректный номер телефона'),
});

// Схема валидации для SMS кода
const codeSchema = z.object({
    code: z.string()
        .min(4, 'Код должен содержать минимум 4 цифры')
        .max(6, 'Код должен содержать максимум 6 цифр')
        .regex(/^\d+$/, 'Код должен содержать только цифры'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type CodeFormData = z.infer<typeof codeSchema>;

export const SmsLoginPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const codeInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync: sendSms, isPending: isSendingSms } = useSendSms();
    const { mutateAsync: verifySms, isPending: isVerifyingSms } = useVerifySms();

    const phoneForm = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phoneNumber: '',
        },
    });

    const codeForm = useForm<CodeFormData>({
        resolver: zodResolver(codeSchema),
        defaultValues: {
            code: '',
        },
    });

    const handlePhoneSubmit = async (data: PhoneFormData) => {
        console.log('Отправка SMS для номера:', data.phoneNumber);
        setIsLoading(true);
        try {
            // Определяем режим разработки по URL или переменной окружения
            const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

            const result = await sendSms({
                phoneNumber: data.phoneNumber,
                isDev: isDev
            });
            console.log('SMS отправлен успешно:', result);

            // Обновляем состояние
            setPhoneNumber(data.phoneNumber);

            // Переходим на следующий шаг
            setStep('code');

            // Принудительно сбрасываем форму кода ПОСЛЕ перехода
            setTimeout(() => {
                codeForm.reset({ code: '' });
                codeForm.setValue('code', '');
            }, 100);

            console.log('Переход на шаг ввода кода');

            if (isDev) {
                console.log('🔧 DEV MODE: Используйте любой код для тестирования');
            }
        } catch (error) {
            console.error('Ошибка отправки SMS:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeSubmit = async (data: CodeFormData) => {
        setIsLoading(true);
        try {
            await verifySms({
                phoneNumber,
                code: data.code
            });
        } catch (error) {
            console.error('Ошибка верификации SMS:', error);
            // Устанавливаем состояние ошибки
            setHasError(true);

            // Очищаем код при ошибке
            codeForm.reset({ code: '' });
            codeForm.setValue('code', '');

            // Убираем ошибку через 3 секунды
            setTimeout(() => {
                setHasError(false);
            }, 3000);

            // Фокусируемся на первом поле для повторного ввода
            setTimeout(() => {
                codeInputRef.current?.focus();
            }, 100);
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const handleBackToPhone = () => {
        setStep('phone');
        codeForm.reset({ code: '' });
        codeForm.setValue('code', '');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // Автоматический фокус на поле кода при переходе на второй шаг
    useEffect(() => {
        if (step === 'code' && codeInputRef.current) {
            // Сначала очищаем форму
            codeForm.reset({ code: '' });
            codeForm.setValue('code', '');

            // Затем фокусируемся
            setTimeout(() => {
                codeInputRef.current?.focus();
            }, 100);
        }
    }, [step, codeForm]);


    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background to-secondary p-4">
            <div className="w-full flex justify-start mb-4">
                <Button
                    variant="ghost"
                    onClick={handleBackToHome}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Назад
                </Button>
            </div>

            <div className="w-full max-w-md flex-1 flex items-center justify-center">
                <Card className="shadow-xl border-0 bg-card w-full">
                    <CardHeader className="text-center pb-6">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-center text-2xl font-bold text-card-foreground">
                            {step === 'phone' ? 'Вход по SMS' : 'Подтверждение кода'}
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                            {step === 'phone'
                                ? 'Введите номер телефона для получения кода'
                                : `Код отправлен на номер ${phoneNumber}`
                            }
                        </p>
                        {(import.meta.env.DEV || window.location.hostname === 'localhost') && (
                            <div className="mt-3 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                                <p className="text-sm text-yellow-800 font-medium">
                                    Режим разработки
                                </p>

                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        {step === 'phone' ? (
                            <Form {...phoneForm}>
                                <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
                                    <FormField
                                        control={phoneForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-card-foreground">
                                                    Номер телефона
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                                        <Input
                                                            {...field}
                                                            type="tel"
                                                            placeholder="+375 29 123 45 67"
                                                            className="pl-12 bg-input border-input focus:border-ring focus:ring-ring"
                                                            autoComplete="tel"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                                        disabled={isLoading || isSendingSms}
                                    >
                                        {isLoading || isSendingSms ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                                                Отправка...
                                            </div>
                                        ) : (
                                            'Отправить код'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <Form {...codeForm}>
                                <div className="space-y-6">
                                    <FormField
                                        control={codeForm.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-card-foreground">
                                                    Код подтверждения
                                                </FormLabel>
                                                <FormControl>
                                                    <InputOTP
                                                        maxLength={6}
                                                        value={field.value || ''}
                                                        onChange={(value) => {
                                                            console.log('OTP onChange:', value);
                                                            field.onChange(value);
                                                            // Принудительно обновляем форму
                                                            codeForm.setValue('code', value);
                                                            codeForm.trigger('code');
                                                            // Убираем ошибку при вводе
                                                            if (hasError) {
                                                                setHasError(false);
                                                            }

                                                            // Автоматическая отправка при заполнении всех цифр
                                                            if (value.length === 6 &&
                                                                !isLoading &&
                                                                !isVerifyingSms &&
                                                                !isSubmitting) {
                                                                console.log('Автоматическая отправка формы');
                                                                setIsSubmitting(true);

                                                                // Небольшая задержка для лучшего UX
                                                                setTimeout(() => {
                                                                    handleCodeSubmit({ code: value });
                                                                }, 500);
                                                            }
                                                        }}
                                                        ref={codeInputRef}
                                                    >
                                                        <InputOTPGroup className={`justify-center ${hasError ? 'border-red-500' : ''}`}>
                                                            <InputOTPSlot
                                                                index={0}
                                                                className={hasError ? 'border-red-500 bg-red-50' : ''}
                                                            />
                                                            <InputOTPSlot
                                                                index={1}
                                                                className={hasError ? 'border-red-500 bg-red-50' : ''}
                                                            />
                                                            <InputOTPSlot
                                                                index={2}
                                                                className={hasError ? 'border-red-500 bg-red-50' : ''}
                                                            />
                                                            <InputOTPSlot
                                                                index={3}
                                                                className={hasError ? 'border-red-500 bg-red-50' : ''}
                                                            />
                                                            <InputOTPSlot
                                                                index={4}
                                                                className={hasError ? 'border-red-500 bg-red-50' : ''}
                                                            />
                                                            <InputOTPSlot
                                                                index={5}
                                                                className={hasError ? 'border-red-500 bg-red-50' : ''}
                                                            />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-3">
                                        {(isLoading || isVerifyingSms || isSubmitting) && (
                                            <div className="flex items-center justify-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                                                <span className="text-sm text-muted-foreground">Проверка кода...</span>
                                            </div>
                                        )}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleBackToPhone}
                                            className="w-full"
                                            disabled={isLoading || isVerifyingSms || isSubmitting}
                                        >
                                            Изменить номер
                                        </Button>

                                        <p className="text-xs text-muted-foreground text-center">
                                            Код отправится автоматически при заполнении всех полей
                                        </p>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
