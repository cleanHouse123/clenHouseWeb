import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/core/components/ui/button/button';
import { Card } from '@/core/components/ui/card';

interface HeroSectionProps {
  onCallCourier: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCallCourier }) => {
  return (
    <section className="relative bg-background  pt-[102px] sm:pt-[48px] md:pt-[58px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-8 mt-12 md:mt-24">
        <Card radius="r40" padding="xl" background="white" className="relative overflow-visible">
          <div
            className="hidden tablet:block absolute right-0 top-0 bottom-0 w-1/2 rounded-r-[40px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/room.webp')" }}
          />

          <div className="hidden tablet:block absolute right-0 top-0 bottom-0 w-1/2 rounded-r-[40px] bg-gradient-to-r from-white via-white/50 to-transparent z-10" />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 1.5,
                delay: 1.0,
                ease: "easeOut"
              }
            }}
            className="hidden tablet:block absolute -right-6 bottom-0 tablet:w-[600px] tablet:h-[780px] semi-lg:w-[620px] semi-lg:h-[770px] semi-lg2:w-[650px] semi-lg2:h-[780px] lg:w-[645px] lg:h-[920px] xl:w-[610px] xl:h-[980px] semi-xl:w-[680px] semi-xl:h-[560px] bg-contain bg-bottom bg-no-repeat z-30"
            style={{ backgroundImage: "url('/images/girl-hero.webp')" }}
          />

          <div className="relative z-20 w-full tablet:w-1/2 max-w-[680px] flex flex-col gap-6 tablet:gap-8">
            <div className="flex flex-col gap-4 tablet:gap-5">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[24px] sm:text-[30px] md:text-[30px] tablet:text-[30px] semi-lg:text-[33px] semi-lg2:text-[37px] lg:text-[40px] xl:text-[42px] semi-xl:text-[45px] font-medium font-onest text-[#000000] leading-[1.1em] lg:leading-[1em]"
              >
                ЧистоДома — вынос мусора от двери до контейнера
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-[16px] sm:text-[17px] md:text-[17px] tablet:text-[17px] semi-lg:text-[18px] semi-lg2:text-[19px] lg:text-[19px] xl:text-[19px] semi-xl:text-[20px] font-normal font-onest text-[rgba(0,0,0,0.7)] leading-[1.4em]"
              >
                Курьерская служба по выносу мусора в Санкт-Петербурге и Ленинградской области. Курьер забирает пакет у двери и доносит его до контейнера дома. В квартиру не входит. Цену называем после адреса.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              <Button
                onClick={onCallCourier}
                variant="primary"
                size="lg"
                className="font-onest w-full sm:w-fit hover:scale-105 transition-transform duration-200"
              >
                Указать адрес
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="tablet:hidden relative -mx-12 w-[calc(100%+6rem)] h-[400px] -mb-12 rounded-b-[40px] overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/room.webp')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-transparent z-[5]" />
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 1.5,
                    delay: 1.0,
                    ease: "easeOut"
                  }
                }}
                className="absolute inset-0 bg-contain bg-bottom bg-no-repeat z-10"
                style={{ backgroundImage: "url('/images/girl-hero.webp')" }}
              />
            </motion.div>
          </div>
        </Card>
      </div>
    </section>
  );
};
