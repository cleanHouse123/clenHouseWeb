import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { useCustomerOrders } from '@/modules/orders/hooks/useOrders';
import { Header } from '@/core/components/layout/Header';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { QuickActions } from './components/QuickActions';
import { RecentOrders } from './components/RecentOrders';

export const DashboardPage = () => {
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
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Добро пожаловать, {user.name}!
                    </h1>
                    <p className="text-gray-600">
                        Управляйте своими заказами и подписками
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Orders */}
                    <div className="lg:col-span-2">
                        <RecentOrders
                            orders={customerOrders?.orders || []}
                            isLoading={isLoadingOrders}
                        />
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div>
                        <QuickActions />
                    </div>
                </div>
            </main>
        </div>
    );
};
