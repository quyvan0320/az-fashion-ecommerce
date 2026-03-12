export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const ROUTES = {
  //auth
  LOGIN: "/login",
  REGISTER: "/register",

  //admin
  ADMIN_DASHBOARD: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_CATEGORIES: "/admin/categories",

  // public
  HOME: "/",
  PROFILE: "/profile",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:slug",
  CART: "cart",
  CHECKOUT: "/checkout",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER: "user",
} as const;
