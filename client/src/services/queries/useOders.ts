import { orderKeys } from "@/config/query-keys";
import { CreateOrderData, GetOrderParams } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../api/orders";
import toast from "react-hot-toast";

export const useAdminOrders = (params?: GetOrderParams) => {
  return useQuery({
    queryKey: orderKeys.adminList(params),
    queryFn: () => orderService.getAllOrders(params),
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats,
    queryFn: () => orderService.getAllOrders(),
  });
};

export const userOrderDetail = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};

export const useMyOrders = (params?: GetOrderParams) => {
  return useQuery({
    queryKey: orderKeys.myList(params),
    queryFn: () => orderService.getMyOrders(params),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Đặt hàng thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đặt hàng thất bại");
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      toast.success("Hủy đơn hàng thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Hủy đơn thất bại");
    },
  });
};
