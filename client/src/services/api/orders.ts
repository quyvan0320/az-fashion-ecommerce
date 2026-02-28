import {
  CreateOrderData,
  GetOrderParams,
  OrderDetail,
  OrderListResponse,
  OrderStats,
} from "@/types/order";
import axiosInstance from "./axios";
import { ApiResponse } from "@/types";

export const orderService = {
  getAllOrders: async (params?: GetOrderParams): Promise<OrderListResponse> => {
    const { data } = await axiosInstance.get(`/orders/admin/all`, { params });
    return data;
  },

  getOrderStats: async (): Promise<ApiResponse<OrderStats>> => {
    const { data } = await axiosInstance.get(`/orders/admin/stats`);
    return data;
  },

  updateOrderStatus: async (
    id: string,
    status: string,
  ): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await axiosInstance.patch(
      `/orders/admin/${id}/status`,
      {status},
    );
    return data;
  },

  getMyOrders: async (params?: GetOrderParams): Promise<OrderListResponse> => {
    const { data } = await axiosInstance.get("/orders", { params });
    return data;
  },

  createOrder: async (
    orderData: CreateOrderData,
  ): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await axiosInstance.post("/orders", orderData);
    return data;
  },

  getOrderById: async (id: string): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await axiosInstance.get(`/orders/${id}`);
    return data;
  },

  getOrderByNumber: async (
    orderNumber: string,
  ): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await axiosInstance.get(`/orders/number/${orderNumber}`);
    return data;
  },

  cancelOrder: async (id: string): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await axiosInstance.patch(`/orders/${id}/cancel`);
    return data;
  },
};
