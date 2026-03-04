import {
  Category,
  CategoryListResponse,
  CategoryStats,
  CreateCategoryData,
  GetCategoriesParams,
} from "@/types/category";
import axiosInstance from "./axios";
import { ApiResponse } from "@/types";

export const categorySevice = {
  getAll: async (
    params?: GetCategoriesParams,
  ): Promise<CategoryListResponse> => {
    const { data } = await axiosInstance.get("/categories", { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },
  getBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.get(`/categories/slug/${slug}`);
    return data;
  },
  getStats: async (): Promise<ApiResponse<CategoryStats>> => {
    const { data } = await axiosInstance.get("/categories/admin/stats");
    return data;
  },
  create: async (
    categoryData: CreateCategoryData,
  ): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.post("/categories", categoryData);
    return data;
  },
  update: async (
    id: string,
    categoryData: CreateCategoryData,
  ): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.put(`/categories/${id}`, categoryData);
    return data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data;
  },
};
