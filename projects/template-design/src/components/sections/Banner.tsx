import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Banner.tsx";

/**
 * Section 7 — Mid-page statement banner.
 *
 * First visual break from the warm cream. Full-bleed solid accent
 * (`--color-accent` = #FF512A) with a single H0 serif statement in near-black.
 *
 * Rationale for a flat orange vs a gradient: a gradient reads "decorative",
 * a flat saturated block reads "editorial statement". The firm voice is
 * "quiet confidence" so we want the second reading. If the first screenshot
 * feels too loud we can add a subtle radial highlight later — but flat first.
 *
 * Typography: Plex Serif Medium (500), clamp(40-96 px), line-height 1.0,
 * tracking −0.026em — same treatment as the Hero H0 for consistency.
 *
 * Contrast: #212121 on #FF512A ≈ 8:1 → AAA on any text size.
 *
 * Intentionally no CTA, no eyebrow, no subtitle. This is a full stop, not
 * a conversion point.
 *
 * Pattern is single-use (§11 / §12 are form + footer, different pattern);
 * not a kit candidate per the ≥2-uses promotion rule.
 */
export function Banner() {
  const { midpageBanner } = copy;

  return (
    <section
      id="banner"
      data-component="Banner"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-text,font-serif,text-h0,lh-h0,ls-h0"
      className="relative flex w-full items-center justify-center bg-[var(--color-accent)]"
      style={{
        minHeight: "clamp(480px, 70vh, 720px)",
        paddingTop: "clamp(96px, 15vh, 180px)",
        paddingBottom: "clamp(96px, 15vh, 180px)",
      }}
    >
      <div className="mx-auto w-full max-w-[960px] px-6 md:px-8 lg:px-12">
        <h2
          data-motion="blur-reveal"
          data-component="BannerHeadline"
          data-source={DATA_SOURCE}
          data-tokens="text-h0,lh-h0,ls-h0,font-serif,color-text"
          className="text-balance text-center font-serif font-medium text-[var(--color-text)]"
          style={{
            fontSize: "var(--text-h0)",
            lineHeight: "var(--lh-h0)",
            letterSpacing: "var(--ls-h0)",
          }}
        >
          {midpageBanner.headline}
        </h2>
      </div>
    </section>
  );
}
