import { Accordion } from "@/components/ui/Accordion";
import { pricingFaqs } from "@/content/pricing";

export function PricingFaq() {
  return <Accordion items={pricingFaqs} defaultOpenIndex={0} />;
}

