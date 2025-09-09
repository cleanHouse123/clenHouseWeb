
import { HomePage } from "@/pages/home";
import { DashboardPage } from "@/pages/dashboard";
import { OrdersPage } from "@/pages/orders";
import { ProtectedRoute } from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { SubscriptionsPage } from "@/pages/subscriptions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  // {
  //   path: "login",
  //   element: <LoginPage />,
  // },
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
  }
]);
