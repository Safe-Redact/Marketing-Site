import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * Why review matters: a centred statement over an illustrative composition of where
 * sensitive detail sits (a scanned page, an office file, a recording) and where it goes
 * (the recipients), around a single review step. The illustration is decorative
 * (aria-hidden): the heading and copy carry the meaning, and the cards show generic
 * examples, not product screens or customer data.
 */
export function ProblemStatement() {
  return (
    <section aria-labelledby="problem-heading" className="section-y overflow-hidden bg-canvas text-ink">
      <Container>
        <AnimateOnScroll className="mx-auto max-w-[46rem] text-center">
          <p className="inline-flex rounded-full bg-accent-warm/10 px-3.5 py-1 text-[0.8125rem] font-medium text-accent-ink">Why review matters</p>
          <h2 id="problem-heading" className="mt-5 font-heading text-[clamp(2rem,1.4rem+2.1vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink text-balance">
            Information moves. <span className="text-accent-ink">Risk follows.</span>
          </h2>
          <p className="type-lede mx-auto mt-5 max-w-[38rem]">
            A name on a scanned page or a few seconds of speech travels with every copy you send: to courts, regulators, requesters and the public. One missed detail goes wherever the file goes.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={120} className="mt-14 sm:mt-16">
          <div aria-hidden="true" className="problem-map relative mx-auto max-w-[64rem]">
            {/* Connectors (desktop): dotted lines from each card to the review step. */}
            <svg className="absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 420" preserveAspectRatio="none">
              <g fill="none" stroke="rgb(194 65 42 / 0.35)" strokeWidth="1.5" strokeDasharray="3 6">
                <path d="M250 92 C 380 92, 400 210, 470 210" />
                <path d="M250 318 C 380 318, 400 210, 470 210" />
                <path d="M750 92 C 620 92, 600 210, 530 210" />
                <path d="M750 318 C 620 318, 600 210, 530 210" />
              </g>
            </svg>

            <div className="relative grid gap-4 sm:grid-cols-2 lg:h-[26.25rem] lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-2 lg:items-center lg:gap-x-16 lg:gap-y-10">
              {/* Scanned page with highlighted details */}
              <div className="problem-card lg:col-start-1 lg:row-start-1">
                <CardHeader icon="document" title="Scanned statement" meta="Page 14 of 52" />
                <div className="mt-4 space-y-2">
                  <Line width="w-11/12" />
                  <div className="flex items-center gap-2"><Line width="w-1/3" /><Tag>Account number</Tag></div>
                  <Line width="w-4/5" />
                  <div className="flex items-center gap-2"><Line width="w-1/4" /><Tag>Signature</Tag></div>
                </div>
              </div>

              {/* Recording with a spoken identifier */}
              <div className="problem-card lg:col-start-1 lg:row-start-2">
                <CardHeader icon="audio" title="Interview recording" meta="42 min" />
                <div className="mt-4 flex h-10 items-center gap-[3px]">
                  {[6, 14, 9, 22, 12, 28, 18, 34, 30, 16, 26, 12, 20, 8, 15, 24, 10, 18, 7, 12].map((h, i) => (
                    <span key={i} className={i >= 7 && i <= 10 ? "w-1.5 rounded-full bg-accent-warm" : "w-1.5 rounded-full bg-ink/15"} style={{ height: `${h}px` }} />
                  ))}
                </div>
                <div className="mt-3"><Tag>02:14 – 02:16 · a phone number, spoken</Tag></div>
              </div>

              {/* The review step */}
              <div className="order-first flex flex-col items-center justify-center gap-3 py-4 sm:col-span-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <span className="problem-core grid h-24 w-24 place-items-center rounded-[28px] sm:h-28 sm:w-28">
                  <Image src="/favicon.svg" alt="" width={44} height={44} />
                </span>
                <span className="rounded-full border border-border-subtle bg-canvas px-3 py-1 text-[0.8125rem] font-medium text-ink">Reviewed before export</span>
              </div>

              {/* Where copies go */}
              <div className="problem-card lg:col-start-3 lg:row-start-1">
                <CardHeader icon="send" title="Shared with" meta="Every copy" />
                <ul className="mt-4 flex flex-wrap gap-2">
                  {["Court", "Regulator", "Records request", "Public release", "Another team"].map((to) => (
                    <li key={to} className="rounded-full bg-surface-active px-2.5 py-1 text-[0.75rem] text-ink-muted">{to}</li>
                  ))}
                </ul>
              </div>

              {/* Office file with highlighted details */}
              <div className="problem-card lg:col-start-3 lg:row-start-2">
                <CardHeader icon="file-text" title="Investigation report" meta="Office file" />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2"><Line width="w-1/5" /><Tag>Name</Tag><Line width="w-1/4" /></div>
                  <Line width="w-full" />
                  <div className="flex items-center gap-2"><Line width="w-2/5" /><Tag>Home address</Tag></div>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="mt-12 text-center">
          <Link
            href="/blog/understanding-document-redaction"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none"
          >
            Why hiding is not the same as redaction
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function CardHeader({ icon, title, meta }: { icon: string; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-accent-warm/10 text-accent-ink">
        <Icon name={icon} size={16} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[0.875rem] font-semibold text-ink">{title}</span>
      <span className="shrink-0 text-[0.75rem] text-ink-muted">{meta}</span>
    </div>
  );
}

function Line({ width }: { width: string }) {
  return <span className={`block h-2 rounded-full bg-ink/10 ${width}`} />;
}

function Tag({ children }: { children: string }) {
  return <span className="inline-flex shrink-0 rounded-[6px] border border-accent-warm/40 bg-accent-warm/10 px-2 py-0.5 text-[0.6875rem] font-medium text-[#9f351e]">{children}</span>;
}
