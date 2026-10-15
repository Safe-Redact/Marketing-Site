import Image from "next/image";
import { workflowPreviewLabels, workflowSteps } from "@/content/platform";
import { Icon } from "@/components/ui/Icon";

/**
 * One authentic capture per workflow step, so selecting a step shows the screen that
 * step actually happens on: the project workspace, the editor mid-review, and the
 * export dialog with its verification notice.
 */
const stepScreenshots = [
  {
    src: "/images/product/step-open.png",
    alt: "Screenshot of the SafeRedact project workspace listing recent redaction projects with their type, status and progress",
    width: 1467,
    height: 844,
  },
  {
    src: "/images/product/step-review.png",
    alt: "Screenshot of the SafeRedact document editor: a page marked for redaction beside the manual redaction tools and the findings list",
    width: 1463,
    height: 869,
  },
  {
    src: "/images/product/step-export.png",
    alt: "Screenshot of the SafeRedact export dialog: output settings beside a notice that every export is re-opened and checked by a second engine before it is published",
    width: 1048,
    height: 655,
  },
] as const;

interface WorkflowPreviewProps {
  activeIndex: number;
}

export function WorkflowPreview({ activeIndex }: WorkflowPreviewProps) {
  const active = workflowSteps[activeIndex] ?? workflowSteps[0];
  const screenshot = stepScreenshots[activeIndex] ?? stepScreenshots[0];

  return (
    <figure
      className="relative min-h-[390px] overflow-hidden rounded-panel border border-border-subtle bg-[#0c111f] p-4 shadow-panel sm:min-h-[440px] sm:p-6"
      aria-label={workflowPreviewLabels.figureLabel}
    >
      <div className="relative flex items-center justify-between rounded-card border border-border-subtle bg-surface-raised/90 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-control bg-accent-warm/15 text-accent-warm">
            <Icon name="document" size={17} />
          </span>
          <div>
            <p className="font-heading text-xs font-semibold text-ink">{workflowPreviewLabels.file}</p>
            <p className="text-[10px] text-ink-muted">{workflowPreviewLabels.project}</p>
          </div>
        </div>
        <span className="rounded-control border border-accent-cool/25 bg-accent-cool/10 px-2.5 py-1 text-[10px] font-semibold text-accent-cool">
          {active.previewLabel}
        </span>
      </div>

      <div
        className="product-visual relative mt-4 w-full overflow-hidden"
        style={{ aspectRatio: `${screenshot.width} / ${screenshot.height}` }}
      >
        <Image
          key={screenshot.src}
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          sizes="(max-width: 639px) 100vw, 640px"
          quality={92}
          className="object-cover"
        />
      </div>
      <p className="relative mt-3 flex items-center gap-2 text-[10px] text-accent-mint">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {active.title}
      </p>
      <figcaption className="sr-only">
        {workflowPreviewLabels.caption}
      </figcaption>
    </figure>
  );
}
