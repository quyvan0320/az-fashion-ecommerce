import { AnalyticsParams, getUserParams } from "@/types/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../api/admin";
import toast from "react-hot-toast";

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

// dashboard
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: () => adminService.getDashboard(),
  });
};

// analytics
export const useRevenueAnalytics = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: adminKeys.revenue(params),
    queryFn: () => adminService.getRevenueAnylytics(params),
  });
};

// top products
export const useTopProducts = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: adminKeys.topProducts(params),
    queryFn: () => adminService.getTopProducts(params),
  });
};

// top products
export const useLowStockProducts = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: adminKeys.lowStock(params),
    queryFn: () => adminService.getLowStockProducts(params),
  });
};

// admin
export const useAdminUsers = (params?: getUserParams) => {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getAllUsers(params),
  });
};

// user stats
export const useUserStats = () => {
  return useQuery({
    queryKey: adminKeys.userStats,
    queryFn: () => adminService.getUserStats(),
  });
};

// update role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: "ADMIN" | "CUSTOMER" }) =>
      adminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.userStats });
      toast.success("Cập nhật role thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};

// delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.userStats });
      toast.success("Xóa người dùng thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa người dùng thất bại");
    },
  });
};
