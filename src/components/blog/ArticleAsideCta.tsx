import Link from "next/link";

export function ArticleAsideCta() {
  return (
    <aside
      aria-label="Discuss your redaction workflow"
      className="rounded-panel border border-border-subtle bg-surface-raised p-5 text-white shadow-panel sm:p-6"
    >
      <p className="font-heading text-caption font-semibold uppercase tracking-[0.1em] text-white/55">
        Plan a safer workflow
      </p>
      <p className="mt-3 font-heading text-heading-md font-semibold leading-tight text-white">
        Have a redaction workflow to review?
      </p>
      <p className="mt-3 text-body-sm leading-6 text-white/65">
        Tell us which formats and review steps your team needs to evaluate.
      </p>
      <Link
        href="/#demo-enquiry"
      className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 py-2 text-body-sm font-semibold text-canvas transition-colors hover:bg-accent-cool focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"
      >
        Discuss your workflow <span aria-hidden="true" className="ml-2">→</span>
      </Link>
    </aside>
  );
}
