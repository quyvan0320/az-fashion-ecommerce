import { ApiResponse } from "@/types";
import { Address, CreateAddressData } from "@/types/address";
import axiosInstance from "./axios";

export const addressService = {
  getAll: async (): Promise<ApiResponse<Address>> => {
    const { data } = await axiosInstance.get("/addresses");
    return data;
  },
  getById: async (id: string): Promise<ApiResponse<Address>> => {
    const { data } = await axiosInstance.get(`/addresses/${id}`);
    return data;
  },
  getDefault: async (): Promise<ApiResponse<Address>> => {
    const { data } = await axiosInstance.get("/addresses/default");
    return data;
  },
  create: async (
    addressData: CreateAddressData,
  ): Promise<ApiResponse<Address>> => {
    const { data } = await axiosInstance.post("/addresses", addressData);
    return data;
  },
  update: async (
    id: string,
    addressData: Partial<CreateAddressData>,
  ): Promise<ApiResponse<Address>> => {
    const { data } = await axiosInstance.put(`/addresses/${id}`, addressData);
    return data;
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/addresses/${id}`);
    return data;
  },
  setDefault: async (id: string): Promise<ApiResponse<Address>> => {
    const { data } = await axiosInstance.patch(`/addresses/${id}/default`);
    return data;
  },
};
