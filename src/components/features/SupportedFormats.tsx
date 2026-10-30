import React from "react";
import { Icon } from "@/components/ui/Icon";

export function SupportedFormats({ formats, note }: { formats: readonly string[]; note: string }) {
  return (
    <div>
      <p className="type-eyebrow">Supported inputs</p>
      <ul className="mt-6 grid border-t border-border-subtle/60 sm:grid-cols-2 sm:gap-x-8">
        {formats.map((format) => (
          <li key={format} className="flex items-start gap-3 border-b border-border-subtle/60 py-3.5 text-[0.9375rem] leading-6 text-ink">
            <Icon name="file-text" size={17} className="mt-0.5 shrink-0 text-accent-ink" />
            <span>{format}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-xl text-sm leading-6 text-ink-muted">{note}</p>
    </div>
  );
}
