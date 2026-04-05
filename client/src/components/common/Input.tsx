import { LucideIcon } from "lucide-react";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon: LeftIcon,
      rightElement,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-1.5 ">
        {label && (
          <label className="text-sm font-semibold text-gray-700 ml-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
              <LeftIcon size={18} />
            </div>
          )}

          <input
            {...props}
            ref={ref}
            className={`w-full bg-brand-grey border text-brand-dark transition-all duration-200 rounded py-2.5 px-4 text-sm outline-none placeholder:text-brand-dark/50
            ${LeftIcon ? "pl-10" : ""} ${rightElement ? "pr-12" : ""} ${
              error
                ? "border-brand-red focus:ring-1 focus:ring-brand-red"
                : "border-gray-200 focus:border-brand-dark focus:bg-brand-light focus:ring-4 focus:ring-brand-grey"
            } ${className}`}
          />

          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-medium text-brand-red ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
