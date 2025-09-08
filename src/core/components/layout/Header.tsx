import { useState } from 'react';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Button } from '@/core/components/ui/button';
import { LogOut, Smartphone, Menu, X, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { ProfileModal } from '@/core/components/modals/ProfileModal';
import { LanguageSwitcher } from '@/core/components/ui/language-switcher';
import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';

export const Header = () => {
    const { data: user, isLoading } = useGetMe();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSmsLoginModalOpen, setIsSmsLoginModalOpen] = useState(false);

    const handleLogout = () => {
        // Очищаем токены из localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        setIsMobileMenuOpen(false);
        toast.success('До свидания!', {
            description: 'Вы успешно вышли из системы',
            duration: 3000,
        });
        navigate('/');

        // Перезагружаем страницу для очистки кэша React Query
        window.location.reload();
    };

    const handleLogin = () => {
        setIsMobileMenuOpen(false);
        setIsSmsLoginModalOpen(true);
    };

    const handleDashboard = () => {
        setIsMobileMenuOpen(false);
        navigate('/dashboard');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    return (
        <header className="bg-card border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <img
                            src="/icons/logo.png"
                            alt="ЧистоДом"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                    </button>

                    {/* Десктопная навигация */}
                    <div className="hidden md:flex items-center gap-2">

                        {!user ? (
                            // Неавторизованный пользователь
                            <Button
                                onClick={handleLogin}
                                className="flex items-center gap-2"
                                data-testid="sms-login-button"
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
                                <button
                                    onClick={handleProfileClick}
                                    className="flex items-center gap-3 mr-4 hover:bg-muted/50 rounded-lg p-2 transition-colors"
                                >
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
                                </button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDashboard}
                                    className="flex items-center gap-2"
                                >
                                    <Home className="h-4 w-4" />
                                    Личный кабинет
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 "
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
                            {/* <div className="flex justify-center mb-2">
                                <LanguageSwitcher />
                            </div> */}
                            {!user ? (
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
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center gap-3 px-3 py-2 border-b border-border mb-2 w-full hover:bg-muted/50 rounded-lg transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-foreground">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.role === 'customer' ? 'Клиент' :
                                                    user.role === 'currier' ? 'Курьер' :
                                                        user.role === 'admin' ? 'Администратор' : user.role}
                                            </p>
                                        </div>
                                    </button>

                                    <Button
                                        onClick={handleDashboard}
                                        className="w-full justify-start flex items-center gap-2"
                                        variant="ghost"
                                    >
                                        <Home className="h-4 w-4" />
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

            {/* Profile Modal */}
            {user && (
                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={user}
                />
            )}

            {/* SMS Login Modal */}
            <SmsLoginModal
                isOpen={isSmsLoginModalOpen}
                onClose={() => setIsSmsLoginModalOpen(false)}
            />
        </header>
    );
};
