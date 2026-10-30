"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export interface AccordionItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface AccordionProps {
  items: readonly AccordionItem[];
  defaultOpenIndex?: number | null;
  openIndex?: number | null;
  onOpenChange?: (index: number | null) => void;
  allowCollapse?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIndex = null,
  openIndex,
  onOpenChange,
  allowCollapse = true,
  className,
}: AccordionProps) {
  const groupId = useId().replace(/:/g, "");
  const [internalIndex, setInternalIndex] = useState<number | null>(
    defaultOpenIndex
  );
  const isControlled = openIndex !== undefined;
  const activeIndex = isControlled ? openIndex : internalIndex;

  const setActiveIndex = (nextIndex: number | null) => {
    if (!isControlled) setInternalIndex(nextIndex);
    onOpenChange?.(nextIndex);
  };

  return (
    <div className={cn("border-y border-border-subtle/60", className)}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        const triggerId = `${groupId}-${item.id}-trigger`;
        const panelId = `${groupId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={cn(
              "border-t border-border-subtle/60 transition-colors duration-300 first:border-t-0 motion-reduce:transition-none",
              isOpen && "bg-surface-raised/40"
            )}
          >
            <button
              id={triggerId}
              type="button"
              className="group flex min-h-16 w-full items-center gap-4 px-1 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool sm:px-3"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setActiveIndex(isOpen && allowCollapse ? null : index)
              }
            >
              {item.icon && (
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border transition-colors", isOpen ? "border-accent-warm/40 bg-accent-warm/10 text-accent-ink" : "border-border-subtle/70 text-ink-muted")}>
                  <Icon name={item.icon} size={18} />
                </span>
              )}
              <span className={cn("flex-1 text-base font-semibold leading-6 transition-colors sm:text-[1.0625rem]", isOpen ? "text-ink" : "text-ink/90 group-hover:text-ink")}>
                {item.title}
              </span>
              <Icon
                name="chevron-down"
                size={18}
                className={cn(
                  "text-ink-muted transition-transform duration-300 motion-reduce:transition-none",
                  isOpen && "rotate-180 text-accent-ink"
                )}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn("pb-6 pr-6 text-[0.9375rem] leading-7 text-ink-muted", item.icon ? "pl-[3.75rem] sm:pl-[4.25rem]" : "pl-1 sm:pl-3")}
            >
              {item.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
