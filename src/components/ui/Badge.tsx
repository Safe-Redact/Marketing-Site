import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "dark";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-surface-200 text-primary-600",
    accent: "bg-accent-100 text-accent-700",
    dark: "bg-primary-700 text-white",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-chip px-3 py-1 text-caption font-medium uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
