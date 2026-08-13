import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: "default" | "surface" | "dark";
  className?: string;
  id?: string;
}

export function SectionWrapper({
  children,
  variant = "default",
  className,
  id,
}: SectionWrapperProps) {
  const variants = {
    default: "bg-white",
    surface: "bg-surface-100",
    dark: "bg-primary-800 text-white",
  };

  return (
    <section id={id} className={cn("py-section", variants[variant], className)}>
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
