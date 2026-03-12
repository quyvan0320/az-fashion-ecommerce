import { ApiResponse } from "@/types";
import { CartFullSummary, CartResponse } from "@/types/cart";
import axiosInstance from "../api/axios";

export const cartService = {
  getCart: async (): Promise<ApiResponse<CartResponse>> => {
    const { data } = await axiosInstance.get("/cart");
    return data;
  },

  getSummary: async (): Promise<ApiResponse<CartFullSummary>> => {
    const { data } = await axiosInstance.get("/cart/summary");
    return data;
  },

  validateCart: async (): Promise<ApiResponse<{ valid: boolean }>> => {
    const { data } = await axiosInstance.post("/cart/validate");
    return data;
  },

  addItem: async (
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.post("/cart/items", {
      productId,
      quantity,
    });
    return data;
  },

  updateQuantity: async (
    cartItemId: string,
    quantity: number,
  ): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.put(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return data;
  },

  removeItem: async (cartItemId: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/cart/items/${cartItemId}`);
    return data;
  },

  clearCart: async (): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete("/cart");
    return data;
  },
};
