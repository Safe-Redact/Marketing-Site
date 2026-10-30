import Link from "next/link";
import { demoHref, footerGroups } from "@/content/navigation";
import { publicSupportEmail, siteConfig } from "@/content/site";
import { Container } from "@/components/ui/Container";

const linkClass =
  "inline-flex min-h-9 items-center rounded-sm text-[0.9375rem] text-ink transition-colors hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool motion-reduce:transition-none";

/**
 * Site footer, the same on every page. One continuous pale surface carries a centered
 * demo invitation, the link groups, the legal line, and a quiet wordmark. Pages that
 * already contain the enquiry form (/book-a-demo, /contact) pass invitation={false}.
 */
export function Footer({ homePage = false, invitation = true }: { homePage?: boolean; invitation?: boolean }) {
  return (
    <footer className="footer-canvas text-ink">
      <Container>
        {invitation ? (
          // id="demo-enquiry" keeps older in-page and inbound demo links landing here.
          <section
            id="demo-enquiry"
            aria-labelledby="footer-invitation-heading"
            className="mx-auto max-w-[46rem] pb-24 pt-24 text-center sm:pb-32 sm:pt-32"
          >
            <h2
              id="footer-invitation-heading"
              className="font-heading text-[clamp(2rem,1.45rem+2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink text-balance"
            >
              <span className="block">Protect what matters.</span>
              <span className="block">Share with confidence.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[33rem] text-[1.0625rem] leading-7 text-ink-muted">
              See how OpenRedakt helps your team review and redact sensitive information in documents and audio.
            </p>
            <Link
              href={demoHref}
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-accent-warm px-7 text-[0.9375rem] font-semibold text-on-accent shadow-action transition-colors hover:bg-accent-warm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              Request a Demo
            </Link>
          </section>
        ) : (
          <div aria-hidden="true" className="h-20 sm:h-24" />
        )}

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-[0.8125rem] font-medium text-ink-muted">{group.title}</h2>
              <ul className="mt-4 space-y-0.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href.startsWith("#") && !homePage ? `/${link.href}` : link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                {group.title === "Company" ? (
                  <li>
                    <a href={`mailto:${publicSupportEmail}`} className={linkClass}>
                      Email us
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-16 flex flex-col gap-2 text-[0.8125rem] text-ink-muted sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Windows desktop software. Review exported files before you share them.</p>
        </div>
      </Container>

      {/*
        Decorative: the brand is already named in the header and the legal line. The line
        box leaves room for the descender of "p", so nothing is clipped, and the bottom
        padding keeps the chat launcher over this empty band rather than links or text.
      */}
      <div aria-hidden="true" className="select-none px-5 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
        <p className="footer-wordmark mx-auto w-fit whitespace-nowrap font-heading font-semibold leading-[1.12] tracking-[-0.065em]">
          {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
