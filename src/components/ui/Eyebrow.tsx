import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "type-eyebrow",
        className
      )}
    >
      {children}
    </p>
  );
}
