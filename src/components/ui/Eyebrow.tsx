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
        "font-heading text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-accent-cool",
        className
      )}
    >
      {children}
    </p>
  );
}
