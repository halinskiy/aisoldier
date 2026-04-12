import { ImageCardGrid } from "@kit/components/section/ImageCardGrid";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/CaseStudies.tsx";

/**
 * Section 6 — Case Studies.
 *
 * Kit reuse test: this section is composed entirely from existing kit
 * primitives (`SectionHeader` + `ImageCardGrid`). Zero new props on either
 * component, zero overrides. See CHANGELOG session 8 for the validation note.
 *
 * Geometry (FIGMA_SPEC §6):
 *   - py-[120px] symmetric
 *   - Split header on top, 2×3 image-card grid below
 *
 * Content:
 *   6 anonymised, SEC-compliant case-study sketches from
 *   `content/copy.json caseStudies.cards[]` — Tech founder / Family estate /
 *   Physician retirement / Non-profit endowment / Cross-border / Founder
 *   equity hedge. No return numbers, no client names.
 */
export function CaseStudies() {
  const { caseStudies } = copy;

  return (
    <section
      id="case-studies"
      data-component="CaseStudies"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,radius-window,font-serif"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="split"
          eyebrow={caseStudies.eyebrow}
          headline={caseStudies.headline}
          body={caseStudies.body}
          cta={caseStudies.cta}
          dataSource={DATA_SOURCE}
        />
        <div className="mt-16 lg:mt-20">
          <ImageCardGrid
            cards={caseStudies.cards}
            cols={2}
            dataSource={DATA_SOURCE}
          />
        </div>
      </div>
    </section>
  );
}
