import React from 'react';
import { Button } from '@/core/components/ui/button/button';
import { Card } from '@/core/components/ui/card';

interface HeroSectionProps {
  onCallCourier: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCallCourier }) => {
  return (
    <section className="relative bg-background pt-[32px] sm:pt-[48px] md:pt-[58px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-16">
        <Card radius="r40" padding="xl" background="white" className="relative overflow-visible">
          <div
            className="hidden tablet:block absolute right-0 top-0 bottom-0 w-1/2 rounded-r-[40px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/room.png')" }}
          />
          
          <div className="hidden tablet:block absolute right-0 top-0 bottom-0 w-1/2 rounded-r-[40px] bg-gradient-to-r from-white via-white/50 to-transparent z-10" />
          
          <div
            className="hidden tablet:block absolute -right-2 bottom-0 tablet:w-[465px] tablet:h-[600px] semi-lg:w-[480px] semi-lg:h-[595px] semi-lg2:w-[500px] semi-lg2:h-[590px] lg:w-[500px] lg:h-[585px] xl:w-[500px] xl:h-[585px] semi-xl:w-[435px] semi-xl:h-[580px] bg-contain bg-bottom bg-no-repeat z-30"
            style={{ backgroundImage: "url('/images/girl-hero.png')" }}
          />
          
          <div className="relative z-20 w-full tablet:w-1/2 flex flex-col gap-6 tablet:gap-8">
            <div className="flex flex-col gap-4 tablet:gap-5">
              <h1 className="text-[28px] sm:text-[30px] md:text-[30px] tablet:text-[30px] semi-lg:text-[33px] semi-lg2:text-[37px] lg:text-[40px] xl:text-[42px] semi-xl:text-[45px] font-medium font-onest text-[#000000] leading-[1.1em] lg:leading-[1em]">
                Выброс мусора и клининговые услуги в Санкт‑Петербурге
              </h1>
              
              <p className="text-[16px] sm:text-[17px] md:text-[17px] tablet:text-[17px] semi-lg:text-[18px] semi-lg2:text-[19px] lg:text-[19px] xl:text-[19px] semi-xl:text-[20px] font-normal font-onest text-[rgba(0,0,0,0.7)] leading-[1.4em]">
                ЧистоДома — современная платформа для заказа клининга онлайн с удобным личным кабинетом и системой подписки
              </p>
            </div>
            
            <Button
              onClick={onCallCourier}
              variant="primary"
              size="lg"
              className="font-onest w-full sm:w-fit"
            >
              Вызвать курьера
            </Button>
            
            <div className="tablet:hidden relative -mx-12 w-[calc(100%+6rem)] h-[400px] -mb-12 rounded-b-[40px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/room.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-transparent z-[5]" />
              <div
                className="absolute inset-0 bg-contain bg-bottom bg-no-repeat z-10"
                style={{ backgroundImage: "url('/images/girl-hero.png')" }}
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
