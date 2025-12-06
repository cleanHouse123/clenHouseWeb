import { Download, Smartphone, CheckCircle, Clock, DollarSign, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button/button';
import { motion } from 'framer-motion';

export const CouriersPage = () => {
    const handleDownloadAndroid = () => {
        // Здесь должна быть ссылка на APK файл или Google Play
        // Временно используем заглушку
        const androidAppUrl = 'https://example.com/app.apk'; // Замените на реальную ссылку
        window.open(androidAppUrl, '_blank');
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
                                    <Button
                                        onClick={handleDownloadAndroid}
                                        variant="primary"
                                        size="lg"
                                        className="gap-2 w-full md:w-auto"
                                    >
                                        <Download className="h-5 w-5" />
                                        Скачать для Android
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

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

