import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { WhyRedaction } from "@/components/sections/WhyRedaction";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Industries } from "@/components/sections/Industries";
import { WhySafeRedact } from "@/components/sections/WhySafeRedact";
import { QualitySecurity } from "@/components/sections/QualitySecurity";
import { SoftwareAlternative } from "@/components/sections/SoftwareAlternative";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Services />
        <WhyRedaction />
        <HowItWorks />
        <Industries />
        <WhySafeRedact />
        <QualitySecurity />
        <SoftwareAlternative />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
