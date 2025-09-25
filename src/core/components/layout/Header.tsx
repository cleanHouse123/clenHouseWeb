import { useState } from 'react';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Button } from '@/core/components/ui/button';
import { LogOut, Menu, X, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { ProfileModal } from '@/core/components/modals/ProfileModal';
import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';
import { LogoHouse } from '@/core/components/ui/icons';

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

    const handleCallCourier = () => {
        setIsMobileMenuOpen(false);
        if (user) {
            navigate('/orders');
        } else {
            setIsSmsLoginModalOpen(true);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    const menuItems = [
        { key: 'how-it-works', label: 'Как это работает', href: '#how-it-works' },
        { key: 'areas', label: 'Зоны обслуживания', href: '#service-areas' },
        { key: 'subscription', label: 'Подписка', href: '#subscription' },
        { key: 'faq', label: 'FAQ', href: '#faq' },
    ];

    return (
        <header className="bg-transparent border-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Белая капсула TopNav */}
                <div className="mt-3 mb-3 sm:mt-4 sm:mb-4 bg-white rounded-lg [--radius:1rem] px-3 py-2 sm:px-2 sm:py-[9px] shadow-sm border border-[rgba(0,0,0,0.06)] font-onest">
                <div className="flex justify-between items-center h-14">
                    {/* Логотип */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        aria-label="ЧистоДома — на главную"
                    >
                        <span className="flex items-center gap-1 pl-1 sm:pl-2 font-bold tracking-tight font-onest text-xl sm:text-2xl lg:text-[24.76px] leading-[1] text-[#000000]">
                            <span>чисто</span>
                            <LogoHouse className="mx-1 w-7 h-6 sm:w-8 sm:h-7 lg:w-auto lg:h-auto" />
                            <span>дома</span>
                        </span>
                    </button>

                    {/* Центральное меню (десктоп) */}
                    <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                        {menuItems.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                className="text-[rgba(0,0,0,0.9)] text-sm xl:text-base leading-[1.4] font-normal transition-colors hover:text-primary whitespace-nowrap"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Десктопная навигация */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            onClick={handleCallCourier}
                            className="rounded-lg [--radius:12px] bg-primary text-primary-foreground hover:bg-[hsl(var(--accent))] px-4 py-2 text-sm md:px-5 md:py-2.5 lg:px-6 lg:py-3 lg:text-base whitespace-nowrap"
                        >
                            Вызвать курьера
                        </Button>

                        {!user ? (
                            // Неавторизованный пользователь
                            <Button
                                onClick={handleLogin}
                                className="flex items-center gap-2 rounded-lg [--radius:10px] border-[1.5px] border-primary text-primary hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] hover:bg-white px-4 py-2 text-sm md:px-5 md:py-2.5 lg:px-5 lg:py-3 lg:text-base bg-white font-medium leading-[1.4] disabled:border-[#999999] disabled:text-[#999999] whitespace-nowrap"
                                data-testid="sms-login-button"
                            >
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
                    <div className="sm:hidden">
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
                    <div className="sm:hidden border-t border-border bg-card">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Мобильное меню: пункты навигации */}
                            <div className="px-1 py-1">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-lg text-[rgba(0,0,0,0.9)] hover:bg-muted/50"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>

                            <Button
                                onClick={handleCallCourier}
                                className="w-full justify-start flex items-center gap-2 rounded-lg [--radius:12px] bg-primary text-primary-foreground hover:bg-[hsl(var(--accent))]"
                            >
                                Вызвать курьера
                            </Button>

                            {!user ? (
                                // Неавторизованный пользователь
                                <Button
                                    onClick={handleLogin}
                                    className="w-full justify-start flex items-center gap-2"
                                    variant="ghost"
                                >
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
            </div>

            {/* Profile Modal */}
            {user ? (
                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={user}
                />
            ) : null}

            {/* SMS Login Modal */}
            <SmsLoginModal
                isOpen={isSmsLoginModalOpen}
                onClose={() => setIsSmsLoginModalOpen(false)}
            />
        </header>
    );
};
