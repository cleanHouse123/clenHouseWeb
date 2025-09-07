import { Button } from "@/core/components/ui/button";
import { Header } from "@/core/components/layout/Header";
import { Smartphone, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSmsLogin = () => {
    navigate("/sms-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary">
      <Header />
      <div className="flex flex-col justify-center items-center p-6 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Анимированный заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Clean House
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Современная платформа для управления клининговыми услугами с удобной системой заказов и подписок.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Простой вход по SMS, быстрая авторизация и полный контроль над вашими услугами в одном приложении.
              </p>
            </motion.div>
          </motion.div>

          {/* Анимированная кнопка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={handleSmsLogin}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Smartphone className="h-5 w-5 mr-3" />
              Войти по SMS
              <ArrowRight className="h-5 w-5 ml-3" />
            </Button>
          </motion.div>

          {/* Дополнительные анимированные элементы */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 flex justify-center items-center gap-8 text-muted-foreground"
          >
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};
