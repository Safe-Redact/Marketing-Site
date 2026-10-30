import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { WhySafeRedact } from "@/components/sections/WhySafeRedact";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { InsightsPreview } from "@/components/sections/InsightsPreview";
import { Faq } from "@/components/sections/Faq";

/**
 * The homepage story (docs/design/homepage-storytelling-revision.md): the promise with
 * the product in the first screen, the problem, document and audio evidence on a warm
 * band, the shared workflow, why OpenRedakt, who it is for, questions, the blog, then
 * the footer's closing invitation.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" data-home-page>
        <Hero />
        <ProblemStatement />
        <WhySafeRedact />
        <HowItWorks />
        <Services />
        <Industries />
        <Faq />
        <InsightsPreview />
      </main>
      <Footer homePage />
    </>
  );
}
