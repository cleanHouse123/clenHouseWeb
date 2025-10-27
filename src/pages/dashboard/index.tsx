import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useCustomerOrders } from '@/modules/orders/hooks/useOrders';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { WelcomeSection } from './components/WelcomeSection';
import { RecentOrders } from './components/RecentOrders';
import { QuickActions } from './components/QuickActions';
import { CreateOrderProvider } from '@/core/contexts/CreateOrderContext';

const DashboardContent = () => {
    const { data: user, isLoading: isLoadingUser, error } = useGetMe();
    const { data: customerOrders, isLoading: isLoadingOrders } = useCustomerOrders();

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
        <div className="min-h-screen ">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <WelcomeSection userName={user.name} />

                {/* Quick Actions */}
                <div className="mb-8">
                    <QuickActions />
                </div>

                {/* Recent Orders */}
                <div className="max-w-4xl">
                    <RecentOrders
                        orders={customerOrders || []}
                        isLoading={isLoadingOrders}
                    />
                </div>
            </main>
        </div>
    );
};

export const DashboardPage = () => {
    return (
        <CreateOrderProvider onOrderCreated={() => window.location.reload()}>
            <DashboardContent />
        </CreateOrderProvider>
    );
};
