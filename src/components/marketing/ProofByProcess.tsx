import React from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

const points = [
  { icon: "search", title: "Suggestions stay reviewable", description: "Detection candidates are presented for assessment; they do not silently become final decisions." },
  { icon: "users", title: "Human judgment stays visible", description: "Manual marks, approvals, rejections, ranges, and reasons remain part of the working record." },
  { icon: "shield-check", title: "Output is another checkpoint", description: "Rendered files are inspected before release rather than treated as correct because an export completed." },
] as const;

export function ProofByProcess() {
  return (
    <section className="bg-canvas py-12 sm:py-14">
      <Container>
        <div className="grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border-subtle/50">
          {points.map((point) => (
            <div key={point.title} className="flex gap-4 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-border-subtle/70 bg-surface-raised text-accent-ink"><Icon name={point.icon} size={18} /></span>
              <div><h2 className="type-h3">{point.title}</h2><p className="mt-2 text-body leading-6 text-ink-muted">{point.description}</p></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

