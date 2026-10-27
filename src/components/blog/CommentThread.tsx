import { CommentForm } from "@/components/blog/CommentForm";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MAX_THREAD_DEPTH } from "@/lib/comments/limits";
import { commentsRuntime } from "@/lib/comments/runtime";
import type { PublicComment } from "@/lib/comments/types";

function formatCommentDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function countComments(nodes: PublicComment[]): number {
  return nodes.reduce(
    (total, node) => total + (node.removed ? 0 : 1) + countComments(node.replies),
    0
  );
}

function CommentNode({
  comment,
  articleSlug,
  depth,
}: {
  comment: PublicComment;
  articleSlug: string;
  depth: number;
}) {
  return (
    <li className="mt-6 first:mt-0">
      <article
        aria-label={comment.removed ? "Removed comment" : `Comment by ${comment.authorName}`}
        className="rounded-[16px] border border-border-subtle bg-surface-raised p-5 sm:p-6"
      >
        {comment.removed ? (
          // A tombstone keeps its place so the replies beneath it still make sense.
          <p className="text-body-sm italic leading-6 text-ink-muted">
            This comment was removed by a moderator.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-heading text-body-sm font-semibold text-ink">
                {comment.authorName}
              </span>
              {comment.isStaff ? (
                <span className="inline-flex items-center rounded-sm border border-accent-cool/40 bg-accent-cool/10 px-2 py-0.5 font-heading text-caption font-semibold uppercase tracking-[0.04em] text-accent-cool">
                  OpenRedakt team
                </span>
              ) : null}
              <time dateTime={comment.createdAt} className="text-caption text-ink-muted">
                {formatCommentDate(comment.createdAt)}
              </time>
            </div>
            {/* Plain text only. The body is never HTML and never Markdown, so React's
                own escaping is the whole defence against stored XSS. */}
            <p className="mt-3 whitespace-pre-wrap text-body-sm leading-6 text-ink-muted">
              {comment.body}
            </p>
          </>
        )}

        {depth + 1 < MAX_THREAD_DEPTH && !comment.removed ? (
          <div className="mt-4">
            <CommentForm articleSlug={articleSlug} parentId={comment.id} replyingTo={comment.authorName} />
          </div>
        ) : null}
      </article>

      {comment.replies.length ? (
        <ul className="mt-4 border-l border-border-subtle pl-4 sm:pl-6">
          {comment.replies.map((reply) => (
            <CommentNode key={reply.id} comment={reply} articleSlug={articleSlug} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * The public discussion for one article.
 *
 * Rendered on the server from the repository, so an approved comment is in the
 * HTML rather than arriving after hydration. When comments are switched off for the
 * deployment the whole section is absent: an empty form that refuses every
 * submission would be worse than no form at all.
 */
export async function CommentThread({ articleSlug }: { articleSlug: string }) {
  const runtime = (() => {
    try {
      return commentsRuntime();
    } catch {
      // A misconfiguration is reported in the server log by the routes; the page
      // simply carries no discussion rather than failing to render.
      return null;
    }
  })();
  if (!runtime) return null;

  const comments = await runtime.service.publicThread(articleSlug);
  const total = countComments(comments);

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="border-t border-border-subtle bg-canvas py-14 sm:py-16"
    >
      <Container className="max-w-[58rem]">
        <Eyebrow>Discussion</Eyebrow>
        <h2 id="comments-heading" className="mt-3 font-heading text-heading-xl text-ink">
          {total === 0 ? "No comments yet" : `${total} ${total === 1 ? "comment" : "comments"}`}
        </h2>
        <p className="mt-3 text-body-sm leading-6 text-ink-muted">
          Comments are reviewed by the OpenRedakt team before they appear. Please keep
          personal and client information out of your comment.
        </p>

        <div className="mt-8">
          <CommentForm articleSlug={articleSlug} parentId={null} />
        </div>

        {comments.length ? (
          <ul className="mt-10">
            {comments.map((comment) => (
              <CommentNode key={comment.id} comment={comment} articleSlug={articleSlug} depth={0} />
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
