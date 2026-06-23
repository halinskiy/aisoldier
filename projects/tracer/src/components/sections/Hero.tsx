import { AmbientDrift } from "@ui-kit/components/motion/AmbientDrift";
import { SpecStrip } from "@ui-kit/components/section/SpecStrip";

import { GridPage } from "../GridPage";
import { HeroMorphStage } from "../HeroMorphStage";
import copy from "@content/copy.json";

/**
 * S2 - Hero (V3). A cinematic DARK studio stage on the light page. The H1
 * "Your recordings. Not theirs." is the one persistent, server-rendered anchor
 * above the morph stage (the LCP element, never gated by motion). Below it the
 * record -> your Dropbox -> share-link chain is SCRUBBED by the wheel inside a
 * 300vh runway with a sticky 100vh stage (HeroMorphStage owns the engine).
 *
 * hero.subheading is SUPPRESSED inside the scrubbed stage (the morph + the
 * per-beat labels are the sentence); the per-beat labels come from
 * how_it_works.steps titles, shortened. The SpecStrip credibility row sits
 * BELOW the runway, outside the pinned region.
 *
 * One AmbientDrift glow loops behind the stage (opacity <=0.12, >=20s, never
 * crosses text). Bespoke dark stage (not DarkSection): the hero needs its own
 * top padding for the floating nav. Noted in DECISIONS.md.
 */
export function Hero() {
  const { hero } = copy;

  return (
    <section
      className="dark-scope dot-grid-dark relative"
      style={{ background: "var(--color-ink-surface)" }}
    >
      {/* ambient drift clip layer: a non-sticky absolute layer carries the
          overflow:hidden so the glow is clipped WITHOUT breaking the morph
          stage's position:sticky pin (overflow on a sticky ancestor disables
          the pin - 2026-06-23 fix). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AmbientDrift
          position={{ top: "14%", right: "8%" }}
          size={520}
          opacity={0.1}
          duration={32}
          blur={90}
          amplitude={70}
        />
      </div>

      {/* H1: the one persistent anchor, server-rendered above the stage.
          Pulled up under the nav and given a tighter lead into the morph stage
          so the first screen is full (no soft void between headline + subject). */}
      <GridPage className="relative z-[1] -mb-[8vh] pt-[136px]">
        <div className="col-span-12 flex flex-col items-center text-center">
          <h1
            className="font-[family-name:var(--font-display)] font-semibold text-white/90"
            style={{
              fontSize: "var(--text-display-lg)",
              lineHeight: "var(--lh-display)",
              letterSpacing: "var(--ls-display)",
              maxWidth: "16ch",
            }}
          >
            {hero.headline}
          </h1>
        </div>
      </GridPage>

      {/* the scrubbed morph runway: full bleed within the section, on the grid */}
      <GridPage className="relative z-[1]">
        <div className="col-span-12">
          <HeroMorphStage />
        </div>
      </GridPage>

      {/* one quiet credibility row, BELOW the runway (outside the pin) */}
      <GridPage className="relative z-[1] pb-24">
        <div className="col-span-12">
          <SpecStrip items={hero.spec_row} tone="dark" mono />
        </div>
      </GridPage>
    </section>
  );
}
