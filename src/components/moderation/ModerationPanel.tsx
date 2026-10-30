"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ModerationComment, ModerationEvent } from "@/lib/comments/types";

/**
 * Decap stores the signed-in GitHub user, token included, under this key on the
 * same origin. Reading it reuses the sign-in the editor already completed instead
 * of adding a second login. The token is only ever put in an Authorization header
 * on a same-origin request; the server verifies it against GitHub on every call,
 * so nothing here is trusted as authority.
 */
const DECAP_USER_KEY = "decap-cms-user";

const STATUSES = ["pending", "approved", "rejected", "removed", "all"] as const;
type StatusFilter = (typeof STATUSES)[number];

function readStaffToken(): string | null {
  try {
    const raw = window.localStorage.getItem(DECAP_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: unknown };
    return typeof parsed.token === "string" && parsed.token ? parsed.token : null;
  } catch {
    // Blocked or cleared storage reads as "not signed in", never as an error page.
    return null;
  }
}

function formatWhen(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ModerationPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<ModerationComment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, ModerationEvent[]>>({});
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setToken(readStaffToken());
    setReady(true);
  }, []);

  const announce = useCallback((text: string, failed = false) => {
    setMessage(text);
    setIsError(failed);
  }, []);

  const authorizedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      if (!token) throw new Error("not signed in");
      return fetch(input, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          Authorization: `Bearer ${token}`,
          ...(init.body ? { "Content-Type": "application/json" } : {}),
        },
      });
    },
    [token]
  );

  const loadQueue = useCallback(async () => {
    if (!token) return;
    const params = new URLSearchParams({ status });
    if (search.trim()) params.set("search", search.trim());

    try {
      const response = await authorizedFetch(`/api/moderation/comments?${params}`);
      const result = (await response.json().catch(() => ({}))) as {
        page?: { items: ModerationComment[]; totalItems: number };
        message?: string;
      };
      if (!response.ok) {
        announce(result.message ?? "The moderation queue could not be loaded.", true);
        return;
      }
      setItems(result.page?.items ?? []);
      setTotalItems(result.page?.totalItems ?? 0);
      announce(`${result.page?.totalItems ?? 0} ${status === "all" ? "" : status} comments.`.replace("  ", " "));
    } catch {
      announce("The moderation queue could not be loaded.", true);
    }
  }, [announce, authorizedFetch, search, status, token]);

  useEffect(() => {
    if (token) void loadQueue();
  }, [token, status, loadQueue]);

  const decide = async (commentId: string, action: "approve" | "reject" | "remove") => {
    setBusyId(commentId);
    try {
      const response = await authorizedFetch(`/api/moderation/comments?comment=${commentId}`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        announce(result.message ?? "That decision could not be applied.", true);
        return;
      }
      announce(`Comment ${action}d.`);
      await loadQueue();
    } finally {
      setBusyId(null);
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  const loadHistory = async (commentId: string) => {
    const response = await authorizedFetch(`/api/moderation/history?comment=${commentId}`);
    const result = (await response.json().catch(() => ({}))) as { events?: ModerationEvent[] };
    setHistory((current) => ({ ...current, [commentId]: result.events ?? [] }));
  };

  const sendReply = async (parentId: string) => {
    setBusyId(parentId);
    try {
      const response = await authorizedFetch(`/api/moderation/replies?parent=${parentId}`, {
        method: "POST",
        body: JSON.stringify({ body: replyBody }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        announce(result.message ?? "That reply could not be posted.", true);
        return;
      }
      announce("Staff reply published.");
      setReplyFor(null);
      setReplyBody("");
      await loadQueue();
    } finally {
      setBusyId(null);
    }
  };

  if (!ready) return null;

  if (!token) {
    return (
      <div className="rounded-panel border border-border-subtle bg-surface-raised p-6">
        <h2 className="font-heading text-heading-lg text-ink">Sign in to moderate</h2>
        <p className="mt-3 text-body-sm leading-6 text-ink-muted">
          Moderation uses the same GitHub sign-in as the content studio. Sign in there
          first, then return to this page.
        </p>
        <a
          href="/admin/index.html"
          className="mt-5 inline-flex items-center justify-center rounded-sm bg-accent-warm px-5 py-2.5 font-heading text-body-sm font-semibold text-on-accent transition-opacity hover:opacity-90"
        >
          Open the content studio
        </a>
      </div>
    );
  }

  const fieldClass =
    "rounded-control border border-border-subtle bg-surface-active px-3 py-2 text-body-sm text-ink focus:border-accent-cool focus:outline-none focus:ring-1 focus:ring-accent-cool";

  return (
    <div>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void loadQueue();
        }}
      >
        <div>
          <label htmlFor="moderation-status" className="block font-heading text-caption font-semibold uppercase tracking-[0.04em] text-ink">
            Queue
          </label>
          <select
            id="moderation-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className={cn(fieldClass, "mt-2")}
          >
            {STATUSES.map((value) => (
              <option key={value} value={value} className="bg-surface-active text-ink">
                {value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[12rem]">
          <label htmlFor="moderation-search" className="block font-heading text-caption font-semibold uppercase tracking-[0.04em] text-ink">
            Search
          </label>
          <input
            id="moderation-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Author, text or article"
            className={cn(fieldClass, "mt-2 w-full")}
          />
        </div>
        <Button type="submit" variant="secondary" size="md">
          Filter
        </Button>
      </form>

      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live={isError ? "assertive" : "polite"}
        className={cn(
          "mt-4 text-body-sm focus-visible:outline-none",
          isError ? "text-accent-ink" : "text-ink-muted"
        )}
      >
        {message || `${totalItems} comments in this queue.`}
      </p>

      <ul className="mt-6">
        {items.map((comment) => (
          <li key={comment.id} className="mt-4 first:mt-0 rounded-panel border border-border-subtle bg-surface-raised p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-heading text-body-sm font-semibold text-ink">
                {comment.authorName || "(removed)"}
              </span>
              <span className="rounded-sm border border-border-subtle px-2 py-0.5 text-caption uppercase tracking-[0.04em] text-ink-muted">
                {comment.status}
              </span>
              {comment.isStaff ? (
                <span className="text-caption uppercase tracking-[0.04em] text-accent-cool">staff</span>
              ) : null}
              {comment.openReports > 0 ? (
                <span className="rounded-sm border border-accent-warm/40 bg-accent-warm/10 px-2 py-0.5 text-caption font-semibold uppercase tracking-[0.04em] text-accent-ink">
                  {comment.openReports} reported
                </span>
              ) : null}
              <time dateTime={comment.createdAt} className="text-caption text-ink-muted">
                {formatWhen(comment.createdAt)}
              </time>
            </div>

            <p className="mt-1 text-caption text-ink-muted">on /blog/{comment.articleSlug}</p>
            <p className="mt-3 whitespace-pre-wrap text-body-sm leading-6 text-ink-muted">{comment.body}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["approve", "reject", "remove"] as const).map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled={busyId === comment.id}
                  onClick={() => void decide(comment.id, action)}
                  className="rounded-sm border border-border-subtle px-3 py-1.5 text-body-sm text-ink transition-colors hover:border-accent-cool hover:text-accent-cool disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
                >
                  {action[0].toUpperCase() + action.slice(1)}
                </button>
              ))}
              {comment.status === "approved" ? (
                <button
                  type="button"
                  onClick={() => setReplyFor(replyFor === comment.id ? null : comment.id)}
                  className="rounded-sm border border-border-subtle px-3 py-1.5 text-body-sm text-ink transition-colors hover:border-accent-cool hover:text-accent-cool focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
                >
                  Staff reply
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void loadHistory(comment.id)}
                className="rounded-sm px-3 py-1.5 text-body-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
              >
                History
              </button>
            </div>

            {replyFor === comment.id ? (
              <div className="mt-4">
                <label htmlFor={`reply-${comment.id}`} className="block font-heading text-caption font-semibold uppercase tracking-[0.04em] text-ink">
                  Verified staff reply
                </label>
                <textarea
                  id={`reply-${comment.id}`}
                  rows={3}
                  value={replyBody}
                  onChange={(event) => setReplyBody(event.target.value)}
                  className={cn(fieldClass, "mt-2 w-full resize-none")}
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={busyId === comment.id}
                  onClick={() => void sendReply(comment.id)}
                  className="mt-3"
                >
                  Publish reply
                </Button>
              </div>
            ) : null}

            {history[comment.id] ? (
              <ol className="mt-4 border-t border-border-subtle pt-3 text-caption text-ink-muted">
                {history[comment.id].length === 0 ? <li>No moderation history.</li> : null}
                {history[comment.id].map((event) => (
                  <li key={event.id} className="mt-1">
                    {formatWhen(event.createdAt)} — {event.actorLabel} {event.action}d ({event.fromStatus} →{" "}
                    {event.toStatus}){event.reason ? `, ${event.reason}` : ""}
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="mt-6 rounded-panel border border-border-subtle bg-surface-raised p-6 text-body-sm text-ink-muted">
          Nothing in this queue.
        </p>
      ) : null}
    </div>
  );
}
