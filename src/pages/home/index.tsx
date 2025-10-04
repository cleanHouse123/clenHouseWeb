import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import { Header } from "@/core/components/layout/Header";
import { MainSection } from "./ui/main-section";
import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: user } = useGetMe();
  const [isSmsLoginModalOpen, setIsSmsLoginModalOpen] = useState(false);

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
      
      {/* SMS Login Modal */}
      <SmsLoginModal
        isOpen={isSmsLoginModalOpen}
        onClose={() => setIsSmsLoginModalOpen(false)}
      />
    </div>
  );
};
