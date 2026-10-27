import Link from "next/link";

export function ArticleAsideCta() {
  return (
    <aside
      aria-label="Discuss your redaction workflow"
      className="rounded-[16px] border border-border-subtle/60 bg-surface-raised/70 p-5 text-ink sm:p-6"
    >
      <p className="type-eyebrow">
        Plan a safer workflow
      </p>
      <p className="mt-3 font-heading text-heading-md font-semibold leading-tight text-ink">
        Have a redaction workflow to review?
      </p>
      <p className="mt-3 text-body-sm leading-6 text-ink-muted">
        Tell us which formats and review steps your team needs to evaluate.
      </p>
      <Link
        href="/#demo-enquiry"
      className="mt-5 inline-flex min-h-10 items-center justify-center rounded-[10px] bg-accent-warm px-5 py-2 text-body-sm font-semibold text-canvas shadow-action transition-colors hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"
      >
        Discuss your workflow <span aria-hidden="true" className="ml-2">→</span>
      </Link>
    </aside>
  );
}
