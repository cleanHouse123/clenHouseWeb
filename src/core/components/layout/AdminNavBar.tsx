import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import { ROUTES } from "@/core/constants/routes";
import { Package } from "lucide-react";

export const AdminNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: ROUTES.ADMIN.ORDERS.LIST,
      label: "Заказы",
      icon: Package,
    },
  ];

  return (
    <nav className="hidden md:flex w-64 bg-muted/50 border-r border-border flex-col p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Панель управления</h1>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              onClick={() => navigate(item.path)}
              className={`w-full justify-start ${isActive(item.path)
                  ? "bg-secondary hover:bg-secondary text-foreground"
                  : "hover:bg-accent text-foreground"
                }`}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}; 