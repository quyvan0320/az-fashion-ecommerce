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
