import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

interface FormatPreviewProps {
  visual: string;
  fileLabel: string;
}

/**
 * The per-format panel under "Why SafeRedact".
 *
 * All three formats show authentic captures of the application, each at its own
 * aspect ratio so the whole screen is visible rather than cropped into a fixed box.
 */
interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const screenshots: Record<string, Screenshot> = {
  document: {
    src: "/images/product/format-documents.png",
    alt: "Screenshot of the SafeRedact document editor: a page marked for redaction beside the manual redaction tools, the reason library and the findings list",
    width: 1463,
    height: 869,
  },
  audio: {
    src: "/images/product/format-audio.png",
    alt: "Screenshot of the SafeRedact audio workspace: a waveform beside a speaker-separated transcript, with transport controls and the timeline below",
    width: 1102,
    height: 715,
  },
  video: {
    src: "/images/product/format-video.png",
    alt: "Screenshot of the SafeRedact video workspace: a frame in the preview pane with the pixelate effect and its level, beside the project files and the timeline",
    width: 1479,
    height: 806,
  },
};

export function FormatPreview({ visual, fileLabel }: FormatPreviewProps) {
  const screenshot = screenshots[visual];

  return (
    <figure className="relative min-h-[310px] overflow-hidden rounded-panel border border-border-subtle bg-[#0c111f] p-5 sm:min-h-[390px] sm:p-7">
      <div className="relative flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-control bg-accent-cool/10 text-accent-cool">
            <Icon name={visual === "audio" ? "audio" : visual === "video" ? "video" : "document"} size={18} />
          </span>
          <div>
            <p className="font-heading text-xs font-semibold text-ink">{fileLabel}</p>
            <p className="text-[10px] text-ink-muted">Review workspace</p>
          </div>
        </div>
        <span className="rounded-control border border-accent-mint/25 bg-accent-mint/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-accent-mint">Ready</span>
      </div>

      {screenshot ? <ScreenshotPanel {...screenshot} /> : null}
      <figcaption className="sr-only">{screenshot?.alt}</figcaption>
    </figure>
  );
}

/**
 * Full width of the figure, at the screenshot's own aspect ratio, so the whole
 * application screen is visible and nothing is cropped. The earlier 380px width cap
 * was inherited from the illustration these replaced and stranded the screenshot in
 * empty space.
 */
function ScreenshotPanel({ src, alt, width, height }: Screenshot) {
  return (
    <div
      className="product-visual relative mt-6 w-full overflow-hidden"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        // ~290px on a phone, ~612px from sm; 2x of the widest case keeps UI text crisp.
        sizes="(max-width: 639px) 100vw, 640px"
        quality={92}
        className="object-cover"
      />
    </div>
  );
}
