import { Button } from "@/core/components/ui/button";
import { Header } from "@/core/components/layout/Header";
import { Card, CardContent } from "@/core/components/ui/card";
import { Smartphone, Sparkles, ArrowRight, Shield, Clock, Users, CheckCircle, Star, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetMe();

  const handleSmsLogin = () => {
    // Открываем модальное окно SMS логина через Header
    const loginButton = document.querySelector('[data-testid="sms-login-button"]') as HTMLButtonElement;
    if (loginButton) {
      loginButton.click();
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center p-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Анимированный заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
              ЧистоДом
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Современная платформа для управления клининговыми услугами с удобной системой заказов и подписок.
              </p>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {user ? (
                  `Добро пожаловать, ${user.name}! Управляйте своими заказами и подписками в удобном интерфейсе.`
                ) : (
                  'Простой вход по SMS, быстрая авторизация и полный контроль над вашими услугами в одном приложении.'
                )}
              </p>
            </motion.div>
          </motion.div>

          {/* Анимированная кнопка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {!isLoading && (
              <Button
                onClick={user ? handleDashboard : handleSmsLogin}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {user ? (
                  <>
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    Панель управления
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </>
                ) : (
                  <>
                    <Smartphone className="h-5 w-5 mr-3" />
                    Войти по SMS
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Информационные блоки */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Мы делаем клининговые услуги простыми, быстрыми и доступными для каждого
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Блок 1: Быстрота и удобство */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Clock className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Быстро и удобно</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Создавайте заказы за несколько кликов. Наша система автоматически подберет
                    подходящего курьера и рассчитает оптимальное время выполнения.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Мгновенное подтверждение</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Блок 2: Безопасность */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Shield className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Безопасность и надежность</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Все платежи защищены современными методами шифрования.
                    SMS-авторизация обеспечивает максимальную безопасность ваших данных.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Защищенные платежи</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Блок 3: Подписки */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Users className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Гибкие подписки</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Оформите подписку на регулярные услуги и получайте скидки.
                    Управляйте подписками в личном кабинете в любое время.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 text-purple-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Экономия до 30%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Дополнительные анимированные элементы */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="py-16 bg-gradient-to-r from-blue-50 to-green-50"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                Присоединяйтесь к тысячам довольных клиентов
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Быстро</span>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Безопасно</span>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Удобно</span>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }}
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Качественно</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
