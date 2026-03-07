import { ROUTES } from "@/config/constants";
import { authService } from "@/services/api/auth";
import { useAuth } from "@/store/authContext";
import { LoginCredentials, RegisterData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      toast.success("Đăng nhập thành công");

      //redirect by role
      if (data.data.user.role === "ADMIN") {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.HOME);
      }
    },
    onError: (error: any) => {
  const message = error.response?.data?.message || "Đăng nhập thất bại"; 
  toast.error(message);
},
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (registerData: RegisterData) =>
      authService.register(registerData),
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      toast.success("Đăng ký thành công");
      navigate(ROUTES.HOME);
    },
    onError: (error: any) => {
      const massage = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(massage);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    navigate(ROUTES.LOGIN);
  };
  return handleLogout;
};
