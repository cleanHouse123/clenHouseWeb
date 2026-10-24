import { TooltipProvider } from "@/core/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/App";
import { LocaleProvider } from "./core/feauture/locale/locale-provider";
import "./index.css";
import queryClient from "./core/config/query";
import { takeOverLegacyEntry } from "./modules/auth/utils/saved-auth";

// Прежняя версия хранила пароль в localStorage открытым текстом. У тех, кто
// уже входил, он лежит там прямо сейчас, поэтому стираем на старте, не
// дожидаясь следующего входа
takeOverLegacyEntry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <LocaleProvider defaultLocale="ru" storageKey="clean-house-locale">
            <App />
          </LocaleProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </HelmetProvider>
  </React.StrictMode>
);
