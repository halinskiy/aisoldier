import { DarkSection } from "@ui-kit/components/section/DarkSection";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";
import { SpecStrip } from "@ui-kit/components/section/SpecStrip";

import copy from "@content/copy.json";

/**
 * S5 - Ownership. The emotional core, on a DARK studio stage. "You own this." +
 * one subheading (the Loom contrast that gives the heading meaning) + four
 * ownership truths as a monochrome hairline SpecStrip (vertical: label + detail
 * per row). One accent dot per row, nothing else colored.
 */
export function Ownership() {
  const { ownership } = copy;

  return (
    <DarkSection
      id="ownership"
      component="OwnershipSection"
      source="projects/tracer/src/components/sections/Ownership.tsx"
      innerClassName="max-w-[1200px] px-8"
    >
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
          className="mt-6 max-w-[680px] font-[family-name:var(--font-sans)] text-white/50"
          style={{ fontSize: "var(--text-body-lg)", lineHeight: "var(--lh-body)" }}
        >
          {ownership.subheading}
        </p>
      </BlurReveal>

      <div className="mt-14">
        <BlurReveal delay={0.1}>
          <SpecStrip
            direction="vertical"
            tone="dark"
            accentDot
            items={ownership.truths}
          />
        </BlurReveal>
      </div>
    </DarkSection>
  );
}
