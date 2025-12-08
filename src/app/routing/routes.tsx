
import { lazy } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/core/components/layout/AppLayout";
import { RouterErrorPage } from "@/core/components/error";

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
const ErrorTestPage = lazy(() => import("@/pages/error-test").then(module => ({ default: module.ErrorTestPage })));

const routes = [
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouterErrorPage />,
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
    errorElement: <RouterErrorPage />,
  },
  {
    path: "subscriptions",
    element: (
      <ProtectedRoute>
        <SubscriptionsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "orders",
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "scheduled-orders",
    element: (
      <ProtectedRoute>
        <ScheduledOrdersPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "payment-return",
    element: (
      <ProtectedRoute>
        <PaymentReturnPage />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "payment/result",
    element: <PaymentReturnPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    path: "privacy-policy",
    element: (
      <AppLayout>
        <PrivacyPolicyPage />
      </AppLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "terms-of-service",
    element: (
      <AppLayout>
        <TermsOfServicePage />
      </AppLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "contacts",
    element: (
      <AppLayout>
        <ContactsPage />
      </AppLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
  {
    path: "couriers",
    element: (
      <AppLayout>
        <CouriersPage />
      </AppLayout>
    ),
    errorElement: <RouterErrorPage />,
  },
];

if (process.env.NODE_ENV === 'development') {
  routes.push({
    path: "error-test",
    element: (
      <AppLayout>
        <ErrorTestPage />
      </AppLayout>
    ),
    errorElement: <RouterErrorPage />,
  });
}

export const router = createBrowserRouter(routes, {
    future: {
        v7_skipActionErrorRevalidation: true,
    },
});
