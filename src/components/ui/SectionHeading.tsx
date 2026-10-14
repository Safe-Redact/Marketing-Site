import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 font-heading text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-accent-cool">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-display font-bold text-ink text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-body-lg leading-7 text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}
