
import { lazy } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/core/components/layout/AppLayout";

// Динамические импорты для code splitting
const HomePage = lazy(() => import("@/pages/home").then(module => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import("@/pages/dashboard").then(module => ({ default: module.DashboardPage })));
const OrdersPage = lazy(() => import("@/pages/orders").then(module => ({ default: module.OrdersPage })));
const ScheduledOrdersPage = lazy(() => import("@/pages/scheduled-orders").then(module => ({ default: module.ScheduledOrdersPage })));
const PaymentReturnPage = lazy(() => import("@/pages/payment-return").then(module => ({ default: module.PaymentReturnPage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy-policy").then(module => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import("@/pages/terms-of-service").then(module => ({ default: module.TermsOfServicePage })));
const ContactsPage = lazy(() => import("@/pages/contacts").then(module => ({ default: module.ContactsPage })));
const CouriersPage = lazy(() => import("@/pages/couriers").then(module => ({ default: module.CouriersPage })));
const SubscriptionsPage = lazy(() => import("@/pages/subscriptions").then(module => ({ default: module.SubscriptionsPage })));

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
    path: "scheduled-orders",
    element: (
      <ProtectedRoute>
        <ScheduledOrdersPage />
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
    path: "payment/result",
    element: <PaymentReturnPage />,
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
  },
  {
    path: "couriers",
    element: (
      <AppLayout>
        <CouriersPage />
      </AppLayout>
    ),
  }
]);
