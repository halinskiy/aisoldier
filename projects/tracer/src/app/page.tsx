import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Ownership } from "@/components/sections/Ownership";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { MobileStub } from "@/components/MobileStub";

/**
 * Tracer by NoCorny - desktop-first landing.
 *
 * Section order + theme rhythm:
 *   Nav (light) -> Hero (DARK) -> How it works (light) -> Features (light)
 *   -> Ownership (DARK) -> FAQ (light) -> Final CTA (DARK) -> Footer (light)
 *
 * The full desktop experience is hidden below md; the mobile stub is hidden md+.
 */
export default function Home() {
  return (
    <>
      {/* Mobile: deliberate single-screen stub */}
      <MobileStub />

      {/* Desktop: the full experience */}
      <div className="hidden md:block">
        <Nav />
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <Ownership />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
