import { useLogin } from "@/services/queries/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/constants";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
// define validation rules
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Phải dài ít nhất 6 ký tự"),
});

// type form from schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors }, // object errors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // connect zod with hook form
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-6">
        <div className="text-content">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng trở lại AZ Fashion
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate 
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register("email")}
            disabled={isPending}
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="......."
            error={errors.password?.message}
            {...register("password")}
            disabled={isPending}
          />

          <Button
            type="submit" 
            variant="primary"
            fullWidth
            isLoading={isPending}
          >
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 ">
          Chưa có tài khoản?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="text-black font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
