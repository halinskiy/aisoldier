"use client";

import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Ownership } from "@/components/sections/Ownership";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { MobileStub } from "@/components/MobileStub";
import { ScrollDot } from "@ui-kit/components/motion/ScrollDot";
import { useGlobalProgress } from "@/hooks/useGlobalProgress";

/**
 * The ScrollDot hand-off windows, in page-progress order (it stays visible
 * EXCEPT inside these windows, where it fades to its section's static marker):
 *   H-i-W panel-2 sync, H-i-W panel-3 tick, Features cell[3] tick, FAQ marker.
 * The dot blinks at the hero start and at the CTA rest (the climax).
 */
const SCROLL_DOT_DOCKS = [
  { start: 0.3, end: 0.34 },
  { start: 0.5, end: 0.54 },
  { start: 0.72, end: 0.76 },
  { start: 0.86, end: 0.9 },
];

/**
 * Tracer by NoCorny - desktop-first landing (V3 scroll-scrubbed re-architecture).
 *
 * Section order + theme rhythm:
 *   Nav (light) -> Hero (DARK) -> How it works (light) -> Features (light)
 *   -> Ownership (DARK) -> FAQ (light) -> Final CTA (DARK) -> Footer (light)
 *
 * The page owns the SINGLE no-target useScroll() (useGlobalProgress). Its value
 * drives BOTH the global ScrollDot spine (the through-element threading every
 * section) AND the Ownership ambient parallax bgY (A7). No other no-target
 * useScroll exists in the codebase (J: grep -c "useScroll()" === 1, inside
 * useGlobalProgress).
 *
 * The full desktop experience is hidden below md; the mobile stub is hidden md+.
 * The ScrollDot self-gates (useEnhancementEnabled): no fixed overlay on mobile.
 */
export default function Home() {
  const pageProgress = useGlobalProgress();

  return (
    <>
      {/* Mobile: deliberate single-screen stub */}
      <MobileStub />

      {/* Desktop: the full experience */}
      <div className="hidden md:block">
        {/* the global through-dot: one fixed overlay, page-progress driven */}
        <ScrollDot
          progress={pageProgress}
          dockWindows={SCROLL_DOT_DOCKS}
          startBlink={[0, 0.08]}
          restBlink={[0.93, 1]}
          weaveVw={["48vw", "46vw", "44vw", "52vw", "50vw"]}
        />

        <Nav />
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <Ownership bgProgress={pageProgress} />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
