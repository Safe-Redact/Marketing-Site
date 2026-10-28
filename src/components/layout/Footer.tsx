import Image from "next/image";
import Link from "next/link";
import { publicSupportEmail, siteConfig } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Capabilities", href: "#services" },
      { label: "Product workflow", href: "#how-it-works" },
      { label: "Why OpenRedakt", href: "#why-saferedact" },
      { label: "Pricing", href: "/pricing" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "Workflows",
    links: [
      { label: "Documents", href: "#why-saferedact" },
      { label: "Audio & transcripts", href: "#why-saferedact" },
      { label: "Use cases", href: "#industries" },
    ],
  },
] as const;

export function Footer({ homePage = false }: { homePage?: boolean }) {
  return (
    <footer className="border-t border-border-subtle bg-canvas text-ink">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.85fr_1fr] lg:gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 font-heading text-xl font-semibold tracking-[-0.03em] text-ink" aria-label={`${siteConfig.name} home`}>
              <span className="grid h-8 w-8 place-items-center rounded-control border border-accent-warm/30 bg-accent-warm/10">
                <Image src="/favicon.svg" alt="" width={22} height={22} />
              </span>
              <span><span className="text-accent-warm">Open</span>Redakt</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-ink-muted">
              AI-assisted redaction workflows for documents and audio in a native Windows application.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-heading text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href.startsWith("#") && !homePage ? `/${link.href}` : link.href} className="inline-flex min-h-9 items-center text-sm text-ink-muted transition-colors hover:text-ink">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="font-heading text-sm font-semibold text-ink">Connect</h2>
            <div className="mt-4 space-y-3">
              {homePage ? (
                <a href="#demo-enquiry" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover">
                  <Icon name="arrow" size={16} />
                  Request a Demo
                </a>
              ) : (
                <Link href="/#demo-enquiry" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover">
                  <Icon name="arrow" size={16} />
                  Request a Demo
                </Link>
              )}
              <a href={`mailto:${publicSupportEmail}`} className="flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink">
                <Icon name="send" size={16} />
                Direct contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border-subtle pt-7 text-xs leading-5 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.name} &copy; {new Date().getFullYear()} All rights reserved.</p>
          <p>Windows desktop software · Verify exported results before use.</p>
        </div>
      </Container>
    </footer>
  );
}
