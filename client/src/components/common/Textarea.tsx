import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, rows = 4, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-gray-700 ml-1">
            {label}
          </label>
        )}

        <div className="relative group">
          <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={`
              w-full bg-gray-50 border transition-all duration-200 
              rounded-xl py-2.5 px-4 text-sm outline-none 
              placeholder:text-gray-400 resize-none
              ${
                error
                  ? "border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-gray-200 focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100"
              } 
              ${className}
            `}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;