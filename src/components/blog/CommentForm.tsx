"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { MAX_BODY_LENGTH, MAX_NAME_LENGTH, MIN_BODY_LENGTH, MIN_NAME_LENGTH } from "@/lib/comments/limits";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  articleSlug: string;
  parentId: string | null;
  /** Present on a reply, so the control says who is being answered. */
  replyingTo?: string;
}

type Outcome = { kind: "idle" } | { kind: "accepted"; message: string } | { kind: "error"; message: string };

const fieldClass =
  "w-full rounded-control border border-border-subtle bg-surface-active px-4 py-3 text-base text-ink placeholder:text-ink-muted/55 transition-colors focus:border-accent-cool focus:outline-none focus:ring-1 focus:ring-accent-cool";

export function CommentForm({ articleSlug, parentId, replyingTo }: CommentFormProps) {
  const isReply = parentId !== null;
  const [isOpen, setIsOpen] = useState(!isReply);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>({ kind: "idle" });
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  // Honeypot: hidden from sight, from assistive technology and from the tab order.
  const [website, setWebsite] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);

  const formId = useId();
  const nameId = `${formId}-name`;
  const bodyId = `${formId}-body`;
  const statusId = `${formId}-status`;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setOutcome({ kind: "idle" });

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSlug, parentId, authorName, body, website }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setOutcome({
          kind: "error",
          message: result.message ?? "This comment could not be accepted. Please try again.",
        });
        return;
      }

      // Accepted means queued for moderation, never published. Saying anything
      // stronger would promise the author their comment is already visible.
      setOutcome({
        kind: "accepted",
        message: result.message ?? "Your comment has been sent for moderation.",
      });
      setAuthorName("");
      setBody("");
    } catch {
      setOutcome({
        kind: "error",
        message: "The site could not reach the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      // Move attention to the outcome so it is announced and seen.
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  if (isReply && !isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-sm font-heading text-caption font-semibold uppercase tracking-[0.04em] text-accent-cool transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
      >
        Reply{replyingTo ? <span className="sr-only"> to {replyingTo}</span> : null}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      aria-describedby={statusId}
      className={cn(isReply && "rounded-panel border border-border-subtle bg-surface-active/40 p-4")}
    >
      <h3 className={cn("font-heading text-body font-semibold text-ink", isReply && "text-body-sm")}>
        {isReply ? `Reply to ${replyingTo ?? "this comment"}` : "Join the discussion"}
      </h3>

      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor={nameId} className="block font-heading text-caption font-semibold uppercase tracking-[0.04em] text-ink">
            Your name
          </label>
          <input
            id={nameId}
            name="authorName"
            type="text"
            required
            minLength={MIN_NAME_LENGTH}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className={cn(fieldClass, "mt-2")}
          />
        </div>
        <div>
          <label htmlFor={bodyId} className="block font-heading text-caption font-semibold uppercase tracking-[0.04em] text-ink">
            Your comment
          </label>
          <textarea
            id={bodyId}
            name="body"
            rows={isReply ? 3 : 4}
            required
            minLength={MIN_BODY_LENGTH}
            maxLength={MAX_BODY_LENGTH}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className={cn(fieldClass, "mt-2 resize-none")}
          />
        </div>
      </div>

      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : isReply ? "Post reply" : "Post comment"}
        </Button>
        {isReply ? (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-sm text-body-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <p
        id={statusId}
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live={outcome.kind === "error" ? "assertive" : "polite"}
        className={cn(
          "mt-4 text-body-sm leading-6 focus-visible:outline-none",
          outcome.kind === "error" ? "text-accent-warm" : "text-ink-muted"
        )}
      >
        {outcome.kind === "idle"
          ? "Comments are reviewed before they appear."
          : outcome.message}
      </p>
    </form>
  );
}
