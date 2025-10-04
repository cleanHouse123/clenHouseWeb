import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/core/components/ui/card';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-16">
        {/* Заголовок секции */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-[850px] mx-auto text-center flex flex-col items-center gap-4"
        >
          <h2 className="text-[28px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium font-onest leading-[1.2] text-[#000]">
            Вызов курьера за пару кликов
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)] max-w-[645px]">
            Мы делаем выброс мусора простым, быстрым и комфортным
          </p>
        </motion.div>

        {/* Карточки преимуществ */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {[
            {
              icon: "/icons/benefit-time.svg",
              title: "Быстро и удобно",
              description: "Создавайте заказы за несколько кликов. Наша система автоматически подберет подходящего курьера и рассчитает оптимальное время выполнения.",
              alt: "time"
            },
            {
              icon: "/icons/benefit-security.svg",
              title: "Безопасная оплата",
              description: "Все платежи защищены современными методами шифрования. SMS-авторизация обеспечивает максимальную безопасность ваших данных.",
              alt: "security"
            },
            {
              icon: "/icons/benefit-wallet.svg",
              title: "Выгодная подписка",
              description: "Оформите подписку на регулярные услуги и получайте скидки. Управляйте подписками в личном кабинете в любое время.",
              alt: "wallet"
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="w-full"
            >
              <Card radius="r20" padding="none" background="white" className="w-full flex flex-col items-center gap-4 py-8 px-5 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                {/* Анимированный фон при hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Иконка с вращением и пульсацией */}
                <motion.div 
                  className="w-14 h-14 flex items-center justify-center relative z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: { 
                      duration: 0.8, 
                      delay: index * 0.2 + 0.3,
                      ease: "easeOut"
                    }
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }
                  }}
                >
                  <img src={benefit.icon} alt={benefit.alt} className="w-14 h-14" />
                </motion.div>
                
                <div className="flex flex-col items-center gap-3 flex-1 relative z-10">
                  {/* Заголовок с эффектом печати */}
                  <motion.h3 
                    className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-medium font-onest leading-[1.2] text-[#000] text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ 
                      opacity: 1,
                      transition: { 
                        duration: 0.6, 
                        delay: index * 0.2 + 0.5
                      }
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      color: "#FF5D00",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {benefit.title}
                  </motion.h3>
                  
                  {/* Описание с эффектом появления снизу */}
                  <motion.p 
                    className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)] text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.6, 
                        delay: index * 0.2 + 0.7
                      }
                    }}
                    viewport={{ once: true }}
                  >
                    {benefit.description}
                  </motion.p>
            </div>
                
                {/* Декоративные элементы */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full opacity-0"
                  whileHover={{ 
                    opacity: 1,
                    scale: [1, 1.5, 1],
                    transition: { duration: 0.5 }
                  }}
                />
                <motion.div
                  className="absolute bottom-2 left-2 w-1 h-1 bg-primary/60 rounded-full opacity-0"
                  whileHover={{ 
                    opacity: 1,
                    scale: [1, 2, 1],
                    transition: { duration: 0.5, delay: 0.1 }
                  }}
                />
          </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


