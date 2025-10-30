import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderModal } from '@/core/contexts/CreateOrderContext';
import { useUserSubscription } from '@/modules/subscriptions/hooks/useSubscriptions';

interface WelcomeSectionProps {
    userName: string;
}

export const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
    const navigate = useNavigate();
    const { openCreateOrderModal } = useCreateOrderModal();
    const { data: userSubscription } = useUserSubscription();

    const hasActiveSubscription = userSubscription?.status === 'active';

    const handleCreateOrder = () => {
        openCreateOrderModal();
    };

    const handleOrderHistory = () => {
        navigate('/orders');
    };

    const handleSubscriptions = () => {
        navigate('/subscriptions');
    };

    const handleScheduledOrders = () => {
        navigate('/scheduled-orders');
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02, y: -2 }
    };

    return (
        <div className="mb-8 bg-white p-[18px] md:p-[36px] rounded-[32px]">
            {/* Welcome Message */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Добро пожаловать, {userName}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                    Управляйте своими заказами и подпиской в личном кабинете
                </p>
            </motion.div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch">
                {/* Создать заказ - Основная карточка */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={handleCreateOrder}
                    className="cursor-pointer group h-full"
                >
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl p-4 h-full flex flex-row justify-between items-center transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div className="flex-1 min-w-0 mr-3">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-[8px]">
                                Создать заказ
                            </h3>
                            <p className="text-orange-100 text-xs sm:text-sm lg:text-base">
                                Вызовите курьера
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.6666 6.66675V25.3334M7.33331 16.0001H26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* История заказов */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onClick={handleOrderHistory}
                    className="cursor-pointer group h-full"
                >
                    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 h-full flex flex-row justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex-1 min-w-0 mr-3">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2">
                                История заказов
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                                Ваши заказы за всё время
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">

                                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.3333 10.6667V16.0001L19.6666 19.3334" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3.53333 15.6C3.53333 22.6692 9.26408 28.4 16.3333 28.4C23.4026 28.4 29.1333 22.6692 29.1333 15.6C29.1333 8.53074 23.4026 2.79999 16.3333 2.79999C12.6727 2.79999 9.37107 4.3366 7.03812 6.79999M7.03812 6.79999L7.33337 2M7.03812 6.79999L11.8334 7" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Мои подписки */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.3, delay: 0.3 }}
                    onClick={handleSubscriptions}
                    className="cursor-pointer group h-full"
                >
                    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 h-full flex flex-row justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex-1 min-w-0 mr-3">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2">
                                Мои подписки
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                                Управление подписками
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">

                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.66673 15.9999C2.66673 10.9719 2.66673 8.45725 4.2294 6.89592C5.79207 5.33459 8.3054 5.33325 13.3334 5.33325H18.6667C23.6947 5.33325 26.2094 5.33325 27.7707 6.89592C29.3321 8.45858 29.3334 10.9719 29.3334 15.9999C29.3334 21.0279 29.3334 23.5426 27.7707 25.1039C26.2081 26.6652 23.6947 26.6666 18.6667 26.6666H13.3334C8.3054 26.6666 5.79073 26.6666 4.2294 25.1039C2.66807 23.5412 2.66673 21.0279 2.66673 15.9999Z" stroke="#FF5D00" stroke-width="2" />
                                    <path d="M13.3334 21.3333H8.00007M18.6667 21.3333H16.6667M2.66673 13.3333H29.3334" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" />
                                </svg>


                            </div>
                        </div>
                    </div>
                </motion.div>

                {hasActiveSubscription && (
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.3, delay: 0.4 }}
                    onClick={handleScheduledOrders}
                    className="cursor-pointer group h-full"
                >
                    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 h-full flex flex-row justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex-1 min-w-0 mr-3">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2">
                                Расписания
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                                Автоматические заказы
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.6667 5.33325H5.33337C3.86061 5.33325 2.66671 6.52715 2.66671 7.99992V25.3333C2.66671 26.806 3.86061 27.9999 5.33337 27.9999H26.6667C28.1395 27.9999 29.3334 26.806 29.3334 25.3333V7.99992C29.3334 6.52715 28.1395 5.33325 26.6667 5.33325Z" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M22.6667 1.33325V9.33325" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.33337 1.33325V9.33325" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2.66671 15.9999H29.3334" stroke="#FF5D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
                )}
            </div>
        </div>
    );
};
