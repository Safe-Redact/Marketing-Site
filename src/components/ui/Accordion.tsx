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
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        const triggerId = `${groupId}-${item.id}-trigger`;
        const panelId = `${groupId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-card border bg-surface-raised transition-colors duration-300",
              isOpen
                ? "border-accent-cool/45 bg-surface-active"
                : "border-border-subtle hover:border-accent-cool/25"
            )}
          >
            <button
              id={triggerId}
              type="button"
              className="flex min-h-16 w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setActiveIndex(isOpen && allowCollapse ? null : index)
              }
            >
              {item.icon && (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control border border-accent-cool/20 bg-accent-cool/10 text-accent-cool">
                  <Icon name={item.icon} size={18} />
                </span>
              )}
              <span className="flex-1 font-heading text-base font-semibold leading-6 text-ink sm:text-lg">
                {item.title}
              </span>
              <Icon
                name="chevron-down"
                size={18}
                className={cn(
                  "text-ink-muted transition-transform duration-300",
                  isOpen && "rotate-180 text-accent-cool"
                )}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="px-4 pb-5 pl-16 text-[0.9375rem] leading-6 text-ink-muted sm:px-5 sm:pl-[4.75rem]"
            >
              {item.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
