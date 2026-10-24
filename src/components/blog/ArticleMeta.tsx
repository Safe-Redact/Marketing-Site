import { ArticleTypeBadge } from "@/components/blog/ArticleTypeBadge";
import { formatArticleDate } from "@/components/blog/ArticleCard";
import type { BlogArticle } from "@/lib/blog/types";

export function ArticleMeta({ article }: { article: BlogArticle }) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
      <ArticleTypeBadge
        article={article}
        className="border-border-subtle bg-surface-raised text-ink-muted"
      />
      <dl className="flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-ink-muted">
        <div className="flex gap-1.5">
          <dt className="sr-only">Author</dt>
          <dd className="font-medium text-white">By {article.author}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="sr-only">Published</dt>
          <dd>
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
          </dd>
        </div>
        {article.updatedDate ? (
          <div className="flex gap-1.5">
            <dt>Updated</dt>
            <dd>
              <time dateTime={article.updatedDate}>{formatArticleDate(article.updatedDate)}</time>
            </dd>
          </div>
        ) : null}
        <div className="flex gap-1.5">
          <dt className="sr-only">Reading time</dt>
          <dd>{article.readingMinutes} min read</dd>
        </div>
      </dl>
    </div>
  );
}
