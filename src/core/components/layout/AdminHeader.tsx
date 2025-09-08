import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { ROUTES } from "@/core/constants/routes";
import { Menu, X, User, LogOut } from "lucide-react";
import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { ThemeToggle } from "@/core/feauture/theme/theme-toggle";

export const AdminHeader = () => {
  const { data: user } = useGetMe();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Очищаем токены из localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    navigate(ROUTES.ADMIN.LOGIN);

    // Перезагружаем страницу для очистки кэша React Query
    window.location.reload();
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center justify-between h-full px-4 bg-background border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user?.name || "Пользователь"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4 mr-2" />
                Профиль
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-2">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
                <div className="border-t pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
