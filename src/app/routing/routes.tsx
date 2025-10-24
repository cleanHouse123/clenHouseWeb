
import { HomePage } from "@/pages/home";
import { DashboardPage } from "@/pages/dashboard";
import { OrdersPage } from "@/pages/orders";
import { PaymentReturnPage } from "@/pages/payment-return";
import { PrivacyPolicyPage } from "@/pages/privacy-policy";
import { TermsOfServicePage } from "@/pages/terms-of-service";
import { ContactsPage } from "@/pages/contacts";
import { ProtectedRoute } from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { SubscriptionsPage } from "@/pages/subscriptions";
import { AppLayout } from "@/core/components/layout/AppLayout";

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
  },
  {
    path: "payment-return",
    element: (
      <ProtectedRoute>
        <PaymentReturnPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "privacy-policy",
    element: (
      <AppLayout>
        <PrivacyPolicyPage />
      </AppLayout>
    ),
  },
  {
    path: "terms-of-service",
    element: (
      <AppLayout>
        <TermsOfServicePage />
      </AppLayout>
    ),
  },
  {
    path: "contacts",
    element: (
      <AppLayout>
        <ContactsPage />
      </AppLayout>
    ),
  }
]);
