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
        <p className="type-eyebrow mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="type-h2 text-balance">
        {title}
      </h2>
      {description && (
        <p className="type-body mt-5 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
