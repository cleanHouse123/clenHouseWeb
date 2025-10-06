import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/button/button';
import { Input } from '@/core/components/ui/inputs/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/core/components/ui/inputs/input-otp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/core/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { useSendSms } from '@/modules/auth/hooks/useSendSms';
import { useVerifySms } from '@/modules/auth/hooks/useVerifySms';
import { Phone, ArrowLeft, Shield, Link } from 'lucide-react';

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

interface SmsLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SmsLoginModal = ({ isOpen, onClose }: SmsLoginModalProps) => {
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [devCode, setDevCode] = useState<string>('');
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
    const isDev = import.meta.env.VITE_SMS_DEV_MODE === 'true' || import.meta.env.DEV;
    const handlePhoneSubmit = async (data: PhoneFormData) => {

        setIsLoading(true);
        try {
            // Определяем режим разработки по URL или переменной окружения

            const result = await sendSms({
                phoneNumber: data.phoneNumber,
                isDev: isDev
            });



            setPhoneNumber(data.phoneNumber);

            // Сохраняем код для режима разработки
            if (isDev && result?.code) {
                setDevCode(result.code);
                console.log('🔧 DEV MODE: Код с сервера:', result.code);
            }

            // Переходим на следующий шаг
            setStep('code');

            // Принудительно сбрасываем форму кода ПОСЛЕ перехода
            setTimeout(() => {
                codeForm.reset({ code: '' });
                codeForm.setValue('code', '');
            }, 100);




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
            // Закрываем модальное окно при успешной авторизации
            onClose();
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

    const handleClose = () => {
        // Сбрасываем состояние при закрытии
        setStep('phone');
        setPhoneNumber('');
        setHasError(false);
        setIsSubmitting(false);
        setDevCode('');
        phoneForm.reset();
        codeForm.reset();
        onClose();
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
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <Shield className="h-4 w-4 text-primary-foreground" />
                            </div>
                            {step === 'phone' ? 'Вход по SMS' : 'Подтверждение кода'}
                        </DialogTitle>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {step === 'phone'
                            ? 'Введите номер телефона для получения кода'
                            : `Код отправлен на номер ${phoneNumber}`
                        }
                    </p>
                    {(import.meta.env.DEV || window.location.hostname === 'localhost') && (
                        <div className="mt-2 px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <p className="text-sm text-yellow-800 font-medium">
                                Режим разработки
                            </p>
                            {devCode && (
                                <div className="mt-2 p-2 bg-yellow-200 rounded border border-yellow-400">
                                    <p className="text-xs text-yellow-900 font-mono">
                                        Код с сервера: <span className="font-bold text-lg">{devCode}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogHeader>

                <div className="space-y-6">
                    {step === 'phone' ? (
                        <Form {...phoneForm}>
                            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                                <FormField
                                    control={phoneForm.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Номер телефона
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        placeholder="+375 29 123 45 67"
                                                        className="pl-10"
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
                                    className="w-full"
                                    disabled={isLoading || isSendingSms}
                                >
                                    {isLoading || isSendingSms ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
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
                            <div className="space-y-4">
                                <FormField
                                    control={codeForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
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
                                        <div className="flex items-center justify-center py-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                            <span className="text-sm text-muted-foreground">Проверка кода...</span>
                                        </div>
                                    )}

                                    {/* Кнопка для автоматического заполнения кода в режиме разработки */}
                                    {isDev && devCode && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                codeForm.setValue('code', devCode);
                                                codeForm.trigger('code');
                                                setHasError(false);

                                                // Автоматически отправляем форму после заполнения
                                                setTimeout(() => {
                                                    if (!isLoading && !isVerifyingSms && !isSubmitting) {
                                                        setIsSubmitting(true);
                                                        handleCodeSubmit({ code: devCode });
                                                    }
                                                }, 100);
                                            }}
                                            className="w-full"
                                            disabled={isLoading || isVerifyingSms || isSubmitting}
                                        >
                                            Использовать код с сервера
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBackToPhone}
                                        className="w-full"
                                        disabled={isLoading || isVerifyingSms || isSubmitting}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Изменить номер
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        Вы соглашаетесь с политикой конфиденциальности и условиями использования
                                    </p>
                                </div>
                            </div>
                        </Form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
