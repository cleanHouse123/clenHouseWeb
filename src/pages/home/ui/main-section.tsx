import React from 'react';
import { HeroSection } from './HeroSection';
import { BenefitsSection } from './BenefitsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { FAQSection } from './FAQSection';


interface MainSectionProps {
  onCallCourier: () => void;
}

export const MainSection: React.FC<MainSectionProps> = ({ onCallCourier }) => {
  return (
    <main className="bg-background">
      <HeroSection onCallCourier={onCallCourier} />
      <BenefitsSection />
      <HowItWorksSection />
      <FAQSection />

    </main>
  );
};
