import { TooltipProvider } from "@/core/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/App";
import { LocaleProvider } from "./core/feauture/locale/locale-provider";
import "./index.css";
import queryClient from "./core/config/query";



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
