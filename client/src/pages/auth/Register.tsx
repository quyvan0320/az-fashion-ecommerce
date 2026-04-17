import Button from "@/components/common/Button";
import { ROUTES } from "@/config/constants";
import { useRegister } from "@/services/queries/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/Input";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";
import Logo from "@/components/layout/public/Header/Logo";
import { Helmet } from "react-helmet-async";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Vui lòng nhập tên"),
    lastName: z.string().min(1, "Vui lòng nhập họ"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .length(10, "Số điện thoại phải có đúng 10 chữ số")
      .regex(
        /^(0[3|5|7|8|9])([0-9]{8})$/,
        "Số điện thoại không đúng định dạng",
      ),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { mutate: register, isPending } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword: _, ...registerData } = data;
    register(registerData);
  };

  return (
    <div className=" flex items-center justify-center bg-brand-light pt-12">
      <Helmet>
        <title>Az Fashion - Đăng ký</title>
      </Helmet>
      <div className="w-full max-w-xl p-8  space-y-6">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex items-center font-heading text-2xl  font-semibold gap-5 justify-center">
          <Link
            to={ROUTES.LOGIN}
            className="text-brand-dark/50 hover:text-brand-dark transition duration-500"
          >
            Đăng nhập
          </Link>
          <span>|</span>
          <Link to={ROUTES.REGISTER}>Đăng ký</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* last and first name */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Họ và tên đệm"
              {...registerField("lastName")}
              className="px-6 py-4 font-heading"
              error={errors.lastName?.message}
              disabled={isPending}
            />

            <Input
              {...registerField("firstName")}
              placeholder="Tên"
              className="px-6 py-4 font-heading"
              error={errors.firstName?.message}
              disabled={isPending}
            />
          </div>

          <Input
            type="email"
            placeholder="Email"
            className="px-6 py-4 font-heading"
            error={errors.email?.message}
            {...registerField("email")}
            disabled={isPending}
          />

          <Input
            type="text"
            placeholder="Số điện thoại"
            className="px-6 py-4 font-heading"
            error={errors.phone?.message}
            {...registerField("phone")}
            disabled={isPending}
          />

          {/* password */}
          <Input
            type="password"
            placeholder="Mật khẩu"
            className="px-6 py-4 font-heading"
            error={errors.password?.message}
            {...registerField("password")}
            disabled={isPending}
          />

          {/*confirm password */}
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="px-6 py-4 font-heading"
            error={errors.confirmPassword?.message}
            {...registerField("confirmPassword")}
            disabled={isPending}
          />

          {/* submit */}
          <div className="flex items-center gap-8">
            <Button
              type="submit"
              variant="primary"
              className="uppercase"
              size="lg"
              isLoading={isPending}
            >
              Đăng ký
            </Button>

            <p className="text-center font-light text-sm text-brand-dark ">
              Đã có tài khoản?{" "}
              <Link to={ROUTES.LOGIN} className="text-blue-300 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
