import { Button } from "@/core/components/ui/button";
import { StatCard } from "@/core/components/ui/stats/StatCard";
import {
  Activity,
  FileText,
  Shield,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-background via-card to-secondary p-6">
      <div className="flex justify-end w-full items-center gap-2">
        <Button variant="admin-primary" onClick={handleLogin}>Войти</Button>
      </div>
      <div className="max-w-7xl flex-1 flex flex-col justify-center mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Добро пожаловать в систему управления
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Эффективное решение для управления вашим бизнесом
          </p>
        </div>

        {/* Основные карточки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Пользователи"
            value="1,234"
            subtitle="Активные пользователи"
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Активность"
            value="89%"
            subtitle="Уровень активности"
            icon={Activity}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <StatCard
            title="Документы"
            value="567"
            subtitle="Обработанные документы"
            icon={FileText}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatCard
            title="Безопасность"
            value="100%"
            subtitle="Уровень защиты"
            icon={Shield}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
        </div>
      </div>
    </div>
  );
};
