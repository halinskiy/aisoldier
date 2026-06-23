import { DarkSection } from "@ui-kit/components/section/DarkSection";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";
import { AmbientDrift } from "@ui-kit/components/motion/AmbientDrift";

import { GridPage } from "../GridPage";
import { CTAConvergence } from "../CTAConvergence";
import copy from "@content/copy.json";

/**
 * S7a - Final CTA. The B2 payoff convergence: the whole morph chain collapses
 * one last time into the live share-link pill beside the Download button. DARK
 * full-bleed stage with one AmbientDrift glow behind; content on the ONE page
 * grid. Headline spans cols 1-8; the convergence composition + Download + link
 * pill span the full 1-12. No body paragraph (the convergence is the body), no
 * second CTA, no GitHub repeat, no eyebrow. Note line under the cluster.
 */
export function FinalCta() {
  const { final_cta } = copy;

  return (
    <DarkSection
      component="FinalCtaSection"
      source="projects/tracer/src/components/sections/FinalCta.tsx"
      bleed
    >
      <AmbientDrift
        position={{ top: "24%", left: "12%" }}
        size={560}
        opacity={0.11}
        duration={30}
        blur={100}
        amplitude={72}
      />

      <GridPage className="relative z-[1]">
        <div className="col-span-12 lg:col-span-8">
          <BlurReveal>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-white/90"
              style={{
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--lh-h2)",
                letterSpacing: "var(--ls-display)",
                maxWidth: "16ch",
              }}
            >
              {final_cta.heading}
            </h2>
          </BlurReveal>
        </div>

        <div className="col-span-12 mt-12">
          <BlurReveal delay={0.1}>
            <CTAConvergence
              downloadLabel={final_cta.cta_primary}
              downloadHref="/download"
            />
            <p className="mt-8 font-[family-name:var(--font-sans)] text-[16px] text-white/40">
              {final_cta.note}
            </p>
          </BlurReveal>
        </div>
      </GridPage>
    </DarkSection>
  );
}
