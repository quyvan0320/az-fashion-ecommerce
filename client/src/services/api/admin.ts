import { ApiResponse, PaginationResponse } from "@/types";
import {
  AdminUser,
  AnalyticsParams,
  DashboardStats,
  getUserParams,
  LowStockProduct,
  RevenueData,
  TopProductItem,
  UserStats,
} from "@/types/admin";
import axiosInstance from "./axios";

export const adminService = {
  // dashboard
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await axiosInstance.get("/admin/dashboard");
    return data;
  },

  //revenue chart
  getRevenueAnylytics: async (
    params?: AnalyticsParams,
  ): Promise<ApiResponse<RevenueData[]>> => {
    const { data } = await axiosInstance.get("/admin/analytics/revenue", {
      params,
    });
    return data;
  },

  //top products
  getTopProducts: async (
    params?: AnalyticsParams,
  ): Promise<ApiResponse<TopProductItem[]>> => {
    const { data } = await axiosInstance.get("/admin/analytics/top-products", {
      params,
    });
    return data;
  },

  //low stock products
  getLowStockProducts: async (
    params?: AnalyticsParams,
  ): Promise<ApiResponse<LowStockProduct[]>> => {
    const { data } = await axiosInstance.get("/admin/products/low-stock", {
      params,
    });
    return data;
  },


  // list users
  getAllUsers: async (
    params?: getUserParams,
  ): Promise<PaginationResponse<AdminUser>> => {
    const { data } = await axiosInstance.get("/admin/users", {
      params,
    });
    return data;
  },

  // analytics users
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const { data } = await axiosInstance.get("/admin/users/stats");
    return data;
  },

  // change role
  updateUserRole: async (
    id: string,
    role: "ADMIN" | "CUSTOMER",
  ): Promise<ApiResponse<AdminUser>> => {
    const { data } = await axiosInstance.patch(`/admin/users/${id}/role`, {
      role,
    });
    return data;
  },

  // delete user
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/admin/users/${id}`);
    return data;
  },
};
