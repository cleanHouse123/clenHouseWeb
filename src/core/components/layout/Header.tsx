import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Button } from '@/core/components/ui/button/button';
import { Card } from '@/core/components/ui/card';
import { LogOut, Menu, X, User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingIndicator } from '@/core/components/ui/loading/LoadingIndicator';
import { ProfileModal } from '@/core/components/modals/ProfileModal';
import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';
import { Logo } from '@/core/components/ui';

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
        { key: 'faq', label: 'FAQ', href: '#faq' },
    ];

    const handleScrollToSection = (href: string) => {
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            const headerHeight = 100; // Высота header + отступ
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-transparent border-0 relative z-40">
            <div className="mx-auto px-4 sm:px-8 lg:px-16 pt-5">
                {/* Белая капсула TopNav */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Card radius="r16" padding="sm" background="white" className="px-3 py-2 sm:px-2 sm:py-[9px] font-onest hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center h-14">
                    {/* Логотип */}
                    <motion.div 
                        className="pl-1 sm:pl-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Logo 
                            size="lg" 
                            onClick={() => navigate('/')} 
                        />
                    </motion.div>

                    {/* Центральное меню (десктоп) */}
                    <nav className="hidden md:flex items-center gap-4 xl:gap-6">
                        {menuItems.map((item, index) => (
                            <motion.button
                                key={item.key}
                                onClick={() => handleScrollToSection(item.href)}
                                className="text-[rgba(0,0,0,0.9)] text-sm xl:text-base leading-[1.4] font-normal transition-colors hover:text-primary whitespace-nowrap"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                                whileHover={{ y: -2 }}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </nav>

                    {/* Десктопная навигация */}
                    <motion.div 
                        className="hidden md:flex items-center gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={handleCallCourier}
                                variant="primary"
                                size="lg"
                                className="whitespace-nowrap"
                            >
                                Вызвать курьера
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            {!user ? (
                                // Неавторизованный пользователь
                                <Button
                                    onClick={handleLogin}
                                    variant="outline"
                                    size="lg"
                                    className="flex items-center gap-2 whitespace-nowrap"
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
                                    size="md"
                                    onClick={handleDashboard}
                                    className="flex items-center gap-2"
                                >
                                    <Home className="h-4 w-4" />
                                    Личный кабинет
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="md"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2"
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
                                    size="md"
                                    onClick={handleLogin}
                                    className="flex items-center gap-2"
                                >
                                    Войти
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="md"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-destructive hover:text-destructive/80"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Выйти
                                </Button>
                            </div>
                        )}
                        </motion.div>
                    </motion.div>

                    {/* Мобильная кнопка меню */}
                    <motion.div 
                        className="md:hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMobileMenu}
                                className="p-2"
                            >
                                <motion.div
                                    animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                    </div>
                </Card>

                {/* Мобильное меню */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Card radius="r16" padding="sm" background="white" className="md:hidden mt-2 px-3 py-2 font-onest relative z-50">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Мобильное меню: пункты навигации */}
                            <div className="px-1 py-1">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        key={item.key}
                                        onClick={() => handleScrollToSection(item.href)}
                                        className="block w-full text-left px-3 py-2 rounded-lg text-[rgba(0,0,0,0.9)] hover:bg-muted/50 transition-colors"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        whileTap={{ scale: 0.95, backgroundColor: "rgba(0,0,0,0.1)" }}
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    onClick={handleCallCourier}
                                    variant="primary"
                                    size="lg"
                                    className="w-full justify-start flex items-center gap-2"
                                >
                                    Вызвать курьера
                                </Button>
                            </motion.div>

                            {!user ? (
                                // Неавторизованный пользователь
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={handleLogin}
                                        variant="outline"
                                        size="lg"
                                        className="w-full justify-start flex items-center gap-2"
                                    >
                                        Войти
                                    </Button>
                                </motion.div>
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

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={handleDashboard}
                                            variant="outline"
                                            size="lg"
                                            className="w-full justify-start flex items-center gap-2"
                                        >
                                            <Home className="h-4 w-4" />
                                            Личный кабинет
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={handleLogout}
                                            variant="ghost"
                                            size="lg"
                                            className="w-full justify-start flex items-center gap-2 text-destructive hover:text-destructive/80"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Выйти
                                        </Button>
                                    </motion.div>
                                </>
                            ) : (
                                // Ошибка загрузки данных пользователя
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={handleLogin}
                                            variant="outline"
                                            size="lg"
                                            className="w-full justify-start flex items-center gap-2"
                                        >
                                            Войти
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={handleLogout}
                                            variant="ghost"
                                            size="lg"
                                            className="w-full justify-start flex items-center gap-2 text-destructive hover:text-destructive/80"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Выйти
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
                </motion.div>
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
