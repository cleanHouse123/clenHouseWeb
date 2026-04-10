import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Header } from "@/core/components/layout/Header";
import { FooterSection } from "@/core/components/layout/footer";
import { MainSection } from "./ui/main-section";
import { ScrollToTop } from '@/core/components/ScrollToTop';
import { useLoginModal } from '@/core/contexts/LoginModalContext';


export const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { data: user } = useGetMe();
  const { openLoginModal } = useLoginModal();

  // Обработка якорных ссылок при переходе с других страниц
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Небольшая задержка для загрузки компонентов
      const timer = setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          const headerHeight = 100; // Высота header + отступ
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // Обработка рекламного токена из URL
  useEffect(() => {
    const adToken = searchParams.get('adToken');
    if (adToken) {
      // Сохраняем adToken в localStorage
      localStorage.setItem('adToken', adToken);

      // Если пользователь не авторизован, открываем модальное окно входа
      if (!user) {
        openLoginModal();
      }

      // Очищаем URL параметр для чистоты адресной строки
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('adToken');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, user, openLoginModal]);

  const handleCallCourier = () => {
    if (user) {
      navigate('/orders');
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-8 lg:px-8">
      <ScrollToTop />
      <Header />
      <MainSection onCallCourier={handleCallCourier} />
      <FooterSection />

    </div>
  );
};
