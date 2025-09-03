import { TooltipProvider } from "@/core/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ThemeProvider } from "./core/feauture/theme/theme-provider";
import "./index.css";
import queryClient from "./core/config/query";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </TooltipProvider>
  </React.StrictMode>
);
