import axios from "axios";
import { API_URL, ROUTES, STORAGE_KEYS } from "@/config/constants";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//request interceptor - add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//request interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = window.location.pathname === ROUTES.LOGIN;
    const isRegisterPage = window.location.pathname === ROUTES.REGISTER;

    const hasToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (
      error.response?.status === 401 &&
      !isLoginPage &&
      !isRegisterPage &&
      hasToken
    ) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = ROUTES.LOGIN;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
