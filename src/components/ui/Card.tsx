import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "dark";
  className?: string;
}

function Card({ children, variant = "default", className }: CardProps) {
  const variants = {
    default:
      "border border-border-subtle bg-surface-raised text-ink shadow-panel hover:border-accent-cool/30",
    bordered: "border border-border-subtle bg-canvas text-ink",
    dark: "border border-border-subtle bg-surface-raised/85 text-ink backdrop-blur-sm",
  };

  return (
    <div
      className={cn(
        "rounded-card p-6 transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-3", className)}>{children}</div>;
}

function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-body leading-relaxed text-ink-muted", className)}>
      {children}
    </p>
  );
}

export { Card, CardHeader, CardDescription };
