import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "dark";
  className?: string;
}

function Card({ children, variant = "default", className }: CardProps) {
  const variants = {
    default:
      "bg-surface-50 border border-surface-300 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5",
    bordered: "bg-surface-50 border border-surface-300",
    dark: "bg-white/5 border border-white/10 backdrop-blur-sm",
  };

  return (
    <div
      className={cn(
        "rounded-panel p-6 transition-all duration-300",
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
    <p className={cn("text-body text-primary-500 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export { Card, CardHeader, CardDescription };
