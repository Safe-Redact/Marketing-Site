import { Icon } from "@/components/ui/Icon";

export type SupportChatStatus = "idle" | "loading" | "ready" | "error";

interface SupportChatLauncherProps {
  status: SupportChatStatus;
  onActivate: () => void;
  fallbackEmail: string;
}

export function SupportChatLauncher({
  status,
  onActivate,
  fallbackEmail,
}: SupportChatLauncherProps) {
  if (status === "error") {
    return (
      <div
        role="status"
        className="fixed bottom-5 right-5 z-[70] max-w-[min(22rem,calc(100vw-2.5rem))] rounded-panel border border-border-subtle bg-surface-raised p-4 shadow-panel sm:bottom-6 sm:right-6"
      >
        <p className="text-body-sm font-medium text-ink">Chat is unavailable right now.</p>
        <a
          href={`mailto:${fallbackEmail}`}
          className="mt-2 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
        >
          <Icon name="send" size={17} />
          Contact us by email
        </a>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={onActivate}
        aria-label="Open OpenRedakt support chat"
        aria-busy={status === "loading"}
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-accent-warm/35 bg-accent-warm px-4 py-3 font-heading text-body-sm font-semibold text-canvas shadow-action transition-all duration-200 hover:bg-accent-warm-hover hover:shadow-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-wait disabled:opacity-90 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        <Icon name="message-circle" size={20} />
        <span>{status === "loading" ? "Loading support chat…" : "Chat with us"}</span>
      </button>
    </div>
  );
}
