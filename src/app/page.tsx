import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { HeroSection } from "@/components/home/HeroSection";
import { TutorialSection } from "@/components/home/TutorialSection";
import { FaqSection } from "@/components/home/FaqSection";

/**
 * Root home page.
 *
 * Composes four sections:
 *  1. Hero + InvoiceForm — dark forest-green background; white card floats on it
 *  2. TutorialSection — white background; four how-to steps
 *  3. FaqSection — dark forest-green background; accordion
 */
export default function HomePage() {
  return (
    <>
      <section className="bg-[#163016] pb-16">
        <HeroSection />
        <InvoiceForm />
      </section>
      <TutorialSection />
      <FaqSection />
    </>
  );
}
