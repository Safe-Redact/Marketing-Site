import Image from "next/image";
import { cn } from "@/lib/utils";
import { workbenchLabels } from "@/content/platform";

/**
 * The hero product visual: the complete Safe Redact editor, uncropped.
 *
 * The frame carries the screenshot's own aspect ratio rather than a fixed one, so
 * the whole application window is shown with nothing trimmed. At 608px wide that is
 * 379px tall, seven pixels more than the illustration it replaced — the hero's
 * layout, spacing and type are otherwise untouched.
 */
const SOURCE = { width: 1460, height: 873 };

export function RedactionWorkbench({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "product-visual relative mx-auto w-full max-w-[608px] overflow-hidden",
        className
      )}
      style={{ aspectRatio: `${SOURCE.width} / ${SOURCE.height}` }}
      aria-label={workbenchLabels.figureLabel}
      data-hero-workbench
    >
      <Image
        src="/images/product/hero-document-review.png"
        alt={workbenchLabels.figureLabel}
        fill
        sizes="(max-width: 991px) 100vw, 608px"
        quality={92}
        className="object-cover"
        priority
      />
      <figcaption className="sr-only">{workbenchLabels.caption}</figcaption>
    </figure>
  );
}
