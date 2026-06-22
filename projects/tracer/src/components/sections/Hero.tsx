import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";

import { SpecStrip } from "@ui-kit/components/section/SpecStrip";

import { HeroMorphStage } from "../HeroMorphStage";
import copy from "@content/copy.json";

/**
 * S2 - Hero. A cinematic DARK studio stage on the light page. The morph stage
 * performs record -> your Dropbox -> clean link once on load; the headline
 * carries the meaning, the morph enhances. ONE subheading, ONE SpecStrip
 * credibility row, a primary Download CTA + a ghost GitHub CTA.
 *
 * The text blocks reveal via the kit BlurReveal, which renders children visibly
 * under prefers-reduced-motion AND ?motion=0 (no opacity-0 flash, no CLS) and
 * animates once on view otherwise. The morph stage is gated separately.
 *
 * Bespoke dark stage (not DarkSection): the hero is a full-bleed dark band with
 * a bespoke headline/morph/CTA composition and its own top padding for the
 * floating nav. DarkSection is a fixed-padding break band; it does not fit the
 * hero composition. Noted in DECISIONS.md.
 */
export function Hero() {
  const { hero } = copy;

  return (
    <section
      className="dark-scope dot-grid-dark relative overflow-hidden"
      style={{ background: "var(--color-ink-surface)" }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-8 pb-24 pt-[136px]">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <BlurReveal>
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
          </BlurReveal>

          {/* Subheading */}
          <BlurReveal delay={0.1} className="mt-6">
            <p
              className="max-w-[640px] font-[family-name:var(--font-sans)] text-white/50"
              style={{ fontSize: "var(--text-body-lg)", lineHeight: "var(--lh-body)" }}
            >
              {hero.subheading}
            </p>
          </BlurReveal>

          {/* CTAs */}
          <BlurReveal delay={0.2} className="mt-10">
            <div className="flex items-center justify-center gap-3">
              <a
                href="/download"
                className="inline-flex items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-6 py-3 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
              >
                {hero.cta_primary}
              </a>
              <a
                href="https://github.com/nocorny/tracer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-[var(--radius-button)] border border-white/20 px-6 py-3 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white/80 transition-colors duration-150 [transition-timing-function:var(--ease-out)] hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
              >
                {hero.cta_secondary}
              </a>
            </div>
          </BlurReveal>

          {/* The morph stage - the resting share-link artifact, the focal point */}
          <BlurReveal delay={0.32} className="mt-[72px] w-full">
            <HeroMorphStage />
          </BlurReveal>

          {/* One quiet credibility row, lifted to read as one cluster with the
              artifact above it (artifact + spec row = one credibility block). */}
          <BlurReveal delay={0.42} className="mt-12">
            <SpecStrip items={hero.spec_row} tone="dark" mono />
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
