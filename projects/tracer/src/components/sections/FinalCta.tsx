import { DarkSection } from "@ui-kit/components/section/DarkSection";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";

import copy from "@content/copy.json";

/**
 * S7a - Final CTA. The closing ask on a DARK stage. One verb, one grievance, one
 * red Download button, one note line. No secondary CTA, no GitHub repeat.
 */
export function FinalCta() {
  const { final_cta } = copy;

  return (
    <DarkSection
      component="FinalCtaSection"
      source="projects/tracer/src/components/sections/FinalCta.tsx"
      innerClassName="max-w-[1200px] px-8"
    >
      <div className="flex flex-col items-center text-center">
        <BlurReveal>
          <h2
            className="font-[family-name:var(--font-display)] font-semibold text-white/90"
            style={{
              fontSize: "var(--text-display-md)",
              lineHeight: "var(--lh-h2)",
              letterSpacing: "var(--ls-display)",
              maxWidth: "18ch",
            }}
          >
            {final_cta.heading}
          </h2>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <p
            className="mt-6 max-w-[560px] font-[family-name:var(--font-sans)] text-white/50"
            style={{ fontSize: "var(--text-body-lg)", lineHeight: "var(--lh-body)" }}
          >
            {final_cta.body}
          </p>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <a
            href="/download"
            className="mt-9 inline-flex items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-7 py-3.5 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
          >
            {final_cta.cta_primary}
          </a>
          <p className="mt-5 font-[family-name:var(--font-sans)] text-[16px] text-white/40">
            {final_cta.note}
          </p>
        </BlurReveal>
      </div>
    </DarkSection>
  );
}
