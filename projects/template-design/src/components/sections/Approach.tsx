import { SectionDivider } from "@kit/components/section/SectionDivider";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Approach.tsx";

/**
 * Section 3 — Our Approach.
 *
 * Geometry (FIGMA_SPEC §3, desktop 1440 baseline):
 *   - Section height 724px, symmetric 120/120 vertical padding
 *   - Header 141 tall at y=120 (split: eyebrow+H3 left, body+CTA right)
 *   - Divider at y=325 (gap 64 between header and divider)
 *   - 5-col row at y=425 (gap 100 between divider and cards), 179 tall
 *   - 5 cards in Figma are 275.2 wide each — fractional math, solved by
 *     `grid-cols-5` (browser splits evenly)
 *
 * Responsive (FIGMA_SPEC §3 plan):
 *   ≥1280: 2-col header + 5-col cards
 *   1024-1279: 2-col header, 5-col cards unchanged
 *   768-1023: stacked header, 3-col cards (2 wrap to second row)
 *   <768: stacked header, 2-col cards
 *
 * Gap fixed:
 *   🟠 #8 fractional card widths (275.20001) → `grid-cols-5` handles it
 *
 * 5-col card row — intentionally NOT a stats row. Cards are wealth-mgmt
 * value pillars (Discipline / Transparency / Long horizon / Tax-efficient /
 * Client-first) from `content/copy.json approach.cards[]`. Content was
 * authored in session 5 as safe, SEC-neutral pillars — flag in HANDOFF.md
 * for client review.
 *
 * Motion (deferred):
 *   Eyebrow, headline, body + each card all get `data-motion="blur-reveal"`.
 *   Motion pass will stagger cards via index offset.
 */
export function Approach() {
  const { approach } = copy;

  return (
    <section
      id="approach"
      data-component="Approach"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,text-h3,font-serif"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="split"
          eyebrow={approach.eyebrow}
          headline={approach.headline}
          body={approach.body}
          cta={approach.cta}
          dataSource={DATA_SOURCE}
        />

        <div className="mt-16 lg:mt-20">
          <SectionDivider dataSource={DATA_SOURCE} />
        </div>

        <ApproachCards cards={approach.cards} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

type ApproachCard = {
  number: string;
  title: string;
  body: string;
};

function ApproachCards({ cards }: { cards: ApproachCard[] }) {
  return (
    <ul
      data-component="ApproachCards"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-accent"
      className="mt-16 grid grid-cols-1 overflow-hidden rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-border)] [gap:1px] sm:grid-cols-2 md:grid-cols-3 lg:mt-20 lg:grid-cols-5"
    >
      {cards.map((card, i) => (
        <li
          key={card.number}
          data-motion="blur-reveal"
          data-motion-index={i}
          data-component="ApproachCard"
          data-source={DATA_SOURCE}
          data-tokens="color-bg,color-text,color-text-muted,color-accent,font-serif"
          className="flex min-h-[220px] flex-col justify-between gap-6 bg-[var(--color-bg)] p-5 md:p-6"
        >
          <span className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-muted)]">
            <span
              aria-hidden
              className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]"
            />
            {card.number}
          </span>
          <div className="flex flex-col gap-3">
            <h3
              className="font-serif font-medium text-[22px] leading-[1.2] tracking-[-0.021em] text-[var(--color-text)] lg:text-[24px]"
            >
              {card.title}
            </h3>
            <p className="text-[14px] leading-[1.5] text-[var(--color-text-muted)]">
              {card.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
