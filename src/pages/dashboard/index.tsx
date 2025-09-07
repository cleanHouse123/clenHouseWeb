import { useAuthStore } from '@/modules/auth/store/authStore';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Header } from '@/core/components/layout/Header';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import {
    User,
    Phone,
    Mail,
    Calendar,
    Settings,
    Package,
    CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const DashboardPage = () => {
    const { clearUser } = useAuthStore();
    const { data: user, isLoading, error } = useGetMe();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        toast.success('До свидания!', {
            description: 'Вы успешно вышли из системы',
            duration: 3000,
        });
        navigate('/');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Показываем загрузку
    if (isLoading) {
        return <LoadingIndicator />;
    }

    // Показываем ошибку
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-destructive mb-2">
                                Ошибка загрузки данных
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Не удалось загрузить информацию о пользователе
                            </p>
                            <Button onClick={() => window.location.reload()}>
                                Попробовать снова
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Если нет данных пользователя
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-destructive mb-2">
                                Пользователь не найден
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Данные пользователя не найдены
                            </p>
                            <Button onClick={handleLogout}>
                                Выйти из системы
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Info */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Информация о профиле
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Имя
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground">{user?.name}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Роль
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Settings className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground capitalize">
                                                {user?.role === 'customer' ? 'Клиент' :
                                                    user?.role === 'currier' ? 'Курьер' :
                                                        user?.role === 'admin' ? 'Администратор' : user?.role}
                                            </span>
                                        </div>
                                    </div>

                                    {user?.phone && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Телефон
                                            </label>
                                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-foreground">{user.phone}</span>
                                                {user.isPhoneVerified && (
                                                    <span className="text-green-600 text-xs">✓ Подтвержден</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {user?.email && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </label>
                                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-foreground">{user.email}</span>
                                                {user.isEmailVerified && (
                                                    <span className="text-green-600 text-xs">✓ Подтвержден</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Последний вход
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground">
                                                {user?.lastLoginAt ? formatDate(user.lastLoginAt.toString()) : 'Неизвестно'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Дата регистрации
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground">
                                                {user?.createdAt ? formatDate(user.createdAt.toString()) : 'Неизвестно'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Быстрые действия</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate('/orders/new')}
                                >
                                    <Package className="h-4 w-4 mr-2" />
                                    Создать заказ
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate('/subscriptions')}
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Подписки
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate('/profile/edit')}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Редактировать профиль
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Статистика</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Всего заказов</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Активных подписок</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Потрачено</span>
                                    <span className="font-semibold">0 ₽</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};
