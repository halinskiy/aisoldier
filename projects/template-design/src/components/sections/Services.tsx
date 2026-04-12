import { ImageCardGrid } from "@kit/components/section/ImageCardGrid";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Services.tsx";

/**
 * Section 4 — Services showcase.
 *
 * 🟠 MEDIUM CONFIDENCE — the Figma symbol metadata never drilled into the
 * actual content (rate limit). Layout and content here are a studio-authored
 * placeholder. Flag in HANDOFF.md for client confirmation.
 *
 * Geometry (inferred from FIGMA_SPEC §4 + Section 6 symmetry):
 *   - `py-[120px]` symmetric padding
 *   - Split header on top (eyebrow + headline left, body + CTA right)
 *   - 2×3 image card grid below: 6 services, each with warm photography +
 *     serif title + 1-line description
 *
 * Gutter reused from the project canonical `501fr 200fr 676fr` grid (via
 * `SectionHeader align="split"`).
 *
 * Known conflict:
 *   Section 5 (Services list) uses the same `Services` eyebrow in the Figma.
 *   This is a designer reuse — we preserve it here and flag it in HANDOFF.md
 *   so the client can rename one of the two.
 */
export function Services() {
  const { servicesShowcase } = copy;

  return (
    <section
      id="services"
      data-component="Services"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,radius-window,font-serif"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="split"
          eyebrow={servicesShowcase.eyebrow}
          headline={servicesShowcase.headline}
          body={servicesShowcase.body}
          cta={servicesShowcase.cta}
          dataSource={DATA_SOURCE}
        />

        <div className="mt-16 lg:mt-20">
          <ImageCardGrid
            cards={servicesShowcase.cards.map((c) => ({
              image: c.image,
              title: c.title,
              description: c.description,
            }))}
            cols={2}
            gap={24}
            dataSource={DATA_SOURCE}
          />
        </div>
      </div>
    </section>
  );
}
