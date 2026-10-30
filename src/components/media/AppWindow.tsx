import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A restrained application-window frame for product captures: a light title bar with
 * three window dots and a hairline border. It frames the real screenshot; it adds no
 * controls of its own, and the dots are decorative (hidden from assistive technology).
 */
export function AppWindow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("app-window overflow-hidden rounded-[12px] sm:rounded-[14px]", className)}>
      <div aria-hidden="true" className="app-window-bar flex h-7 items-center gap-1.5 px-3 sm:h-8 sm:gap-2 sm:px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] sm:h-3 sm:w-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] sm:h-3 sm:w-3" />
      </div>
      {children}
    </div>
  );
}
