import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { ReviewStatement } from "@/components/sections/ReviewStatement";
import { WhySafeRedact } from "@/components/sections/WhySafeRedact";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { InsightsPreview } from "@/components/sections/InsightsPreview";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Section rhythm: ember hero handing over to warm white (showcase, capabilities,
 * statement), dark product storytelling, light advantages and sectors, dark editorial
 * and questions, then the closing enquiry. Each light/dark change is a rounded sheet.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" data-home-page>
        <Hero />
        <TrustBar />
        <ReviewStatement />
        <WhySafeRedact />
        <HowItWorks />
        <Services />
        <Industries />
        <InsightsPreview />
        <Faq />
        <FinalCta />
      </main>
      <Footer homePage />
    </>
  );
}
