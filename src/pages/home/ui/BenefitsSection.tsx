import React from 'react';
import { Card } from '@/core/components/ui/card';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-16">
        {/* Заголовок секции */}
        <div className="max-w-[850px] mx-auto text-center flex flex-col items-center gap-4">
          <h2 className="text-[28px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium font-onest leading-[1.2] text-[#000]">
            Вызов курьера за пару кликов
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)] max-w-[645px]">
            Мы делаем выброс мусора простым, быстрым и комфортным
          </p>
        </div>

        {/* Карточки преимуществ */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* Card 1 */}
          <Card radius="r20" padding="none" background="white" className="w-full flex flex-col items-center gap-4 py-8 px-5">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/icons/benefit-time.svg" alt="time" className="w-14 h-14" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-medium font-onest leading-[1.2] text-[#000] text-center">
                Быстро и удобно
              </h3>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)] text-center">
                Создавайте заказы за несколько кликов. Наша система автоматически подберет подходящего курьера и рассчитает оптимальное время выполнения.
              </p>
            </div>
          </Card>

          {/* Card 2 */}
          <Card radius="r20" padding="none" background="white" className="w-full flex flex-col items-center gap-4 py-8 px-5">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/icons/benefit-security.svg" alt="security" className="w-14 h-14" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-medium font-onest leading-[1.2] text-[#000] text-center">
                Безопасная оплата
              </h3>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)] text-center">
                Все платежи защищены современными методами шифрования. SMS-авторизация обеспечивает максимальную безопасность ваших данных.
              </p>
            </div>
          </Card>

          {/* Card 3 */}
          <Card radius="r20" padding="none" background="white" className="w-full flex flex-col items-center gap-4 py-8 px-5">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/icons/benefit-wallet.svg" alt="wallet" className="w-14 h-14" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-medium font-onest leading-[1.2] text-[#000] text-center">
                Выгодная подписка
              </h3>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)] text-center">
                Оформите подписку на регулярные услуги и получайте скидки. Управляйте подписками в личном кабинете в любое время.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};


