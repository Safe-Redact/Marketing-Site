import { Icon } from "@/components/ui/Icon";

export function ArticleSearch({
  query = "",
  type,
  tag,
}: {
  query?: string;
  type?: string;
  tag?: string;
}) {
  return (
    <form action="/blog" method="get" role="search" className="min-w-0">
      {/* A GET form only submits its own fields, so the active filter is carried
          explicitly — otherwise searching would silently reset it to all content. */}
      {type ? <input type="hidden" name="type" value={type} /> : null}
      {tag ? <input type="hidden" name="tag" value={tag} /> : null}
      <label className="relative flex h-11 items-center overflow-hidden rounded-[10px] border border-ink-muted/40 bg-surface-raised/60 transition-colors focus-within:border-accent-cool focus-within:ring-2 focus-within:ring-accent-cool/20">
        <span className="sr-only">Search the blog</span>
        <Icon name="search" size={17} className="ml-4 text-ink-muted" />
        <input
          type="search"
          name="query"
          defaultValue={query}
          maxLength={100}
          placeholder="Search by title, topic, or author"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 pr-4 text-body-sm text-ink outline-none placeholder:text-ink-muted/70"
        />
      </label>
    </form>
  );
}
