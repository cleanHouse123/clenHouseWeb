export const ROUTES = {
  ORDERS: {
    BASE: "/orders",
    DETAILS: (id: string) => `/orders/${id}`,
  },
  SUBSCRIPTIONS: {
    BASE: "/subscriptions",
  },
  DASHBOARD: "/dashboard",
  HOME: "/",
  SMS_LOGIN: "/login",
} as const;
