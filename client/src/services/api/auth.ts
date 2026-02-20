import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types";
import axiosInstance from "./axios";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  register: async (RegisterData: RegisterData): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      RegisterData,
    );
    return data;
  },
  
  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } =
      await axiosInstance.get<ApiResponse<User>>("/auth/profile");
    return data;
  },
};
