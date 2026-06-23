import { DarkSection } from "@ui-kit/components/section/DarkSection";

import { GridPage } from "../GridPage";
import { CTAConvergence } from "../CTAConvergence";
import copy from "@content/copy.json";

/**
 * S7a - Final CTA (V3). The narrative CLIMAX: a scroll-scrubbed convergence
 * (dot -> capture -> Dropbox -> live link pill) on a 150vh runway that comes to
 * REST on the composed payoff (CTAConvergence). DARK full-bleed stage.
 *
 * The headline now lives INSIDE the pinned stage (passed into CTAConvergence)
 * so that at the runway end the headline + resolved link pill + Download button
 * + note line are ALL co-visible and optically centered, the way the Hero rests
 * on its share-link card. Previously the headline sat in a separate grid block
 * above the sticky stage and scrolled off before p=1, ending the page on a void.
 *
 * final_cta.body is SUPPRESSED (the convergence is the body, SECTION_CONTRACT_V3
 * Part 5). No second CTA, no GitHub repeat, no eyebrow.
 */
export function FinalCta() {
  const { final_cta } = copy;

  return (
    <DarkSection
      component="FinalCtaSection"
      source="projects/tracer/src/components/sections/FinalCta.tsx"
      bleed
      allowSticky
    >
      <GridPage className="relative z-[1]">
        <div className="col-span-12">
          <CTAConvergence
            heading={final_cta.heading}
            downloadLabel={final_cta.cta_primary}
            downloadHref="/download"
            note={final_cta.note}
          />
        </div>
      </GridPage>
    </DarkSection>
  );
}
