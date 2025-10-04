import { Header } from "@/core/components/layout/Header";
import { MainSection } from "./ui/main-section";
 

export const HomePage = () => {
  const handleCallCourier = () => {
    // TODO: Реализовать вызов курьера
    console.log('Вызов курьера');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainSection onCallCourier={handleCallCourier} />

    </div>
  );
};
