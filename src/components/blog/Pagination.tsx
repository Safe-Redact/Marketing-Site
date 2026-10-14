import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: string;
}

function pageHref(basePath: string, page: number, query?: string): string {
  const parameters = new URLSearchParams();
  if (query) parameters.set("query", query);
  if (page > 1) parameters.set("page", String(page));
  const suffix = parameters.toString();
  return suffix ? `${basePath}?${suffix}` : basePath;
}

export function Pagination({ currentPage, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Article pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link className="blog-page-link" href={pageHref(basePath, currentPage - 1, query)}>Previous</Link>
      ) : (
        <span className="blog-page-link cursor-not-allowed opacity-40" aria-disabled="true">Previous</span>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <Link
          key={page}
          href={pageHref(basePath, page, query)}
          aria-current={page === currentPage ? "page" : undefined}
          className="blog-page-link aria-[current=page]:border-accent-cool aria-[current=page]:bg-accent-cool/10 aria-[current=page]:text-accent-cool"
        >
          <span className="sr-only">Page </span>{page}
        </Link>
      ))}
      {currentPage < totalPages ? (
        <Link className="blog-page-link" href={pageHref(basePath, currentPage + 1, query)}>Next</Link>
      ) : (
        <span className="blog-page-link cursor-not-allowed opacity-40" aria-disabled="true">Next</span>
      )}
    </nav>
  );
}
