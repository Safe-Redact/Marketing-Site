import { heroContent } from "@/content/hero";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient pb-16 pt-28 md:pb-20 md:pt-32">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/[0.07] animate-pulse-glow" />
        <div className="absolute top-1/2 -left-48 h-80 w-80 rounded-full bg-accent/[0.04] animate-float-slow" />
        <div className="absolute bottom-0 right-0 h-64 w-64 dot-pattern text-white/[0.04]" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: Text */}
          <div>
            <AnimateOnScroll>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-1.5 ring-1 ring-white/[0.1] mb-5">
                <Icon name="shield-check" size={16} className="text-accent" />
                <span className="text-caption font-medium text-white/80">Professional Redaction Service</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <h1 className="text-display-sm font-bold text-white md:text-display lg:text-display-lg text-balance">
                {heroContent.headline}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="mt-5 max-w-lg text-body-lg text-white/60">
                {heroContent.subheadline}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div className="mt-7 flex flex-wrap gap-4">
                <Button variant="primary" size="lg" asChild>
                  <a href={heroContent.primaryCta.href}>
                    {heroContent.primaryCta.label}
                    <Icon name="arrow" size={18} />
                  </a>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <a href={heroContent.secondaryCta.href} className="border-white/20 text-white hover:border-accent hover:text-accent">
                    {heroContent.secondaryCta.label}
                  </a>
                </Button>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={400}>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {heroContent.trustIndicators.map((indicator) => (
                  <span key={indicator} className="flex items-center gap-2 text-body-sm text-white/40">
                    <Icon name="check-circle" size={15} className="text-accent/70" />
                    {indicator}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: Visual */}
          <AnimateOnScroll delay={200}>
            <HeroVisual />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-accent/[0.06] blur-3xl" />

      <div className="relative rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/[0.06] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
              <Icon name="shield-check" size={14} className="text-accent" />
            </div>
            <span className="text-body-sm font-medium text-white/70">Secure Processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-xs text-white/40">Active</span>
          </div>
        </div>

        <div className="space-y-2">
          <FileRow icon="document" type="PDF" name="Legal_Document_2024.pdf" status="processed" />
          <FileRow icon="video" type="MP4" name="Interview_Recording.mp4" status="processing" />
          <FileRow icon="audio" type="WAV" name="Deposition_Audio.wav" status="queued" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
          <div className="text-center">
            <div className="text-heading font-bold text-white">99.8%</div>
            <div className="text-[11px] text-white/40">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-heading font-bold text-white">24h</div>
            <div className="text-[11px] text-white/40">Turnaround</div>
          </div>
          <div className="text-center">
            <div className="text-heading font-bold text-white">100%</div>
            <div className="text-[11px] text-white/40">Confidential</div>
          </div>
        </div>
      </div>

      {/* Floating accents */}
      <div className="absolute -top-3 -right-5 h-14 w-14 rounded-2xl bg-accent/10 ring-1 ring-accent/20 animate-float-medium items-center justify-center hidden sm:flex">
        <Icon name="lock" size={22} className="text-accent" />
      </div>
      <div className="absolute -bottom-3 -left-5 h-12 w-12 rounded-xl bg-white/[0.06] ring-1 ring-white/[0.1] animate-float-slow items-center justify-center hidden sm:flex" style={{ animationDelay: "1.5s" }}>
        <Icon name="check-circle" size={20} className="text-success" />
      </div>
    </div>
  );
}

function FileRow({ icon, type, name, status }: { icon: string; type: string; name: string; status: "processed" | "processing" | "queued" }) {
  const statusConfig = {
    processed: { color: "text-success", bg: "bg-success/10", label: "Done" },
    processing: { color: "text-accent", bg: "bg-accent/10", label: "Active" },
    queued: { color: "text-white/40", bg: "bg-white/5", label: "Queue" },
  };
  const s = statusConfig[status];

  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] p-2.5 ring-1 ring-white/[0.05]">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${s.bg}`}>
        <Icon name={icon} size={16} className={s.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-body-sm font-medium text-white/80 truncate">{name}</div>
        <div className="text-[11px] text-white/30">{type}</div>
      </div>
      <div className={`text-[11px] font-medium ${s.color}`}>{s.label}</div>
    </div>
  );
}
