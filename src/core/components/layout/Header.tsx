import { useState } from 'react';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Button } from '@/core/components/ui/button';
import { User, LogOut, Smartphone, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';

export const Header = () => {
    const { accessToken, clearUser } = useAuthStore();
    const { data: user, isLoading } = useGetMe();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        clearUser();
        setIsMobileMenuOpen(false);
        toast.success('До свидания!', {
            description: 'Вы успешно вышли из системы',
            duration: 3000,
        });
        navigate('/');
    };

    const handleLogin = () => {
        setIsMobileMenuOpen(false);
        navigate('/sms-login');
    };

    const handleDashboard = () => {
        setIsMobileMenuOpen(false);
        navigate('/dashboard');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-card border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold text-foreground">
                                Clean House
                            </h1>
                        </div>
                    </div>

                    {/* Десктопная навигация */}
                    <div className="hidden md:flex items-center gap-2">
                        {!accessToken ? (
                            // Неавторизованный пользователь
                            <Button
                                onClick={handleLogin}
                                className="flex items-center gap-2"
                            >
                                <Smartphone className="h-4 w-4" />
                                Войти
                            </Button>
                        ) : isLoading ? (
                            // Загрузка данных пользователя
                            <div className="flex items-center gap-2">
                                <LoadingIndicator />
                                <span className="text-sm text-muted-foreground">Загрузка...</span>
                            </div>
                        ) : user ? (
                            // Авторизованный пользователь
                            <>
                                <div className="flex items-center gap-3 mr-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.role === 'customer' ? 'Клиент' :
                                                user.role === 'currier' ? 'Курьер' :
                                                    user.role === 'admin' ? 'Администратор' : user.role}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDashboard}
                                    className="flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Личный кабинет
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-destructive hover:text-destructive/80"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            // Ошибка загрузки данных пользователя
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogin}
                                    className="flex items-center gap-2"
                                >
                                    <Smartphone className="h-4 w-4" />
                                    Войти
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-destructive hover:text-destructive/80"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Выйти
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Мобильная кнопка меню */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Мобильное меню */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border bg-card">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {!accessToken ? (
                                // Неавторизованный пользователь
                                <Button
                                    onClick={handleLogin}
                                    className="w-full justify-start flex items-center gap-2"
                                    variant="ghost"
                                >
                                    <Smartphone className="h-4 w-4" />
                                    Войти
                                </Button>
                            ) : isLoading ? (
                                // Загрузка данных пользователя
                                <div className="flex items-center justify-center gap-2 py-2">
                                    <LoadingIndicator />
                                    <span className="text-sm text-muted-foreground">Загрузка...</span>
                                </div>
                            ) : user ? (
                                // Авторизованный пользователь
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2 border-b border-border mb-2">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.role === 'customer' ? 'Клиент' :
                                                    user.role === 'currier' ? 'Курьер' :
                                                        user.role === 'admin' ? 'Администратор' : user.role}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleDashboard}
                                        className="w-full justify-start flex items-center gap-2"
                                        variant="ghost"
                                    >
                                        <User className="h-4 w-4" />
                                        Личный кабинет
                                    </Button>

                                    <Button
                                        onClick={handleLogout}
                                        className="w-full justify-start flex items-center gap-2 text-destructive hover:text-destructive/80"
                                        variant="ghost"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Выйти
                                    </Button>
                                </>
                            ) : (
                                // Ошибка загрузки данных пользователя
                                <>
                                    <Button
                                        onClick={handleLogin}
                                        className="w-full justify-start flex items-center gap-2"
                                        variant="ghost"
                                    >
                                        <Smartphone className="h-4 w-4" />
                                        Войти
                                    </Button>
                                    <Button
                                        onClick={handleLogout}
                                        className="w-full justify-start flex items-center gap-2 text-destructive hover:text-destructive/80"
                                        variant="ghost"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Выйти
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
