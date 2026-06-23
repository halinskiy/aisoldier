"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { DarkSection } from "@ui-kit/components/section/DarkSection";
import { AmbientDrift } from "@ui-kit/components/motion/AmbientDrift";

import { GridPage } from "../GridPage";
import { ScrubReveal } from "../ScrubReveal";
import { OwnershipNumbers } from "../OwnershipNumbers";
import { TruthRows } from "../TruthRows";
import copy from "@content/copy.json";

/**
 * S5 - Ownership (V3). The emotional core on a DARK studio stage. Three moves,
 * each a different motion SHAPE so the section never reads as static text
 * (SECTION_CONTRACT_V3 S5):
 *   - H2 + subheading reveal via scroll (ScrubReveal / A4).
 *   - a scrubbed numbers strip (~12MB / 0 servers / MIT) as A5 objects, not a
 *     bullet list (OwnershipNumbers, 150vh runway).
 *   - the four truths as A4 reveal rows whose leading dots light to accent as
 *     the wheel passes (TruthRows; the global ScrollDot walks them). The retired
 *     TravelingDot.tsx (animated `top`) is gone.
 *
 * A7 ambient parallax: the AmbientDrift glow layer translates on `bgY`, driven
 * by the SAME global page progress passed from page.tsx (no second useScroll).
 *
 * Static mode: numbers at final values, rows lit, parallax off. CLS 0.
 */
export function Ownership({ bgProgress }: { bgProgress: MotionValue<number> }) {
  const { ownership } = copy;

  return (
    <DarkSection
      id="ownership"
      component="OwnershipSection"
      source="projects/tracer/src/components/sections/Ownership.tsx"
      bleed
    >
      <ParallaxDrift bgProgress={bgProgress} />

      <GridPage className="relative z-[1] pt-24 md:pt-32">
        <div className="col-span-12 lg:col-span-7">
          <ScrubReveal variant="clip">
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-white/90"
              style={{
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--lh-h2)",
                letterSpacing: "var(--ls-display)",
              }}
            >
              {ownership.heading}
            </h2>
          </ScrubReveal>
          <ScrubReveal variant="blur" className="mt-6 max-w-[640px]">
            <p
              className="font-[family-name:var(--font-sans)] text-white/50"
              style={{ fontSize: "var(--text-body-lg)", lineHeight: "var(--lh-body)" }}
            >
              {ownership.subheading}
            </p>
          </ScrubReveal>
        </div>
      </GridPage>

      {/* A5 scrubbed numbers strip */}
      <GridPage className="relative z-[1] mt-8">
        <div className="col-span-12">
          <OwnershipNumbers />
        </div>
      </GridPage>

      {/* A4 truth rows. Pulled UP into the tail of the numbers runway so the
          rows begin rising as the strip rests (overlapped hand-off), closing the
          dead seam that used to sit between them. */}
      <GridPage className="relative z-[1] -mt-[18vh] pb-24 md:pb-32">
        <div className="col-span-12">
          <TruthRows rows={ownership.truths} />
        </div>
      </GridPage>
    </DarkSection>
  );
}

/* Ambient drift wrapped in a parallax layer driven by the global page progress
   (the same single no-target useScroll value owned by page.tsx). */
function ParallaxDrift({ bgProgress }: { bgProgress: MotionValue<number> }) {
  const bgY = useTransform(bgProgress, [0, 1], ["0%", "30%"]);
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0"
      style={{ y: bgY, willChange: "transform" }}
      aria-hidden
    >
      <AmbientDrift
        position={{ top: "30%", left: "6%" }}
        size={480}
        opacity={0.1}
        duration={34}
        blur={90}
        amplitude={64}
      />
    </motion.div>
  );
}
