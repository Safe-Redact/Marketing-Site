import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: "default" | "surface" | "dark" | "canvas" | "raised";
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
    canvas: "bg-canvas text-ink",
    raised: "bg-surface-raised text-ink",
  };

  return (
    <section id={id} className={cn("py-section", variants[variant], className)}>
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-8 xl:px-0">
        {children}
      </div>
    </section>
  );
}
