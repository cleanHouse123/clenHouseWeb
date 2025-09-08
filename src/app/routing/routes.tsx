import { AdminLayout } from "@/core/components/layout/AdminLayout";
import { HomePage } from "@/pages/home";
import { SmsLoginPage } from "@/pages/sms-login";
import { DashboardPage } from "@/pages/dashboard";
import { SubscriptionsPage } from "@/pages/subscriptions";
import { LoginPage } from "@/pages/login";
import { OrdersPage } from "@/pages/orders";
import { CreateOrderPage } from "@/pages/orders/create";
import { ProtectedRoute } from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "sms-login",
    element: <SmsLoginPage />,
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "subscriptions",
    element: (
      <ProtectedRoute>
        <SubscriptionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "orders",
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "orders/create",
    element: (
      <ProtectedRoute>
        <CreateOrderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <div>Home</div>,
      },
      {
        path: "orders",
        element: <div>Orders</div>,
      },
    ],
  },
]);
