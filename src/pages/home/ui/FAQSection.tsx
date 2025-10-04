import React from 'react';
import { Card } from '@/core/components/ui/card';

interface FAQItem { question: string; answer: string; }

const FAQ_DATA: FAQItem[] = [
  { question: 'Как я могу заказать вызов мусора?', answer: 'Оформите заказ в личном кабинете: укажите адрес и время. Курьер подтвердит время и приедет в выбранный слот.' },
  { question: 'Какие есть способы оплаты?', answer: 'Доступна безопасная оплата картой на сайте. Также поддерживается подписка с автоплатежом.' },
  { question: 'Как быстро приедет курьер?', answer: 'Обычно в день заказа. Точный слот времени подтверждается после оформления в личном кабинете.' },
  { question: 'Хочу связаться с поддержкой', answer: 'Напишите на help@chistodoma.ru или позвоните по номеру, указанному в подвале сайта.' },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const toggle = (idx: number) => setOpenIndex(prev => (prev === idx ? null : idx));

  return (
    <section id="faq" className="pt-[40px] sm:pt-[60px] md:pt-[80px] lg:pt-[100px]">
      <div className="mx-auto px-4 sm:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <h2 className="text-[28px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium font-onest leading-[1.2] text-[#000]">
            Часто задаваемые вопросы
          </h2>
        </div>

        {/* Список FAQ строго по Figma: радиус 20px, паддинги 24/16, gap 90px, плюс 48px */}
        <div className="flex flex-col gap-2">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Card key={index} radius="r20" padding="none" background="white" className="pl-6 pr-4 py-4">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-[90px] text-left"
                >
                  <div className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-medium font-onest leading-[1.2] text-[#000]">
                    {item.question}
                  </div>
                  {/* Плюс/минус 24px в контейнере 48px */}
                  <div className="w-12 h-12 flex items-center justify-center" aria-hidden>
                    {isOpen ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20" stroke="#FF5D00" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20" stroke="#FF5D00" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M4 12H20" stroke="#FF5D00" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="mt-2 pr-8">
                    <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-normal font-onest leading-[1.4] text-[rgba(0,0,0,0.7)]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};


