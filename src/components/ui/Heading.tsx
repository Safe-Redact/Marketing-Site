import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<HeadingLevel, string> = {
  h1: "text-display-lg md:text-display-lg",
  h2: "text-display-sm md:text-display",
  h3: "text-heading-xl",
  h4: "text-heading-lg",
};

export function Heading({
  level = "h2",
  children,
  className,
}: HeadingProps) {
  const Tag = level;

  return (
    <Tag
      className={cn(
        "font-bold text-primary-800 text-balance",
        sizeClasses[level],
        className
      )}
    >
      {children}
    </Tag>
  );
}
