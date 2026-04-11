import {
  CreateVariantData,
  GetProductsParams,
  Product,
  ProductListResponse,
  ProductVariantsResponse,
  Variant,
} from "@/types/product";
import axiosInstance from "./axios";
import { ApiResponse } from "@/types";

export const productService = {
  getAll: async (params?: GetProductsParams): Promise<ProductListResponse> => {
    const { data } = await axiosInstance.get("/products", { params });
    return data;
  },
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  },
  getBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.get(`/products/slug/${slug}`);
    return data;
  },
  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    const { data } = await axiosInstance.get("/products/featured");
    return data;
  },
  getRelated: async (id: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await axiosInstance.get(`/products/${id}/related`);
    return data;
  },
  getByCategory: async (
    categoryId: string,
    params?: GetProductsParams,
  ): Promise<ApiResponse<Product[]>> => {
    const { data } = await axiosInstance.get(
      `/products/category/${categoryId}`,
      { params },
    );
    return data;
  },
create: async (payload: any): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.post("/products", payload);
    return data;
  },

  update: async (
    id: string,
    payload: any,
  ): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.put(`/products/${id}`, payload);
    return data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data;
  },
  updateStock: async (
    id: string,
    stock: number,
  ): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.patch(`/products/${id}/stock`, {
      stock,
    });
    return data;
  },

  toggleActive: async (id: string): Promise<ApiResponse<Product>> => {
    const { data } = await axiosInstance.patch(`/products/${id}/toggle-active`);
    return data;
  },
};

// variants
export const variantService = {
  // get all variants of one product
  getByProduct: async (
    productId: string,
  ): Promise<ApiResponse<ProductVariantsResponse>> => {
    const { data } = await axiosInstance.get(`/products/${productId}/variants`);
    return data;
  },
  // get colors
  getSizes: async (productId: string): Promise<ApiResponse<string[]>> => {
    const { data } = await axiosInstance.get(
      `/products/${productId}/variants/sizes`,
    );
    return data;
  },

  // get sizes
  getColors: async (productId: string): Promise<ApiResponse<string[]>> => {
    const { data } = await axiosInstance.get(
      `/products/${productId}/variants/colors`,
    );
    return data;
  },

  findVariant: async (
    productId: string,
    params?: { size: string; color: string },
  ): Promise<ApiResponse<Variant>> => {
    const { data } = await axiosInstance.get(
      `/products/${productId}/variants/find`,
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Variant>> => {
    const { data } = await axiosInstance.get(`/variants/${id}`);
    return data;
  },

  create: async (
    productId: string,
    variantData: CreateVariantData,
  ): Promise<ApiResponse<Variant>> => {
    const { data } = await axiosInstance.post(
      `/products/${productId}/variants`,
      variantData,
    );
    return data
  },

  update: async (
    id: string,
    variantData: CreateVariantData,
  ): Promise<ApiResponse<Variant>> => {
    const { data } = await axiosInstance.put(
      `/variants/${id}`,
      variantData,
    );
    return data
  },

   updateStock: async (
    id: string,
    stock: number,
  ): Promise<ApiResponse<Variant>> => {
    const { data } = await axiosInstance.patch(`/variants/${id}/stock`, {
      stock,
    });
    return data;
  },

   delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/variants/${id}`);
    return data;
  },
};
