import { TooltipProvider } from "@/core/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { LocaleProvider } from "./core/feauture/locale/locale-provider";
import { CreateOrderProvider } from "./core/contexts/CreateOrderContext";
import "./index.css";
import queryClient from "./core/config/query";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider defaultLocale="ru" storageKey="clean-house-locale">
          <CreateOrderProvider>
            <App />
          </CreateOrderProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </TooltipProvider>
  </React.StrictMode>
);
