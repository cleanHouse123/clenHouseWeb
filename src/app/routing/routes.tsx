import { AdminLayout } from "@/core/components/layout/AdminLayout";
import { HomePage } from "@/pages/home";
import { DashboardPage } from "@/pages/dashboard";
import { SubscriptionsPage } from "@/pages/subscriptions";
import { LoginPage } from "@/pages/login";
import { OrdersPage } from "@/pages/orders";
import { ProtectedRoute } from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "login",
    element: <LoginPage />,
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
