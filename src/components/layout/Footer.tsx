import Image from "next/image";
import Link from "next/link";
import { demoHref, footerGroups } from "@/content/navigation";
import { publicSupportEmail, siteConfig } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

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
      "relative isolate overflow-hidden border-t",
      editorial
        ? "border-editorial-line bg-editorial-soft text-editorial-ink"
        : "border-border-subtle/60 bg-canvas text-ink"
    )}>
      {editorial ? null : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(45%_100%_at_50%_0%,rgb(var(--or-coral)/0.12),transparent_75%)]" />
      )}
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr_0.95fr] lg:gap-10">
          <div>
            <Link href="/" className={cn("inline-flex items-center gap-2.5 font-heading text-xl font-semibold tracking-[-0.03em]", editorial ? "text-editorial-ink" : "text-ink")} aria-label={`${siteConfig.name} home`}>
              <span className={cn("grid h-7 w-7 place-items-center rounded-[8px] border", editorial ? "border-editorial-line bg-white" : "border-accent-warm/30 bg-accent-warm/10")}>
                <Image src="/favicon.svg" alt="" width={18} height={18} />
              </span>
              <span><span className="text-accent-warm">Open</span>Redakt</span>
            </Link>
            <p className={cn("mt-5 max-w-xs text-sm leading-6", editorial ? "text-editorial-muted" : "text-ink-muted")}>
              AI-assisted redaction workflows for documents and audio in a native Windows application.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className={cn("type-meta uppercase tracking-[0.12em]", editorial ? "text-editorial-ink" : "text-ink")}>{group.title}</h2>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href.startsWith("#") && !homePage ? `/${link.href}` : link.href} className={cn("inline-flex min-h-9 items-center text-sm transition-colors", editorial ? "text-editorial-muted hover:text-editorial-ink" : "text-ink-muted hover:text-ink")}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className={cn("type-meta uppercase tracking-[0.12em]", editorial ? "text-editorial-ink" : "text-ink")}>Connect</h2>
            <div className="mt-4 space-y-3">
              {homePage ? (
                <a href="#demo-enquiry" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover">
                  <Icon name="arrow" size={16} />
                  Request a Demo
                </a>
              ) : (
                <Link href={demoHref} className="inline-flex items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover">
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
          "type-meta mt-14 flex flex-col gap-3 border-t pt-7 sm:flex-row sm:items-center sm:justify-between",
          editorial ? "border-editorial-line text-editorial-muted" : "border-border-subtle/60 text-ink-muted"
        )}>
          <p>{siteConfig.name} &copy; {new Date().getFullYear()} All rights reserved.</p>
          <p>Windows desktop software · Verify exported results before use.</p>
        </div>
      </Container>
    </footer>
  );
}
