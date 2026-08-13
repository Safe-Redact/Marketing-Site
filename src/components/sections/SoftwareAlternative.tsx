import { softwareContent } from "@/content/software";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function SoftwareAlternative() {
  return (
    <section className="relative py-section overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800" />
      <div className="absolute inset-0 dot-pattern text-white/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/[0.06] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <AnimateOnScroll>
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-1.5 ring-1 ring-white/[0.1] mb-6">
                <Icon name="download" size={16} className="text-accent" />
                <span className="text-caption font-medium text-white/80">Desktop Software</span>
              </div>

              <h2 className="text-display-sm font-bold text-white">
                {softwareContent.headline}
              </h2>
              <p className="mt-4 text-body-lg text-white/60">
                {softwareContent.description}
              </p>

              <ul className="mt-6 space-y-3">
                {softwareContent.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-body text-white/70">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Icon name="check-circle" size={14} className="text-accent" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Button variant="primary" size="lg" asChild>
                  <a
                    href={softwareContent.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {softwareContent.cta.label}
                    <Icon name="external-link" size={16} />
                  </a>
                </Button>
                <span className="text-caption text-white/40">{softwareContent.platform}</span>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right: Visual */}
          <AnimateOnScroll delay={200} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl bg-accent/[0.08] blur-3xl" />

              {/* Windows-style app mockup */}
              <div className="relative rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.08] backdrop-blur-sm overflow-hidden">
                {/* Windows title bar */}
                <div className="flex items-center justify-between bg-white/[0.04] px-4 py-2.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-accent/20">
                      <Icon name="shield-check" size={12} className="text-accent" />
                    </div>
                    <span className="text-xs font-medium text-white/60">SafeRedact</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-white/10 hover:bg-white/20 transition-colors" />
                    <div className="h-3 w-3 rounded-sm bg-white/10 hover:bg-white/20 transition-colors" />
                    <div className="h-3 w-3 rounded-sm bg-red-400/60 hover:bg-red-400/80 transition-colors" />
                  </div>
                </div>

                {/* App content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-white/[0.04] p-3 ring-1 ring-white/[0.05]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                      <Icon name="video" size={18} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-3/4 rounded-full bg-white/20" />
                      <div className="mt-1.5 h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                    <Icon name="check-circle" size={18} className="text-success" />
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white/[0.04] p-3 ring-1 ring-white/[0.05]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                      <Icon name="document" size={18} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-2/3 rounded-full bg-white/20" />
                      <div className="mt-1.5 h-2 w-3/5 rounded-full bg-white/10" />
                    </div>
                    <Icon name="check-circle" size={18} className="text-success" />
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between bg-white/[0.03] px-4 py-2 border-t border-white/[0.06] text-xs text-white/30">
                  <span>Fully offline</span>
                  <span>AI-powered detection</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
