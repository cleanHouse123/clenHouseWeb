import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from './HeroSection';
import { PriceSection } from './PriceSection';
import { BenefitsSection } from './BenefitsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { FAQSection } from './FAQSection';
import { useOrderPrice } from '@/modules/price';
import { kopecksToRublesNumber } from '@/core/utils/priceUtils';


interface MainSectionProps {
  onCallCourier: () => void;
}

export const MainSection: React.FC<MainSectionProps> = ({ onCallCourier }) => {
  const { orderPrice, isLoading } = useOrderPrice();

  // Используем цену с бэкенда или fallback на 149
  const currentPrice = orderPrice ? kopecksToRublesNumber(orderPrice.priceInKopecks) : 149;
  const priceText = isLoading ? '149' : currentPrice.toString();

  return (
    <>
      <Helmet>
        {/* Основные SEO мета-теги */}
        <title>ЧистоДома - Вынос мусора за {priceText}₽ | Клининговые услуги в Санкт-Петербурге</title>
        <meta name="description" content={`ЧистоДома - современный сервис выноса мусора и клининговых услуг в Санкт-Петербурге. Первый вынос мусора всего за ${priceText}₽. Быстро, удобно, надежно. Закажите курьера онлайн!`} />
        <meta name="keywords" content="вынос мусора, клининг, уборка, курьер, мусор, бытовые отходы, ЧистоДома, Санкт-Петербург, СПб, онлайн заказ" />

        {/* Open Graph мета-теги для социальных сетей */}
        <meta property="og:title" content={`ЧистоДома - Вынос мусора за ${priceText}₽ | Клининговые услуги в Санкт-Петербурге`} />
        <meta property="og:description" content={`Современный сервис выноса мусора и клининговых услуг в Санкт-Петербурге. Первый вынос мусора всего за ${priceText}₽. Быстро, удобно, надежно.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xn--80ad4adfbofbt7f.xn--p1ai" />
        <meta property="og:image" content="https://xn--80ad4adfbofbt7f.xn--p1ai/images/og-image.jpg" />
        <meta property="og:site_name" content="ЧистоДома" />

        {/* Twitter Card мета-теги */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`ЧистоДома - Вынос мусора за ${priceText}₽ в Санкт-Петербурге`} />
        <meta name="twitter:description" content={`Современный сервис выноса мусора и клининговых услуг в Санкт-Петербурге. Первый вынос мусора всего за ${priceText}₽.`} />
        <meta name="twitter:image" content="https://xn--80ad4adfbofbt7f.xn--p1ai/images/twitter-image.jpg" />

        {/* Дополнительные SEO мета-теги */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ЧистоДома" />
        <meta name="language" content="ru" />
        <meta name="geo.region" content="RU-SPE" />
        <meta name="geo.placename" content="Санкт-Петербург" />

        {/* Структурированные данные JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ЧистоДома",
            "description": "Сервис выноса мусора и клининговых услуг в Санкт-Петербурге",
            "url": "https://xn--80ad4adfbofbt7f.xn--p1ai",
            "logo": "https://xn--80ad4adfbofbt7f.xn--p1ai/images/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+7-XXX-XXX-XXXX",
              "contactType": "customer service"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Санкт-Петербург",
              "addressCountry": "RU"
            },
            "areaServed": {
              "@type": "City",
              "name": "Санкт-Петербург"
            },
            "sameAs": [
              "https://vk.com/cleanhouse",
              "https://t.me/cleanhouse"
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Вынос мусора в Санкт-Петербурге",
            "description": "Услуга выноса бытового мусора в Санкт-Петербурге",
            "provider": {
              "@type": "Organization",
              "name": "ЧистоДома"
            },
            "areaServed": {
              "@type": "City",
              "name": "Санкт-Петербург"
            },
            "offers": {
              "@type": "Offer",
              "price": priceText,
              "priceCurrency": "RUB",
              "description": "Первый вынос мусора со скидкой 50%"
            }
          })}
        </script>
      </Helmet>

      <main className="bg-background">
        <HeroSection onCallCourier={onCallCourier} />
        {/* <PriceSection onCallCourier={onCallCourier} /> */}
        <BenefitsSection />
        <HowItWorksSection />
        <SubscriptionPlansSection />
        <FAQSection />
      </main>
    </>
  );
};
