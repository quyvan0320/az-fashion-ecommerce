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
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  // base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  // variant styles
  const variants = {
  primary: "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 active:bg-black/90",
  secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200", 
  outline: "border-2 border-gray-100 text-gray-900 hover:border-black hover:bg-white transition-all",
  danger: "bg-red-500 text-white hover:bg-red-600", 
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-black",
};

  // size styles
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
      {!isLoading && LeftIcon && <LeftIcon size={size === "sm" ? 14 : 18} />}
      <span className={isLoading ? "opacity-70" : ""}>{children}</span>
      {!isLoading && RightIcon && <RightIcon size={size === "sm" ? 14 : 18} />}
    </button>
  );
};

export default Button;
