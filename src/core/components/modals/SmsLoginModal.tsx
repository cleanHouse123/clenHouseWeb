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
import { Phone, ArrowLeft, Shield, MessageCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '@/modules/auth/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoginButton } from '@telegram-auth/react';

// Функция для жесткого форматирования номера телефона
const formatPhoneNumber = (value: string): string => {
    // Удаляем все символы кроме цифр
    const numbers = value.replace(/\D/g, '');

    // Ограничиваем длину до 11 цифр
    const limitedNumbers = numbers.slice(0, 11);

    // Если начинается с 8, заменяем на 7
    if (limitedNumbers.startsWith('8')) {
        const formatted = '7' + limitedNumbers.slice(1);
        return formatRussianPhone(formatted);
    }

    // Если начинается с 7, форматируем как российский номер
    if (limitedNumbers.startsWith('7')) {
        return formatRussianPhone(limitedNumbers);
    }

    // Если пустая строка или не начинается с 7/8, возвращаем +7
    if (limitedNumbers.length === 0) {
        return '+7';
    }

    // Если не начинается с 7 или 8, добавляем 7 в начало
    return formatRussianPhone('7' + limitedNumbers);
};

const formatRussianPhone = (numbers: string): string => {
    if (numbers.length <= 1) return '+7';
    if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    if (numbers.length === 10) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
};

// Схема валидации для номера телефона
const phoneSchema = z.object({
    phoneNumber: z.string()
        .min(1, 'Введите номер телефона')
        .refine((value) => {
            console.log('🔧 phoneSchema validation - value:', value);
            // Более гибкая валидация - принимаем номера с 10 или 11 цифрами
            const isValid = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{1,2}$/.test(value) ||
                /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(value);
            console.log('🔧 phoneSchema validation - isValid:', isValid);
            return isValid;
        }, 'Введите корректный российский номер телефона'),
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
    const [isTelegramLoading, setIsTelegramLoading] = useState(false);
    const codeInputRef = useRef<HTMLInputElement>(null);
    const telegramButtonRef = useRef<HTMLDivElement>(null);
    const [searchParams] = useSearchParams();

    const { mutateAsync: sendSms, isPending: isSendingSms } = useSendSms();
    const { mutateAsync: verifySms, isPending: isVerifyingSms } = useVerifySms();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Получаем имя бота из переменных окружения
    const telegramBotName = import.meta.env.VITE_TELEGRAM_BOT_NAME || 'chistoDoma2_bot';

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
        console.log('🔧 handlePhoneSubmit - data:', data);
        console.log('🔧 handlePhoneSubmit - phoneNumber:', data.phoneNumber);

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
            // Проверяем, есть ли параметр subscriptionType в URL
            const subscriptionType = searchParams.get('subscriptionType');

            if (subscriptionType) {
                // Если есть параметр subscriptionType, используем прямую верификацию без перенаправления
                const adToken = localStorage.getItem('adToken');
                const result = await authApi.verifySms({
                    phoneNumber,
                    code: data.code,
                    ...(adToken && { adToken }),
                });

                // Сохраняем токены в localStorage
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refreshToken);
                localStorage.removeItem('adToken');

                // Инвалидируем кэш пользователя для обновления данных
                queryClient.invalidateQueries({ queryKey: ['me'] });

                toast.success('Добро пожаловать!', {
                    description: `Привет, ${result.user.name}! Вы успешно вошли в систему`,
                    duration: 4000,
                });

                // Закрываем модальное окно - перенаправление произойдет в SubscriptionPlansSection
                onClose();
            } else {
                // Если нет параметра, используем стандартную логику с перенаправлением
                await verifySms({
                    phoneNumber,
                    code: data.code
                });
            }
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

    const handleTelegramAuth = async (user: any) => {
        setIsTelegramLoading(true);
        try {
            const adToken = localStorage.getItem('adToken');

            const result = await authApi.verifyTelegram({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                photo_url: user.photo_url,
                auth_date: user.auth_date,
                hash: user.hash,
                ...(adToken && { adToken }),
            });

            // Сохраняем токены в localStorage
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.removeItem('adToken');

            // Инвалидируем кэш пользователя для обновления данных
            queryClient.invalidateQueries({ queryKey: ['me'] });

            toast.success('Добро пожаловать!', {
                description: `Привет, ${result.user.name}! Вы успешно вошли через Telegram`,
                duration: 4000,
            });

            // Закрываем модальное окно
            onClose();

            // Перенаправляем в личный кабинет
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Ошибка авторизации через Telegram:', error);
            toast.error('Ошибка входа', {
                description: error?.response?.data?.message || 'Не удалось войти через Telegram',
                duration: 5000,
            });
        } finally {
            setIsTelegramLoading(false);
        }
    };

    const handleClose = () => {
        // Сбрасываем состояние при закрытии
        setStep('phone');
        setPhoneNumber('');
        setHasError(false);
        setIsSubmitting(false);
        setDevCode('');
        setIsTelegramLoading(false);
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
            <DialogContent className="!w-full !max-w-sm sm:!max-w-md !mx-auto md:!max-w-md lg:!max-w-md xl:!max-w-md">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
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
                    {/* {(import.meta.env.DEV || window.location.hostname === 'localhost') && (
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
                    )} */}
                </DialogHeader>

                <div className="px-6 pb-6 space-y-6">
                    {step === 'phone' ? (
                        <div className="space-y-4">
                            {/* Кнопка входа через Telegram */}
                            {telegramBotName && (
                                <div className="space-y-2">
                                    <div
                                        ref={telegramButtonRef}
                                        className="relative w-full telegram-button-container"
                                        style={{ height: '42px' }}
                                    >
                                        <div className="absolute inset-0 z-0 pointer-events-none cursor-pointer">
                                            <button
                                                type="button"
                                                className="inline-flex h-full w-full items-center justify-center gap-2 rounded-[12px] !cursor-pointer bg-primary px-4 text-sm font-medium text-primary-foreground"
                                            >
                                                <svg
                                                    className="h-[14px] w-[15px] shrink-0"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.37.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                                                </svg>
                                                <span>Войти через Telegram</span>
                                            </button>
                                        </div>
                                        <div className="absolute inset-0 z-20">
                                            <LoginButton
                                                botUsername={telegramBotName}
                                                buttonSize="large"
                                                cornerRadius={16}
                                                lang="ru"
                                                showAvatar={false}
                                                onAuthCallback={handleTelegramAuth}
                                            />
                                        </div>
                                        <style>{`
                                            .telegram-button-container iframe {
                                                border-radius: 24px !important;
                                                width: 100% !important;
                                                height: 42px !important;
                                                border: none !important;
                                                opacity: 0 !important;
                                                pointer-events: auto !important;
                                                cursor: pointer !important;
                                                position: relative !important;
                                                z-index: 20 !important;
                                            }
                                        `}</style>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-muted-foreground">или</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Form {...phoneForm}>
                                <form className="space-y-4" noValidate>
                                    <FormField
                                        control={phoneForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    Номер телефона
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder="+7 (999) 999-99-99"
                                                            className="pl-10"
                                                            autoComplete="tel"
                                                            maxLength={18}
                                                            inputMode="numeric"
                                                            onChange={(e) => {
                                                                const formatted = formatPhoneNumber(e.target.value);
                                                                console.log('🔧 onChange - input:', e.target.value, 'formatted:', formatted);
                                                                field.onChange(formatted);
                                                                // Принудительно обновляем значение поля
                                                                if (e.target.value !== formatted) {
                                                                    e.target.value = formatted;
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                // Дополнительная проверка при потере фокуса
                                                                const formatted = formatPhoneNumber(e.target.value);
                                                                if (e.target.value !== formatted) {
                                                                    e.target.value = formatted;
                                                                    field.onChange(formatted);
                                                                }
                                                            }}
                                                            onKeyDown={(e) => {
                                                                // Разрешаем только цифры, Backspace, Delete, Tab, Escape, Enter
                                                                const allowedKeys = [
                                                                    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                                                                    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                                                                    'Home', 'End'
                                                                ];

                                                                // Разрешаем цифры
                                                                if (e.key >= '0' && e.key <= '9') {
                                                                    return;
                                                                }

                                                                // Разрешаем специальные клавиши
                                                                if (allowedKeys.includes(e.key)) {
                                                                    return;
                                                                }

                                                                // Разрешаем Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                                                if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                                                                    return;
                                                                }

                                                                // Блокируем все остальные клавиши
                                                                e.preventDefault();
                                                            }}
                                                            onPaste={(e) => {
                                                                e.preventDefault();
                                                                const pastedText = e.clipboardData.getData('text');
                                                                const formatted = formatPhoneNumber(pastedText);
                                                                console.log('🔧 onPaste - pastedText:', pastedText, 'formatted:', formatted);
                                                                field.onChange(formatted);
                                                                // Принудительно обновляем значение поля
                                                                const target = e.target as HTMLInputElement;
                                                                target.value = formatted;
                                                            }}
                                                            onDrop={(e) => {
                                                                e.preventDefault();
                                                                const droppedText = e.dataTransfer.getData('text');
                                                                const formatted = formatPhoneNumber(droppedText);
                                                                field.onChange(formatted);
                                                            }}
                                                            onDragOver={(e) => {
                                                                e.preventDefault();
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        className="w-full"
                                        disabled={isLoading || isSendingSms || isTelegramLoading}
                                        onMouseDown={async (e) => {
                                            // Предотвращаем потерю фокуса и отправляем форму
                                            e.preventDefault();

                                            // Принудительно запускаем валидацию
                                            const validationResult = await phoneForm.trigger();

                                            if (validationResult) {
                                                phoneForm.handleSubmit(handlePhoneSubmit)();
                                            }
                                        }}
                                    >
                                        {isLoading || isSendingSms ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                                Отправка...
                                            </div>
                                        ) : (
                                            <>
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Отправить код
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
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
                                            variant="outline"
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
