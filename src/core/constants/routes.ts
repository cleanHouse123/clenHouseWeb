export const ROUTES = {
  ADMIN: {
    LOGIN: "/login",
    REGISTER: "/register",
    ORDERS: {
      LIST: "/admin/orders",
      CREATE: "/admin/orders/create",
      DETAILS: (id: string) => `/admin/orders/${id}`,
      EDIT: (id: string) => `/admin/orders/${id}/edit`,
    },
  },
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
