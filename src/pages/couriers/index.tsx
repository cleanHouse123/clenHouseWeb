import { Download, Smartphone, CheckCircle, Clock, DollarSign, MapPin, AlertTriangle, Settings, FileCheck, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const CouriersPage = () => {
    const [showInstallInstructions, setShowInstallInstructions] = useState(false);

    const handleDownloadAndroid = () => {
        const link = document.createElement('a');
        link.href = '/app.apk';
        link.download = 'cleanhouse-courier.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowInstallInstructions(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Работа курьером
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Станьте частью команды ЧистоДома и зарабатывайте, выполняя заказы на вывоз мусора
                    </p>
                </motion.div>

                {/* Скачивание приложения */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-12"
                >
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Smartphone className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Скачайте приложение для курьеров
                                    </h2>
                                    <p className="text-gray-700 mb-6">
                                        Установите мобильное приложение для Android, чтобы начать принимать и выполнять заказы
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            onClick={handleDownloadAndroid}
                                            variant="primary"
                                            size="lg"
                                            className="gap-2"
                                        >
                                            <Download className="h-5 w-5" />
                                            Скачать для Android (88 МБ)
                                        </Button>
                                        {!showInstallInstructions && (
                                            <Button
                                                onClick={() => setShowInstallInstructions(true)}
                                                variant="outline"
                                                size="lg"
                                                className="gap-2"
                                            >
                                                <FileCheck className="h-5 w-5" />
                                                Показать инструкцию по установке
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Инструкция по установке */}
                {showInstallInstructions && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-12"
                    >
                        <Card className="border-blue-200 bg-blue-50/50">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                    Инструкция по установке приложения
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Предупреждение */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-900 mb-1">Важная информация</h3>
                                        <p className="text-sm text-yellow-800">
                                            Для установки приложения из APK файла необходимо разрешить установку из неизвестных источников.
                                            Это стандартная процедура для установки приложений не из Google Play.
                                        </p>
                                    </div>
                                </div>

                                {/* Шаг 1: Разрешение установки */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                            1
                                        </div>
                                        Разрешите установку из неизвестных источников
                                    </h3>

                                    <div className="bg-white rounded-lg p-4 space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Settings className="h-5 w-5 text-gray-600" />
                                                Для Android 8.0 и выше:
                                            </h4>
                                            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm rtl:text-right">
                                                <li>Откройте <strong>Настройки</strong> на вашем устройстве</li>
                                                <li>Перейдите в раздел <strong>Безопасность</strong> или <strong>Безопасность и конфиденциальность</strong></li>
                                                <li>Найдите пункт <strong>"Установка приложений"</strong> или <strong>"Неизвестные источники"</strong></li>
                                                <li>Включите разрешение для <strong>браузера</strong> (Chrome, Firefox и т.д.) или <strong>"Установка из неизвестных источников"</strong></li>
                                                <li>Подтвердите действие во всплывающем окне</li>
                                            </ol>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <Settings className="h-5 w-5 text-gray-600" />
                                                Для Android 7.0 и ниже:
                                            </h4>
                                            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm rtl:text-right">
                                                <li>Откройте <strong>Настройки</strong></li>
                                                <li>Перейдите в <strong>Безопасность</strong></li>
                                                <li>Включите переключатель <strong>"Неизвестные источники"</strong></li>
                                                <li>Подтвердите действие в диалоговом окне</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                {/* Шаг 2: Установка */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                            2
                                        </div>
                                        Установите приложение
                                    </h3>

                                    <div className="bg-white rounded-lg p-4">
                                        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm rtl:text-right">
                                            <li>После скачивания файла откройте папку <strong>Загрузки</strong> (Downloads) на вашем устройстве</li>
                                            <li>Найдите файл <strong>cleanhouse-courier.apk</strong></li>
                                            <li>Нажмите на файл для начала установки</li>
                                            <li>Если появится предупреждение о безопасности, нажмите <strong>"Все равно установить"</strong> или <strong>"Разрешить"</strong></li>
                                            <li>Дождитесь завершения установки</li>
                                            <li>После установки нажмите <strong>"Открыть"</strong> или найдите приложение <strong>ЧистоДом</strong> в меню приложений</li>
                                        </ol>
                                    </div>
                                </div>

                                {/* Шаг 3: Первый запуск */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                            3
                                        </div>
                                        Первый запуск
                                    </h3>

                                    <div className="bg-white rounded-lg p-4">
                                        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm rtl:text-right">
                                            <li>Откройте приложение <strong>ЧистоДом</strong></li>
                                            <li>Разрешите необходимые разрешения (доступ к геолокации, уведомления и т.д.)</li>
                                            <li>Зарегистрируйтесь или войдите в свой аккаунт</li>
                                            <li>Начните принимать заказы!</li>
                                        </ol>
                                    </div>
                                </div>

                                {/* Дополнительная помощь */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                                        Возникли проблемы?
                                    </h4>
                                    <ul className="space-y-1 text-sm text-gray-700 rtl:text-right">
                                        <li>• Убедитесь, что на устройстве достаточно свободного места (требуется ~100 МБ)</li>
                                        <li>• Проверьте, что у вас установлена последняя версия Android (рекомендуется Android 8.0+)</li>
                                        <li>• Если установка не начинается, попробуйте скачать файл заново</li>
                                        <li>• Убедитесь, что антивирус не блокирует установку</li>
                                    </ul>
                                </div>

                                <Button
                                    onClick={() => setShowInstallInstructions(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Скрыть инструкцию
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Преимущества работы */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Преимущества работы с нами
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Хороший доход</h3>
                                </div>
                                <p className="text-gray-600">
                                    Получайте справедливую оплату за каждый выполненный заказ
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Гибкий график</h3>
                                </div>
                                <p className="text-gray-600">
                                    Работайте в удобное для вас время, сами выбирайте заказы
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Район работы</h3>
                                </div>
                                <p className="text-gray-600">
                                    Выполняйте заказы в удобных для вас районах Санкт-Петербурга
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Простая регистрация</h3>
                                </div>
                                <p className="text-gray-600">
                                    Быстрая регистрация через приложение, без длительных проверок
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <Smartphone className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Удобное приложение</h3>
                                </div>
                                <p className="text-gray-600">
                                    Интуитивно понятный интерфейс для управления заказами
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Регулярные выплаты</h3>
                                </div>
                                <p className="text-gray-600">
                                    Своевременная оплата выполненных заказов без задержек
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Как начать */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Как начать работать</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Скачайте приложение
                                        </h3>
                                        <p className="text-gray-600">
                                            Установите приложение для курьеров на ваш Android смартфон
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Зарегистрируйтесь
                                        </h3>
                                        <p className="text-gray-600">
                                            Пройдите простую процедуру регистрации в приложении
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Начните работать
                                        </h3>
                                        <p className="text-gray-600">
                                            Принимайте заказы и начинайте зарабатывать уже сегодня
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

