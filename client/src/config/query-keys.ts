import { AnalyticsParams, getUserParams } from "@/types/admin";
import { GetCategoriesParams } from "@/types/category";
import { GetOrderParams } from "@/types/order";

export const orderKeys = {
  all: ["orders"] as const,
  adminList: (params?: GetOrderParams) =>
    ["orders", "admin", "list", params] as const,
  myList: (params?: GetOrderParams) =>
    ["orders", "my", "list", params] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
  stats: ["orders", "admin", "stats"] as const,
};

export const adminKeys = {
  dashboard: ["admin", "dashboard"] as const,
  revenue: (params?: AnalyticsParams) => ["admin", "revenue", params] as const,
  topProducts: (params?: AnalyticsParams) =>
    ["admin", "top-products", params] as const,
  lowStock: (params?: AnalyticsParams) =>
    ["admin", "low-stock", params] as const,
  users: (params?: getUserParams) => ["admin", "users", params] as const,
  userStats: ["admin", "top-products"] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: GetCategoriesParams) =>
    ["categories", "list", params] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
  stats: ["categories", "stats"] as const,
};
