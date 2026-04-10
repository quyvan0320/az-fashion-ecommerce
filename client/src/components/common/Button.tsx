import { LucideIcon } from "lucide-react";
import React from "react";
import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  noHover?: boolean;
}
// ... (giữ nguyên phần Interface)

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth,
  className = "",
  noHover = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "relative group/btn inline-flex items-center justify-center border border-brand-dark font-heading transition-all duration-500 rounded active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

  const variants = {
    primary:
      "bg-brand-light text-brand-dark border-brand-dark hover:text-brand-light",
    secondary: "bg-blue-600 text-brand-light border-blue-700",
    outline:
      "border-2 border-brand-grey text-brand-grey hover:bg-brand-grey hover:text-brand-light",
    danger: "bg-brand-red text-brand-light border-brand-red",
    ghost: "text-brand-grey border-transparent hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {!noHover && (
        <span
          className="absolute inset-0 z-0 
                         w-[150%] h-full bg-brand-red 
                         skew-x-[20deg]               
                         transition-transform duration-500 ease-out 
                         -translate-x-[115%]            
                         group-hover/btn:translate-x-[-10%]"
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={18} />}
            {children}
            {RightIcon && <RightIcon size={18} />}
          </>
        )}
      </span>
    </button>
  );
};

export default Button;
