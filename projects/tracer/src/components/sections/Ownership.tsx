import { DarkSection } from "@ui-kit/components/section/DarkSection";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";
import { AmbientDrift } from "@ui-kit/components/motion/AmbientDrift";

import { GridPage } from "../GridPage";
import { TruthRail } from "../TravelingDot";
import copy from "@content/copy.json";

/**
 * S5 - Ownership. The emotional core on a DARK studio stage. The background
 * bleeds full-viewport (DarkSection bleed); the content sits on the ONE page
 * grid. Heading + subheading span cols 1-7; the four ownership truths render as
 * a TruthRail: a single record-red dot travels down the left rail on
 * scroll-into-view, lighting each row's dot as it passes, then dissolves with
 * all four lit. One AmbientDrift glow loops behind (opacity <=0.12, >=20s).
 */
export function Ownership() {
  const { ownership } = copy;

  return (
    <DarkSection
      id="ownership"
      component="OwnershipSection"
      source="projects/tracer/src/components/sections/Ownership.tsx"
      bleed
    >
      <AmbientDrift
        position={{ top: "30%", left: "6%" }}
        size={480}
        opacity={0.1}
        duration={34}
        blur={90}
        amplitude={64}
      />

      <GridPage className="relative z-[1]">
        <div className="col-span-12 lg:col-span-7">
          <BlurReveal>
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
            <p
              className="mt-6 max-w-[640px] font-[family-name:var(--font-sans)] text-white/50"
              style={{ fontSize: "var(--text-body-lg)", lineHeight: "var(--lh-body)" }}
            >
              {ownership.subheading}
            </p>
          </BlurReveal>
        </div>

        <div className="col-span-12 mt-14">
          <TruthRail rows={ownership.truths} />
        </div>
      </GridPage>
    </DarkSection>
  );
}
