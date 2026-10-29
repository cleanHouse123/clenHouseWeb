import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from './HeroSection';
import { PriceSection } from './PriceSection';
import { BenefitsSection } from './BenefitsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { SubscriptionPlansSection } from './SubscriptionPlansSection';
import { FAQSection } from './FAQSection';

const TAB_TITLE = 'ЧистоДома — курьер забирает пакет у двери и в квартиру не входит';
const SERVICE_DESCRIPTION = 'ЧистоДома — курьерская служба по выносу мусора в Санкт-Петербурге и Ленинградской области. Курьер забирает пакет у двери и доносит его до контейнера дома. В квартиру не входит.';

interface MainSectionProps {
  onCallCourier: () => void;
}

export const MainSection: React.FC<MainSectionProps> = ({ onCallCourier }) => {
  return (
    <>
      <Helmet>
        {/* Основные SEO мета-теги */}
        <title>{TAB_TITLE}</title>
        <meta name="description" content={SERVICE_DESCRIPTION} />
        <meta name="keywords" content="вынос мусора, курьерская служба, курьер, пакет у двери, ЧистоДома, Санкт-Петербург, Ленинградская область, СПб" />

        {/* Open Graph мета-теги для социальных сетей */}
        <meta property="og:title" content={TAB_TITLE} />
        <meta property="og:description" content={SERVICE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xn--80ad4adfbofbt7f.xn--p1ai" />
        <meta property="og:image" content="https://xn--80ad4adfbofbt7f.xn--p1ai/images/og-image.jpg" />
        <meta property="og:site_name" content="ЧистоДома" />

        {/* Twitter Card мета-теги */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TAB_TITLE} />
        <meta name="twitter:description" content={SERVICE_DESCRIPTION} />
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
            "description": SERVICE_DESCRIPTION,
            "url": "https://xn--80ad4adfbofbt7f.xn--p1ai",
            "logo": "https://xn--80ad4adfbofbt7f.xn--p1ai/images/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+78007756365",
              "contactType": "customer service",
              "areaServed": "RU"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Санкт-Петербург",
              "addressRegion": "Санкт-Петербург",
              "addressCountry": "RU"
            },
            "areaServed": [
              { "@type": "City", "name": "Санкт-Петербург" },
              { "@type": "AdministrativeArea", "name": "Ленинградская область" }
            ],
            "sameAs": [
              "https://t.me/chistodoma1"
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Вынос мусора в Санкт-Петербурге",
            "description": "Курьерская служба по выносу мусора: пакет забирают у двери и доносят до контейнера дома. В квартиру не входит. Цену называют после адреса.",
            "provider": {
              "@type": "Organization",
              "name": "ЧистоДома",
              "telephone": "+78007756365"
            },
            "areaServed": [
              { "@type": "City", "name": "Санкт-Петербург" },
              { "@type": "AdministrativeArea", "name": "Ленинградская область" }
            ]
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
