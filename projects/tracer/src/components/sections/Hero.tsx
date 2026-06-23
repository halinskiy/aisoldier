import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";
import { AmbientDrift } from "@ui-kit/components/motion/AmbientDrift";
import { SpecStrip } from "@ui-kit/components/section/SpecStrip";

import { GridPage } from "../GridPage";
import { HeroMorphStage } from "../HeroMorphStage";
import copy from "@content/copy.json";

/**
 * S2 - Hero. A cinematic DARK studio stage on the light page. The background
 * bleeds full-viewport; the content sits on the ONE page grid (.grid-page):
 * headline + sub + CTAs span cols 1-8 (left, flush to the hero's content edge),
 * the morph stage spans the full 1-12. One AmbientDrift glow loops behind the
 * stage (opacity <=0.12, >=20s, never crosses text). The morph stage performs
 * record -> your Dropbox -> clean link ONCE on load, alive from frame 1.
 *
 * Text reveals via the kit BlurReveal (renders children visibly under
 * prefers-reduced-motion AND ?motion=0, no flash, no CLS). The morph stage is
 * gated separately by useEnhancementEnabled.
 *
 * Bespoke dark stage (not DarkSection): the hero needs its own top padding for
 * the floating nav and a bespoke headline/morph/CTA composition. Noted in
 * DECISIONS.md.
 */
export function Hero() {
  const { hero } = copy;

  return (
    <section
      className="dark-scope dot-grid-dark relative overflow-hidden"
      style={{ background: "var(--color-ink-surface)" }}
    >
      {/* ambient drift: behind everything, in the right margin, never crosses text */}
      <AmbientDrift
        position={{ top: "18%", right: "8%" }}
        size={520}
        opacity={0.1}
        duration={32}
        blur={90}
        amplitude={70}
      />

      <GridPage className="relative z-[1] pb-24 pt-[136px]">
        {/* Headline + sub + CTAs: cols 1-8 */}
        <div className="col-span-8 flex flex-col items-start">
          <BlurReveal>
            <h1
              className="font-[family-name:var(--font-display)] font-semibold text-white/90"
              style={{
                fontSize: "var(--text-display-lg)",
                lineHeight: "var(--lh-display)",
                letterSpacing: "var(--ls-display)",
                maxWidth: "15ch",
              }}
            >
              {hero.headline}
            </h1>
          </BlurReveal>

          <BlurReveal delay={0.1} className="mt-6">
            <p
              className="max-w-[600px] font-[family-name:var(--font-sans)] text-white/50"
              style={{ fontSize: "var(--text-body-lg)", lineHeight: "var(--lh-body)" }}
            >
              {hero.subheading}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.2} className="mt-10">
            <div className="flex items-center gap-3">
              <a
                href="/download"
                className="inline-flex items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-6 py-3 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
              >
                {hero.cta_primary}
              </a>
              <a
                href="https://github.com/nocorny/tracer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-[var(--radius-button)] border border-white/20 px-6 py-3 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white/80 transition-[color,border-color,transform] duration-150 [transition-timing-function:var(--ease-out)] hover:border-white/40 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
              >
                {hero.cta_secondary}
              </a>
            </div>
          </BlurReveal>
        </div>

        {/* The morph stage: full 1-12, the resting share-link artifact.
            Revealed early (0.15s) so the live record dot + ticking timer read as
            ACTIVE almost immediately, not as a thing the user must wait for. */}
        <BlurReveal delay={0.15} className="col-span-12 mt-20 w-full">
          <HeroMorphStage />
        </BlurReveal>

        {/* One quiet credibility row: full 1-12 */}
        <BlurReveal delay={0.42} className="col-span-12 mt-12">
          <SpecStrip items={hero.spec_row} tone="dark" mono />
        </BlurReveal>
      </GridPage>
    </section>
  );
}
