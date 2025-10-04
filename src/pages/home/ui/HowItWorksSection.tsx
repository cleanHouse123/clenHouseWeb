import React from 'react';
import { Card } from '@/core/components/ui/card';

const IMAGE_VERSION = '?v=2';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mx-auto text-center flex flex-col items-center gap-4 max-w-[850px] px-2">
          <h2 className="text-[28px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium font-onest leading-[1.2] text-[#000]">
            Как это работает?
          </h2>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)]">
            Простая авторизация по номеру телефона и удобный личный кабинет
          </p>
        </div>

        {/* Шаги */}
        <div className="mt-[42px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: 'Шаг 1', text: 'Войдите с помощью номера телефона\nи кода из SMS', image: `/images/step1.png${IMAGE_VERSION}` },
            { step: 'Шаг 2', text: 'Создайте первый заказ в личном кабинете', image: `/images/step2.png${IMAGE_VERSION}` },
            { step: 'Шаг 3', text: 'Оплатите единоразово или подпиской', image: `/images/step3.png${IMAGE_VERSION}` },
            { step: 'Шаг 4', text: 'Передайте мусор курьеру в выбранное время заказа', image: `/images/step4.png${IMAGE_VERSION}` },
          ].map(({ step, text, image }, idx) => (
            <Card key={idx} radius="r20" padding="none" background="white" className="w-full flex flex-col items-center gap-[30px] py-7 px-5">
              {/* Изображение 141x141 */}
              <img 
                src={image} 
                alt={step} 
                className="w-[141px] h-[141px] rounded-[12px] object-cover" 
              />
              <div className="flex flex-col items-center gap-[10px] text-center">
                <div className="text-[16px] font-medium font-onest leading-[1.4] text-[#FF5D00]">{step}</div>
                <div className="text-[18px] sm:text-[19px] md:text-[20px] lg:text-[22px] font-medium font-onest leading-[1.2] text-[#000] whitespace-pre-line">{text}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};


