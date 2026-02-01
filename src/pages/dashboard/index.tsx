import { useEffect, useState } from 'react';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useCustomerOrders } from '@/modules/orders/hooks/useOrders';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { WelcomeSection } from './components/WelcomeSection';
import { RecentOrders } from './components/RecentOrders';
import { CreateOrderProvider } from '@/core/contexts/CreateOrderContext';
import { PhoneNumberModal } from '@/core/components/modals/PhoneNumberModal';

const DashboardContent = () => {
    const { data: user, isLoading: isLoadingUser, error } = useGetMe();
    const { data: customerOrders, isLoading: isLoadingOrders } = useCustomerOrders();
    const [showPhoneModal, setShowPhoneModal] = useState(false);

    useEffect(() => {
        // Проверяем, нужно ли показать модальное окно для ввода номера
        const shouldShowPhoneModal = localStorage.getItem('showPhoneModal') === 'true';
        if (shouldShowPhoneModal && user && !user.phone) {
            setShowPhoneModal(true);
            localStorage.removeItem('showPhoneModal');
        } else if (user && !user.phone && !shouldShowPhoneModal) {
            // Если пользователь загружен и у него нет номера, показываем модальное окно
            setShowPhoneModal(true);
        }
    }, [user]);

    // Показываем загрузку
    if (isLoadingUser) {
        return <LoadingIndicator />;
    }

    // Показываем ошибку
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">
                        Ошибка загрузки данных
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Не удалось загрузить информацию о пользователе
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    // Если нет данных пользователя
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">
                        Пользователь не найден
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Данные пользователя не найдены
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PhoneNumberModal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                required={!user.phone}
            />
            <div className="min-h-screen ">
                {/* Main Content */}
                <main className="mx-auto px-4 sm:px-8 lg:px-16 py-8">
                    {/* Welcome Section */}
                    <WelcomeSection userName={user.name} />

                    {/* Recent Orders */}
                    <div className="max-w-4xl">
                        <RecentOrders
                            orders={customerOrders || []}
                            isLoading={isLoadingOrders}
                        />
                    </div>
                </main>
            </div>
        </>
    );
};

export const DashboardPage = () => {
    return (
        <CreateOrderProvider onOrderCreated={() => window.location.reload()}>
            <DashboardContent />
        </CreateOrderProvider>
    );
};
