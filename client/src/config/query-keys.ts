import { AnalyticsParams, getUserParams } from "@/types/admin";
import { GetCategoriesParams } from "@/types/category";
import { GetOrderParams } from "@/types/order";
import { GetProductsParams } from "@/types/product";
import { GetReviewsParams } from "@/types/review";

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

export const productKeys = {
  all: ["products"] as const,
  list: (params?: GetProductsParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  slug: (slug: string) => ["products", "slug", slug] as const,
  featured: ["products", "featured"] as const,
  related: (id: string) => ["products", "related", id] as const,
  variants: (productId: string) => ["products", productId, "variants"] as const,
};

export const cartKeys = {
  cart: ["cart"] as const,
  summary: ["cart", "summary"] as const,
};

export const reviewKeys = {
    product: (productId: string, params: GetReviewsParams) => ['reviews', 'product', productId, params] as const,
    canReview: (productId: string) => ['reviews', 'can-review', productId] as const,
    my: (params?: GetReviewsParams) => ['reviews', 'my', params] as const
}