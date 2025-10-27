import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button/button';
import { Trash2, Clock, Shield, Star } from 'lucide-react';
import { useOrderPrice } from '@/modules/price';
import { kopecksToRublesNumber } from '@/core/utils/priceUtils';

interface PriceSectionProps {
    onCallCourier: () => void;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ onCallCourier }) => {
    const { orderPrice, isLoading } = useOrderPrice();

    return (
        <section className="pt-[20px] sm:pt-[30px]">
            <div className="mx-auto px-2 xs:px-4 sm:px-8 lg:px-16 max-w-6xl">


                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <Card radius="r40" padding="sm" className="relative overflow-hidden shadow-2xl sm:p-8 lg:p-12">
                        {/* Декоративные элементы */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-20" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300 rounded-full translate-y-12 -translate-x-12 opacity-20" />

                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-8 lg:gap-12">
                                {/* Левая часть - цена */}
                                <div className="text-center lg:text-left">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        viewport={{ once: true }}
                                        className="mb-4 sm:mb-6"
                                    >
                                        <div className="inline-flex items-center gap-1 sm:gap-2 bg-orange-100 text-orange-800 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                                            <span className="hidden xs:inline">Специальное предложение</span>
                                            <span className="xs:hidden">Скидка</span>
                                        </div>

                                        <div className="flex items-baseline justify-center lg:justify-start gap-1 sm:gap-2 mb-2">
                                            <span className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold text-orange-500">
                                                {isLoading ? '...' : (orderPrice ? kopecksToRublesNumber(orderPrice.priceInKopecks) : '149')}
                                            </span>
                                            <span className="text-lg sm:text-2xl text-gray-600">₽</span>
                                        </div>

                                        <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            <span className="text-sm sm:text-lg text-gray-500 line-through">299₽</span>
                                            <span className="bg-red-100 text-red-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium">
                                                -50%
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm sm:text-lg">
                                            Разовый вынос мусора
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Центральная часть - разделитель */}
                                <div className="hidden lg:block w-px h-32 bg-gray-200" />

                                {/* Правая часть - преимущества */}
                                <div className="flex-1">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                        viewport={{ once: true }}
                                        className="space-y-3 sm:space-y-4"
                                    >
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                                            Что входит в услугу:
                                        </h3>

                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                                </div>
                                                <span className="text-sm sm:text-base text-gray-700">Вынос бытового мусора до 35 литров</span>
                                            </div>

                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                                </div>
                                                <span className="text-sm sm:text-base text-gray-700">Приезд курьера в удобное время</span>
                                            </div>

                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                                                </div>
                                                <span className="text-sm sm:text-base text-gray-700">Гарантия качества и безопасности</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Кнопка заказа */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                                className="mt-6 sm:mt-8 text-center"
                            >
                                <Button
                                    onClick={onCallCourier}
                                    variant="primary"
                                    size="sm"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                                >
                                    <span className="hidden xs:inline">
                                        Заказать вынос мусора за {isLoading ? '...' : (orderPrice ? kopecksToRublesNumber(orderPrice.priceInKopecks) : '149')}₽
                                    </span>
                                    <span className="xs:hidden">
                                        Заказать за {isLoading ? '...' : (orderPrice ? kopecksToRublesNumber(orderPrice.priceInKopecks) : '149')}₽
                                    </span>
                                </Button>


                            </motion.div>
                        </div>
                    </Card>
                </motion.div>


            </div>
        </section>
    );
};
