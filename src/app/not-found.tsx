import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Next's built-in error page styles itself through an unnonced inline style element,
 * which is the one thing on the public site that `style-src 'self'` blocks. Owning
 * the not-found route keeps that default out of the response.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-canvas text-ink">
        <Container className="max-w-[48rem] pb-24 pt-[8.75rem] text-center sm:pt-[10rem] lg:pt-[11.5rem]">
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="mt-5 font-heading text-[clamp(2.2rem,5.3vw,4rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink text-balance">
            This page could not be found
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-body leading-7 text-ink-muted">
            The address may have changed, or the page may never have been published. The
            sections below are the best places to pick the trail back up.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm bg-accent-cool px-6 py-3 font-heading text-body font-semibold text-canvas transition-opacity hover:opacity-90"
            >
              Back to home
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-sm border border-border-subtle px-6 py-3 font-heading text-body font-semibold text-ink transition-colors hover:border-accent-cool hover:text-accent-cool"
            >
              Blog &amp; Insights
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
