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
    <div className=" flex items-center justify-center bg-brand-light pt-12">
      <div className="w-full max-w-xl p-8  space-y-6">
        <div className="flex items-center font-heading text-2xl  font-semibold gap-5 justify-center">
          <Link to={ROUTES.LOGIN} className="">
            Đăng nhập
          </Link>
          <span>|</span>
          <Link
            to={ROUTES.REGISTER}
            className="text-brand-dark/50 hover:text-brand-dark transition duration-500"
          >
            Đăng ký
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <Input
            type="email"
            placeholder="Vui lòng nhập email của bạn"
            className="px-6 py-4 font-heading"
            error={errors.email?.message}
            {...register("email")}
            disabled={isPending}
          />

          <Input
            type="password"
            className="px-6 py-4 font-heading"
            placeholder="Vui lòng nhập mật khẩu"
            error={errors.password?.message}
            {...register("password")}
            disabled={isPending}
          />

          <div className="flex items-center gap-8">
            <Button
              type="submit"
              variant="primary"
              className="uppercase"
              size="lg"
              isLoading={isPending}
            >
              Đăng nhập
            </Button>

            <p className="text-center font-light text-sm text-brand-dark ">
              Chưa có tài khoản?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-blue-300 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
