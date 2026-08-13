import {
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", asChild = false, className, children, ...props },
    ref
  ) => {
    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md",
      secondary:
        "bg-primary-700 text-white hover:bg-primary-800 shadow-sm",
      ghost:
        "bg-transparent text-primary-700 border border-surface-300 hover:border-accent hover:text-accent",
    };

    const sizes = {
      sm: "px-4 py-2 text-body-sm",
      md: "px-6 py-3 text-body",
      lg: "px-8 py-4 text-body-lg",
    };

    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
      variants[variant],
      sizes[size],
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        [key: string]: unknown;
      }>;
      const existingClass = child.props.className || "";
      return (
        <child.type
          {...child.props}
          className={cn(classes, existingClass)}
          ref={ref}
        />
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
