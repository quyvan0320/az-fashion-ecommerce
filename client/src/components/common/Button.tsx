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
    "group relative inline-flex border-brand-dark border hover:text-brand-light items-center justify-center border-brand-dark  font-heading transition-all duration-500 rounded active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden z-0"; // z-0 là bắt buộc

  const variants = {
    primary: "bg-brand-light text-brand-dark",
    secondary: "bg-blue-600 text-brand-light",
    outline: "border-2 border-brand-grey text-brand-grey",
    danger: "bg-brand-red text-brand-light",
    ghost: "text-brand-grey",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >

      {!noHover && (
        <span className="absolute top-0 bottom-0 z-[-1] 
                     w-[130%] h-full bg-brand-red 
                     skew-x-[15deg]              
                     transition-transform duration-500 ease-in-out 
                     -left-[10%]               
                     -translate-x-full            
                     group-hover:translate-x-0    
                     " />
      )}

     
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {!isLoading && LeftIcon && <LeftIcon size={size === "sm" ? 14 : 18} />}
        <span className={isLoading ? "opacity-70" : ""}>{children}</span>
        {!isLoading && RightIcon && (
          <RightIcon size={size === "sm" ? 14 : 18} />
        )}
      </span>
    </button>
  );
};

export default Button;
