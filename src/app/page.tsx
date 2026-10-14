import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Industries } from "@/components/sections/Industries";
import { WhySafeRedact } from "@/components/sections/WhySafeRedact";
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
        <HowItWorks />
        <WhySafeRedact />
        <Industries />
        <Faq />
        <FinalCta />
      </main>
      <Footer homePage />
    </>
  );
}
