export function ArticleSearch({ query = "", type }: { query?: string; type?: string }) {
  return (
    <form action="/blog" method="get" role="search" className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      {/* A GET form only submits its own fields, so the active filter is carried
          explicitly — otherwise searching would silently reset it to all content. */}
      {type ? <input type="hidden" name="type" value={type} /> : null}
      <label className="block">
        <span className="mb-2 block font-heading text-body-sm font-semibold text-ink">Search insights</span>
        <input
          type="search"
          name="query"
          defaultValue={query}
          maxLength={100}
          placeholder="Search by title, topic, or author"
          className="min-h-12 w-full rounded-control border border-border-subtle bg-surface-raised px-4 text-body text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-accent-cool focus:ring-2 focus:ring-accent-cool/25"
        />
      </label>
      <button
        type="submit"
        className="min-h-12 rounded-control bg-accent-warm px-6 font-semibold text-canvas shadow-action transition-all duration-200 hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        Search
      </button>
    </form>
  );
}
