"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useElementInView } from "@/hooks/useElementInView";
import { cn } from "@/lib/utils";

export type SupportChatStatus = "idle" | "loading" | "ready" | "error";

interface SupportChatLauncherProps {
  status: SupportChatStatus;
  onActivate: () => void;
  fallbackEmail: string;
}

/**
 * While the homepage's dark hero is on screen the launcher stays out of view, so the
 * orange button never sits on the orange field. It returns once the hero has scrolled
 * past. Hidden means inert: out of the tab order and the accessibility tree.
 */
function useConcealedByHero() {
  const pathname = usePathname();
  return useElementInView("[data-hero-dark]", { key: pathname, initial: pathname === "/" });
}

const revealClass = (concealed: boolean) =>
  cn(
    "transition-[opacity,transform,visibility] duration-300 ease-standard motion-reduce:transition-none",
    concealed ? "invisible translate-y-3 opacity-0" : "visible translate-y-0 opacity-100"
  );

export function SupportChatLauncher({
  status,
  onActivate,
  fallbackEmail,
}: SupportChatLauncherProps) {
  const concealed = useConcealedByHero();

  if (status === "error") {
    return (
      <div
        role="status"
        data-support-launcher
        data-concealed={concealed || undefined}
        inert={concealed}
        className={cn("fixed bottom-5 right-5 z-[70] max-w-[min(22rem,calc(100vw-2.5rem))] rounded-panel border border-border-subtle bg-surface-raised p-4 shadow-panel sm:bottom-6 sm:right-6", revealClass(concealed))}
      >
        <p className="text-body-sm font-medium text-ink">Chat is unavailable right now.</p>
        <a
          href={`mailto:${fallbackEmail}`}
          className="mt-2 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
        >
          <Icon name="send" size={17} />
          Contact us by email
        </a>
      </div>
    );
  }

  return (
    <div
      data-support-launcher
      data-concealed={concealed || undefined}
      inert={concealed}
      className={cn("fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6", revealClass(concealed))}
    >
      <button
        type="button"
        onClick={onActivate}
        aria-label="Open OpenRedakt support chat"
        aria-busy={status === "loading"}
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-accent-warm/35 bg-accent-warm px-4 py-3 font-heading text-body-sm font-semibold text-on-accent shadow-action transition-all duration-200 hover:bg-accent-warm-hover hover:shadow-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-wait disabled:opacity-90 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        <Icon name="message-circle" size={20} />
        <span>{status === "loading" ? "Loading support chat…" : "Chat with us"}</span>
      </button>
    </div>
  );
}
