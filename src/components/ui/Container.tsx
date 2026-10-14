import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function Container({
  as: Component = "div",
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-content px-5 sm:px-6 lg:px-8 xl:px-0",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
