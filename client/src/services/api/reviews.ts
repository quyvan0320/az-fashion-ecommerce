import {
  CanReviewResponse,
  GetReviewsParams,
  ProductReviewResponse,
  Review,
} from "@/types/review";
import axiosInstance from "./axios";
import { ApiResponse, PaginationResponse } from "@/types";

export const reviewService = {
  getProductReviews: async (
    productId: string,
    params?: GetReviewsParams,
  ): Promise<ProductReviewResponse> => {
    const { data } = await axiosInstance.get(`/products/${productId}/reviews`, {
      params,
    });
    return data;
  },

  canReviews: async (
    productId: string,
  ): Promise<ApiResponse<CanReviewResponse>> => {
    const { data } = await axiosInstance.get(
      `/products/${productId}/reviews/can-review`,
    );
    return data;
  },

  getMyReviews: async (
    params?: GetReviewsParams,
  ): Promise<PaginationResponse<Review>> => {
    const { data } = await axiosInstance.get("/reviews/my", { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.get(`/reviews/${id}`);
    return data;
  },

  create: async (
    productId: string,
    reviewData: { rating: number; comment?: string },
  ): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.post(
      `/products/${productId}/reviews`,
      reviewData,
    );
    return data;
  },

  update: async (
    id: string,
    reviewData: { rating?: number; comment?: string },
  ): Promise<ApiResponse<Review>> => {
    const { data } = await axiosInstance.put(`/reviews/${id}`, reviewData);
    return data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/reviews/${id}`);
    return data;
  },
};
