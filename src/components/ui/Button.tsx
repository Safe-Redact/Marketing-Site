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
        "bg-accent-warm text-canvas shadow-action hover:bg-accent-warm-hover hover:shadow-action-hover",
      secondary:
        "border border-border-subtle bg-surface-raised text-ink hover:border-accent-cool/55 hover:bg-surface-active",
      ghost:
        "border border-border-subtle bg-transparent text-ink hover:border-accent-cool/55 hover:text-white",
    };

    const sizes = {
      sm: "min-h-11 px-5 py-2.5 text-body-sm",
      md: "min-h-11 px-6 py-2.5 text-body",
      lg: "min-h-12 px-7 py-3 text-body",
    };

    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50",
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
