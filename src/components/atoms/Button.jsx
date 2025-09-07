import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "default",
  ...props 
}, ref) => {
  const variants = {
    primary: "game-button",
    secondary: "game-button-secondary",
    ghost: "text-white font-medium py-2 px-4 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95",
  };

  const sizes = {
    small: "py-1.5 px-4 text-sm",
    default: "py-3 px-8",
    large: "py-4 px-12 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;