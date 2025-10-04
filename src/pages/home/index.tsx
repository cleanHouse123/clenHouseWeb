import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Header } from "@/core/components/layout/Header";
import { FooterSection } from "@/core/components/layout/footer";
import { MainSection } from "./ui/main-section";
import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';


export const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: user } = useGetMe();
  const [isSmsLoginModalOpen, setIsSmsLoginModalOpen] = useState(false);

  // Обработка рекламного токена из URL
  useEffect(() => {
    const adToken = searchParams.get('adToken');
    if (adToken) {
      // Сохраняем adToken в localStorage
      localStorage.setItem('adToken', adToken);

      // Если пользователь не авторизован, открываем модальное окно входа
      if (!user) {
        setIsSmsLoginModalOpen(true);
      }

      // Очищаем URL параметр для чистоты адресной строки
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('adToken');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, user]);

  const handleCallCourier = () => {
    if (user) {
      navigate('/orders');
    } else {
      setIsSmsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainSection onCallCourier={handleCallCourier} />
      <FooterSection />

      {/* SMS Login Modal */}
      <SmsLoginModal
        isOpen={isSmsLoginModalOpen}
        onClose={() => setIsSmsLoginModalOpen(false)}
      />

    </div>
  );
};
