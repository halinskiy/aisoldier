"use client";

import { motion, useReducedMotion } from "framer-motion";

import { BentoGrid, BentoCell } from "@ui-kit/components/section/BentoGrid";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";
import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

import { GridPage } from "../GridPage";
import copy from "@content/copy.json";

/**
 * S4 - Features. An icon-free hairline bento: a 3x2 field of equal cells, each a
 * short title + one terse line. Full 1-12 on the page grid. V2 adds the
 * layout-arrange entrance (each cell springs from translate 16px + scale 0.94
 * into its slot, staggered, soft spring, plays ONCE then rests) and exactly ONE
 * live cell: "One click to share" (items[3]) holds a copy -> record-red tick
 * micro-morph, the dot motif's appearance here. Borders on every cell; hover
 * lifts the border via the kit BentoCell.
 *
 * Static mode (reduced-motion / ?motion=0 / SSR): cells render at rest, the tick
 * shown in its final state. No flat fade as the default entrance.
 */
const LIVE_INDEX = 3; // "One click to share"

export function Features() {
  const { features } = copy;
  const enhance = useEnhancementEnabled();
  const prefersReduced = useReducedMotion();
  const live = enhance && !prefersReduced;

  return (
    <section id="features" className="scroll-mt-24 bg-[var(--color-bg)]">
      <GridPage className="py-24 md:py-32">
        <div className="col-span-12 lg:col-span-7">
          <BlurReveal>
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)]"
              style={{
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--lh-h2)",
                letterSpacing: "var(--ls-display)",
              }}
            >
              {features.heading}
            </h2>
          </BlurReveal>
        </div>

        <div className="col-span-12 mt-16">
          <BentoGrid cols={12} rowMinHeight={200} gap={16}>
            {features.items.map((item, i) => (
              <BentoCell
                key={item.title}
                span={{ base: 12, md: 6, lg: 4 }}
                tone="surface"
                padding="lg"
              >
                <motion.div
                  className="flex h-full flex-col"
                  initial={live ? { opacity: 0, y: 16, scale: 0.94, filter: "blur(2px)" } : false}
                  whileInView={
                    live ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined
                  }
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{
                    duration: 0.55,
                    delay: (i % 3) * 0.06 + Math.floor(i / 3) * 0.04,
                    ease: [0.34, 1.42, 0.5, 1],
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-[20px] font-semibold leading-[1.3] text-[var(--color-text)]">
                      {item.title}
                    </h3>
                    {i === LIVE_INDEX && <CopyTick live={live} />}
                  </div>
                  <p className="mt-3 max-w-[36ch] font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
                    {item.body}
                  </p>
                </motion.div>
              </BentoCell>
            ))}
          </BentoGrid>
        </div>
      </GridPage>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  CopyTick - the one live cell: a copy affordance blur-morphs to a record-red */
/*  tick on scroll-into-view. Plays once, rests. The dot motif in this section. */
/* -------------------------------------------------------------------------- */

function CopyTick({ live }: { live: boolean }) {
  // Static mode rests on the ticked state so the meaning survives without motion.
  const ticked = true;
  return (
    <motion.span
      className="relative flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[var(--radius-button)]"
      initial={live ? { background: "var(--color-surface-3)" } : false}
      whileInView={live ? { background: "var(--color-accent)" } : undefined}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.24, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      style={!live ? { background: "var(--color-accent)" } : undefined}
      aria-hidden
    >
      {live ? (
        <CopyToTickGlyph />
      ) : ticked ? (
        <TickGlyph color="var(--color-on-dark)" />
      ) : null}
    </motion.span>
  );
}

function CopyToTickGlyph() {
  return (
    <>
      {/* copy glyph fades out under a blur seam */}
      <motion.span
        className="absolute"
        initial={{ opacity: 1, filter: "blur(0px)" }}
        whileInView={{ opacity: 0, filter: "blur(2px)" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <CopyGlyph color="var(--color-text-subtle)" />
      </motion.span>
      {/* tick fades in */}
      <motion.span
        className="absolute"
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.22, delay: 0.52, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <TickGlyph color="var(--color-on-dark)" />
      </motion.span>
    </>
  );
}

function CopyGlyph({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden style={{ color }}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 9V2.5C2 2 2.4 1.5 3 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function TickGlyph({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden style={{ color }}>
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
