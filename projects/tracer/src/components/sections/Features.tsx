"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { BentoGrid, BentoCell } from "@ui-kit/components/section/BentoGrid";
import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

import { GridPage } from "../GridPage";
import { ScrubReveal } from "../ScrubReveal";
import copy from "@content/copy.json";

/**
 * S4 - Features (V3). An icon-free hairline bento: a 3x2 field of equal cells.
 * Each cell and the H2 now reveal via SCROLL PROGRESS (local useScroll), not a
 * play-once enter stagger (the V2 Framer enter-play + .st-reveal is retired,
 * SECTION_CONTRACT_V3 S4 / A4). Cells rise (y) + sharpen (blur) + fade tied to
 * the wheel, staggered by column via per-cell offset windows.
 *
 * The global ScrollDot docks at features.items[3] ("One click to share") in its
 * Features window; this cell carries a static tick affordance as the dock
 * target (the dot's opacity hand-off IS the live-cell moment, no separate
 * enter morph).
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): cells at rest (no y,
 * full opacity, no blur), H2 fully visible, tick in cell[3] shown. CLS 0.
 */
const LIVE_INDEX = 3; // "One click to share" - the ScrollDot dock target

export function Features() {
  const { features } = copy;

  return (
    <section id="features" className="scroll-mt-24 bg-[var(--color-bg)]">
      <GridPage className="py-24 md:py-32">
        <div className="col-span-12 lg:col-span-7">
          <ScrubReveal variant="clip">
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
          </ScrubReveal>
        </div>

        <div className="col-span-12 mt-16">
          <BentoGrid cols={12} rowMinHeight={200} gap={16}>
            {features.items.map((item, i) => (
              <FeatureCell
                key={item.title}
                title={item.title}
                body={item.body}
                col={i % 3}
                isDock={i === LIVE_INDEX}
              />
            ))}
          </BentoGrid>
        </div>
      </GridPage>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FeatureCell - per-cell scroll-scrubbed reveal (no enter-play)             */
/* -------------------------------------------------------------------------- */

function FeatureCell({
  title,
  body,
  col,
  isDock,
}: {
  title: string;
  body: string;
  col: number;
  isDock: boolean;
}) {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  // Stagger by column: later columns finish their reveal a touch later.
  const startGap = col * 0.08;
  const y = useTransform(scrollYProgress, [startGap, startGap + 0.7], ["28px", "0px"]);
  const opacity = useTransform(scrollYProgress, [startGap, startGap + 0.5], [0, 1]);
  const blur = useTransform(
    scrollYProgress,
    [startGap, startGap + 0.6],
    ["blur(6px)", "blur(0px)"],
  );

  const style = enhance
    ? { y, opacity, filter: blur, willChange: "transform, opacity, filter" }
    : undefined;

  return (
    <BentoCell span={{ base: 12, md: 6, lg: 4 }} tone="surface" padding="lg">
      <motion.div ref={ref} className="flex h-full flex-col" style={style}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-display)] text-[20px] font-semibold leading-[1.3] text-[var(--color-text)]">
            {title}
          </h3>
          {isDock && <DockTick />}
        </div>
        <p className="mt-3 max-w-[36ch] font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
          {body}
        </p>
      </motion.div>
    </BentoCell>
  );
}

/* The static tick affordance the ScrollDot docks onto (one-click-to-share). */
function DockTick() {
  return (
    <span
      className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[var(--radius-button)]"
      style={{ background: "var(--color-accent)" }}
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{ color: "var(--color-on-dark)" }}>
        <path
          d="M2.5 7.5L5.5 10.5L11.5 3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
