import Link from "next/link";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * What sets OpenRedakt apart, limited to what the application verifiably does:
 * reviewer decisions (DOC-REVIEW, AUD-TIMELINE), both workflows in one app, the optional
 * report of reviewed actions (DOC-REPORT; shown in the export dialog), and exports written to a
 * folder the user chooses (export dialog). No offline, compliance or accuracy claims.
 */
const reasons = [
  {
    icon: "check-circle",
    title: "Every mark is a decision",
    description: "Detection proposes. A reviewer accepts, rejects or adds marks and time ranges before anything is exported.",
  },
  {
    icon: "layers",
    title: "Documents and audio, one application",
    description: "PDFs, scans, office files and recordings are reviewed in the same app, each on the surface it needs: a page or a waveform.",
  },
  {
    icon: "file-text",
    title: "A record of what was redacted",
    description: "Optionally write a machine- and human-readable report of what was redacted alongside the export. It never quotes the redacted text.",
  },
  {
    icon: "settings",
    title: "On your desktop, in your folders",
    description: "OpenRedakt is a Windows desktop application. Each export is written as a new file to a folder you choose.",
  },
] as const;

export function Services() {
  return (
    <section id="services" aria-labelledby="why-heading" className="story-band section-y text-ink">
      <Container>
        <AnimateOnScroll className="mx-auto max-w-[44rem] text-center">
          <p className="type-eyebrow">Why OpenRedakt</p>
          <h2 id="why-heading" className="mt-4 font-heading text-[clamp(2rem,1.4rem+2.1vw,3.25rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ink text-balance">
            Built for the review, not just the redaction.
          </h2>
        </AnimateOnScroll>
        <div className="mx-auto mt-14 grid max-w-[64rem] gap-4 sm:grid-cols-2 sm:gap-5">
          {reasons.map((reason, index) => (
            <AnimateOnScroll key={reason.title} delay={index * 70}>
              <article className="h-full rounded-[20px] border border-[rgb(28_25_23/0.07)] bg-canvas p-7 sm:p-8">
                <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-accent-warm/10 text-accent-ink">
                  <Icon name={reason.icon} size={18} />
                </span>
                <h3 className="mt-6 font-heading text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{reason.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-7 text-ink-muted">{reason.description}</p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/why-openredakt" className="inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none">
            How OpenRedakt describes its limits
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
