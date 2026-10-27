import Link from "next/link";
import { industryGroups, industryHref, liveIndustryPages } from "@/content/industries";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * Sector pathways: every published industry guide, grouped as on /industries.
 * Drafts never appear because the list comes from the live registry entries.
 */
export function Industries() {
  const groups = industryGroups
    .map((group) => ({ ...group, pages: liveIndustryPages.filter((page) => page.group === group.id) }))
    .filter((group) => group.pages.length > 0);

  return (
    <section id="industries" className="theme-light section-y relative bg-canvas pb-32 text-ink lg:pb-40">
      <Container>
        <AnimateOnScroll className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="type-eyebrow">Use cases</p>
            <h2 className="type-h2 mt-4 max-w-[20ch]">
              Prepare sensitive records for the next step. <span className="type-quiet">Guides by sector.</span>
            </h2>
            <p className="type-body mt-5 max-w-xl">
              Teams use redaction when records need to move into filing, disclosure, release, research, or controlled internal review.
            </p>
          </div>
          <Link href="/industries" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent-warm transition-colors hover:text-accent-warm-hover motion-reduce:transition-none">
            Browse the industry guides
            <Icon name="arrow" size={16} />
          </Link>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-border-subtle/50 bg-border-subtle/50 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group, index) => (
            <AnimateOnScroll key={group.id} delay={index * 70} className="bg-canvas">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <h3 className="type-h3">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{group.description}</p>
                <ul className="mt-6 border-t border-border-subtle/60">
                  {group.pages.map((page) => (
                    <li key={page.slug} className="border-b border-border-subtle/60">
                      <Link href={industryHref(page.slug)} className="group flex min-h-11 items-center justify-between gap-3 py-2.5 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cool motion-reduce:transition-none">
                        <span className="flex items-center gap-3">
                          <Icon name={page.icon} size={16} className="text-accent-warm" />
                          {page.navLabel}
                        </span>
                        <Icon name="arrow" size={15} className="opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
