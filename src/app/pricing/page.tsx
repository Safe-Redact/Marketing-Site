import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { FinalCta } from "@/components/sections/FinalCta";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  pricingLicensingSteps,
  pricingPackages,
  type PricingPackageSlug,
} from "@/content/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare OpenRedakt annual licenses for document redaction, audio redaction, or both supported workflows.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: "/pricing",
    title: "OpenRedakt Pricing",
    description:
      "Annual per-license pricing for OpenRedakt document and audio redaction workflows.",
  },
};

interface PricingPageProps {
  searchParams: Promise<{ package?: string | string[] }>;
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const parameters = await searchParams;
  const requestedPackage = Array.isArray(parameters.package)
    ? parameters.package[0]
    : parameters.package;
  const initialPackage = pricingPackages.some((plan) => plan.slug === requestedPackage)
    ? (requestedPackage as PricingPackageSlug)
    : undefined;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-canvas text-ink">
        <section className="hero-gradient border-b border-border-subtle pt-[8.75rem] sm:pt-[10rem] lg:pt-[11.5rem]">
          <Container className="pb-16 sm:pb-20 lg:pb-24">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.62fr] lg:gap-16">
              <div>
                <Eyebrow>Annual license pricing</Eyebrow>
                <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink text-balance">
                  Redaction software that fits the work you do.
                </h1>
                <p className="mt-6 max-w-2xl text-body-lg leading-8 text-ink-muted">
                  Choose a license for document workflows, audio workflows, or both. Each package helps teams review and protect sensitive information before it is shared.
                </p>
              </div>
              <div className="rounded-panel border border-accent-cool/25 bg-accent-cool/5 p-6 sm:p-7">
                <p className="font-heading text-lg font-semibold text-ink">
                  Per license. Billed annually.
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Monthly figures are planning equivalents. OpenRedakt does not present a month-to-month payment schedule on this page.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="packages-heading">
          <Container>
            <AnimateOnScroll>
              <SectionHeading
                eyebrow="Choose your workflow"
                title={<span id="packages-heading">Three packages, clearly scoped</span>}
                description="Essential and Advanced are separate, capability-specific packages: Essential covers documents and Advanced covers audio. Complete Suite combines both supported workflows under one license."
              />
            </AnimateOnScroll>
            <div className="mt-10 lg:mt-12">
              <PricingCards />
            </div>
          </Container>
        </section>

        <section id="compare" className="scroll-mt-24 border-y border-border-subtle bg-surface-raised/35 py-16 sm:py-20 lg:py-24" aria-labelledby="comparison-heading">
          <Container>
            <AnimateOnScroll>
              <SectionHeading
                eyebrow="Package comparison"
                title={<span id="comparison-heading">Compare packages</span>}
                description="The differences that matter when choosing a package. Supported file formats and technical requirements are covered in the FAQ below."
              />
            </AnimateOnScroll>
            <div className="mt-10 lg:mt-12">
              <PricingComparison />
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="licensing-heading">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <AnimateOnScroll>
                <SectionHeading
                  eyebrow="Licensing"
                  title={<span id="licensing-heading">How licensing works</span>}
                  description="OpenRedakt uses sales-led provisioning and named-user licenses. Your team manages assigned access in the Control Center; this page does not imply online checkout or instant activation."
                />
              </AnimateOnScroll>
              <ol className="grid gap-4 sm:grid-cols-2">
                {pricingLicensingSteps.map((item, index) => (
                  <AnimateOnScroll key={item.title} delay={index * 60}>
                    <li className="h-full rounded-card border border-border-subtle bg-surface-raised p-6">
                      <span className="grid h-10 w-10 place-items-center rounded-control border border-accent-cool/20 bg-accent-cool/10 font-heading text-sm font-semibold text-accent-cool">
                        {index + 1}
                      </span>
                      <h3 className="mt-5 font-heading text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-ink-muted">{item.description}</p>
                    </li>
                  </AnimateOnScroll>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        <section className="border-t border-border-subtle bg-surface-raised/35 py-16 sm:py-20 lg:py-24" aria-labelledby="pricing-faq-heading">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <AnimateOnScroll>
                <SectionHeading
                  eyebrow="Pricing FAQ"
                  title={<span id="pricing-faq-heading">Questions before you choose</span>}
                  description="The sales team can confirm the commercial and deployment details that depend on your organization."
                />
              </AnimateOnScroll>
              <AnimateOnScroll delay={100}>
                <PricingFaq />
              </AnimateOnScroll>
            </div>
          </Container>
        </section>

        <FinalCta initialPackage={initialPackage} />
      </main>
      <Footer />
    </>
  );
}

