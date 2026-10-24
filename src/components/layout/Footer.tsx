import Image from "next/image";
import Link from "next/link";
import { publicSupportEmail, siteConfig } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "Capabilities", href: "#services" },
      { label: "Product workflow", href: "#how-it-works" },
      { label: "Why OpenRedakt", href: "#why-saferedact" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "Workflows",
    links: [
      { label: "Documents & images", href: "#why-saferedact" },
      { label: "Audio & transcripts", href: "#why-saferedact" },
      { label: "Video", href: "#why-saferedact" },
      { label: "Use cases", href: "#industries" },
    ],
  },
] as const;

export function Footer({
  homePage = false,
  variant = "default",
}: {
  homePage?: boolean;
  variant?: "default" | "editorial";
}) {
  const editorial = variant === "editorial";

  return (
    <footer className={cn(
      "border-t",
      editorial
        ? "border-editorial-line bg-editorial-soft text-editorial-ink"
        : "border-border-subtle bg-canvas text-ink"
    )}>
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.85fr_1fr] lg:gap-12">
          <div>
            <Link href="/" className={cn("inline-flex items-center gap-2.5 font-heading text-xl font-semibold tracking-[-0.03em]", editorial ? "text-editorial-ink" : "text-ink")} aria-label={`${siteConfig.name} home`}>
              <span className={cn("grid h-8 w-8 place-items-center rounded-control border", editorial ? "border-editorial-line bg-white" : "border-accent-warm/30 bg-accent-warm/10")}>
                <Image src="/favicon.svg" alt="" width={22} height={22} />
              </span>
              <span><span className="text-accent-warm">Open</span>Redakt</span>
            </Link>
            <p className={cn("mt-5 max-w-xs text-sm leading-6", editorial ? "text-editorial-muted" : "text-ink-muted")}>
              AI-assisted redaction workflows for documents, images, audio, and video in a native Windows application.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className={cn("font-heading text-sm font-semibold", editorial ? "text-editorial-ink" : "text-ink")}>{group.title}</h2>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href.startsWith("#") && !homePage ? `/${link.href}` : link.href} className={cn("inline-flex min-h-9 items-center text-sm transition-colors", editorial ? "text-editorial-muted hover:text-editorial-ink" : "text-ink-muted hover:text-ink")}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className={cn("font-heading text-sm font-semibold", editorial ? "text-editorial-ink" : "text-ink")}>Connect</h2>
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
              <a href={`mailto:${publicSupportEmail}`} className={cn("flex items-center gap-2 text-sm transition-colors", editorial ? "text-editorial-muted hover:text-editorial-ink" : "text-ink-muted hover:text-ink")}>
                <Icon name="send" size={16} />
                Direct contact
              </a>
            </div>
          </div>
        </div>

        <div className={cn(
          "mt-12 flex flex-col gap-3 border-t pt-7 text-xs leading-5 sm:flex-row sm:items-center sm:justify-between",
          editorial ? "border-editorial-line text-editorial-muted" : "border-border-subtle text-ink-muted"
        )}>
          <p>{siteConfig.name} &copy; {new Date().getFullYear()} All rights reserved.</p>
          <p>Windows desktop software · Verify exported results before use.</p>
        </div>
      </Container>
    </footer>
  );
}
