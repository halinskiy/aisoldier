import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { SplitText } from "@kit/components/motion/SplitText";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/About.tsx";

/**
 * Section 2 — About / Hero 2.
 *
 * Geometry (FIGMA_SPEC §2, desktop 1440 baseline):
 *   - Section height 602px, symmetric 80/80 vertical padding
 *   - Left col 501 wide, content 145 tall (eyebrow + 4-line body)
 *   - Right col 676 wide, content 442 tall (single long body paragraph)
 *   - Gutter 200px — reuses the same `501fr 200fr 676fr` grid as Section 1
 *
 * Typography: BOTH columns are 16px body (Figma doesn't differentiate).
 *
 * Gap fixed:
 *   🟠 inconsistent gutter (231 vs 199 across sections) — unified at 200fr
 *
 * Motion deferred (see DECISIONS.md):
 *   Both paragraphs carry `data-motion="split-text-reveal"`. The motion pass
 *   will find them via `rg "data-motion" src/` and wire GSAP SplitText or a
 *   Framer Motion word-by-word stagger.
 *
 * Open for client rewrite (from HANDOFF.md):
 *   - The right-column paragraph is lifted from `forfuture.webflow.io`
 *     (reference landing that the designer left on canvas). Flag for rewrite.
 */
export function About() {
  const { about } = copy;

  return (
    <section
      id="about"
      data-component="About"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,text-body,font-sans"
      className="relative w-full py-20"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-y-10 lg:grid-cols-[501fr_200fr_676fr] lg:gap-y-0">
          {/* Left column — eyebrow + short intro body */}
          <div
            data-component="AboutLead"
            data-source={DATA_SOURCE}
            data-tokens="text-body,color-text"
            className="flex max-w-[501px] flex-col gap-6"
          >
            <EyebrowLabel className="w-fit self-start">{about.eyebrow}</EyebrowLabel>
            <SplitText
              text={about.left}
              className="text-[16px] leading-[1.5] text-[var(--color-text)]"
              dataSource={DATA_SOURCE}
            />
          </div>

          {/* Spacer column — grid gutter at ≥1024, collapses on mobile */}
          <div aria-hidden className="hidden lg:block" />

          {/* Right column — long-form body */}
          <SplitText
            text={about.right}
            className="max-w-[676px] text-[16px] leading-[1.5] text-[var(--color-text-muted)]"
            dataSource={DATA_SOURCE}
          />
        </div>
      </div>
    </section>
  );
}
