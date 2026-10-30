import Link from "next/link";
import type { CaptureId } from "@/content/media";
import { ProductStoryVisual } from "@/components/media/ProductStoryVisual";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Story = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  points: readonly string[];
  link: { label: string; href: string };
  visual: { capture: CaptureId; crop: string; mobileCrop: string; alt: string };
};

/**
 * Copy is checked against the capability register: document marks and reasons
 * (DOC-MANUAL, DOC-REVIEW), conditional detection and OCR (DOC-CANDIDATES, DOC-OCR),
 * audio ranges, effects and preview (AUD-TIMELINE, AUD-EFFECTS, AUD-PREVIEW).
 */
const stories: readonly Story[] = [
  {
    id: "document",
    number: "01",
    eyebrow: "Document redaction",
    title: "Find it. Review it. Redact it.",
    body: "Open PDFs, scans and office files. Where detection is configured, findings wait for your decision. Anything else you mark yourself, by selecting text or drawing an area, with a reason on every mark.",
    points: ["Text and area marks", "A reason on every mark", "OCR for scans when configured"],
    link: { label: "Explore document redaction", href: "/features/document-redaction" },
    visual: {
      capture: "document-workspace",
      crop: "story",
      mobileCrop: "manualMobile",
      alt: "The OpenRedakt document workspace with no document open: the manual redaction panel with selection modes and reasons, the page tools, and the project panel listing files with their preparation status. Project and file names are blurred.",
    },
  },
  {
    id: "audio",
    number: "02",
    eyebrow: "Audio redaction",
    title: "Every second matters.",
    body: "Spoken detail lives in a moment. Select the exact range on the waveform, or type its start and end, choose a masking effect and, where supported, preview it before a new file is rendered.",
    points: ["Waveform and timeline review", "Mute, tone, silence or noise", "Preview before export"],
    link: { label: "Explore audio redaction", href: "/features/audio-redaction" },
    visual: {
      capture: "audio-workspace",
      crop: "story",
      mobileCrop: "storyMobile",
      alt: "The OpenRedakt audio workspace: masking effects and range controls beside a recording's waveform, transport controls and timeline. File names in the side panel are blurred.",
    },
  },
];

/**
 * Product stories on the bounded warm band (hairline dividers top and bottom). Each
 * story is one balanced row: text on one side, the product window on the other,
 * mirrored for the second story. Both visual columns share one width and crop ratio,
 * so the document and audio windows are always the same size.
 */
export function WhySafeRedact() {
  return (
    <section id="why-saferedact" aria-label="Document and audio redaction" className="story-surface section-y text-ink">
      <Container>
        <div className="space-y-20 sm:space-y-24 lg:space-y-32">
          {stories.map((story, index) => {
            const flip = index % 2 === 1;
            return (
              <article
                key={story.id}
                aria-labelledby={`story-${story.id}`}
                className={cn(
                  "grid items-center gap-10 lg:gap-16",
                  flip ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]" : "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
                )}
              >
                <AnimateOnScroll className={cn("min-w-0", flip && "lg:order-2")}>
                  <p className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-canvas py-1 pl-1 pr-3 text-[0.8125rem] font-medium text-ink">
                    <span className="rounded-full bg-accent-warm px-2 py-0.5 text-[0.75rem] font-semibold text-on-accent">{story.number}</span>
                    {story.eyebrow}
                  </p>
                  <h2 id={`story-${story.id}`} className="mt-5 font-heading text-[clamp(1.875rem,1.35rem+1.6vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                    {story.title}
                  </h2>
                  <p className="mt-5 max-w-[30rem] text-[1rem] leading-7 text-ink-muted">{story.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${story.eyebrow} highlights`}>
                    {story.points.map((point) => (
                      <li key={point} className="rounded-full border border-border-subtle bg-canvas px-3 py-1 text-[0.8125rem] text-ink">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link href={story.link.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-ink-hover motion-reduce:transition-none">
                    {story.link.label}
                    <Icon name="arrow" size={16} />
                  </Link>
                </AnimateOnScroll>
                <AnimateOnScroll delay={80} className={cn("min-w-0", flip && "lg:order-1")}>
                  <ProductStoryVisual {...story.visual} />
                </AnimateOnScroll>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
