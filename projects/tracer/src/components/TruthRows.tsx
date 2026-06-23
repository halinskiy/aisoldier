"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  TruthRows (V3) - A4 reveal rows with statically-lit accent dots            */
/* -------------------------------------------------------------------------- */
/**
 * The four ownership guarantees as hairline rows (SECTION_CONTRACT_V3 S5c).
 * Replaces the retired TravelingDot.tsx (which animated `top`, a layout prop /
 * J4 violation). Each row reveals its text via its own local useScroll (A4) and
 * its leading dot lights to accent as the wheel passes it. The global ScrollDot
 * "walks" the rows as the visual through-line; the per-row dot colour is a
 * compositor-safe color transition driven by the row's own scroll progress
 * (useTransform, never setState-on-scroll - J3 safe).
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): every row visible,
 * every dot lit accent, no travel. CLS 0.
 *
 * Project-local; Tracer-specific ownership composition.
 */
export type TruthRow = { label: string; detail: string };

export function TruthRows({ rows }: { rows: TruthRow[] }) {
  return (
    <div className="flex flex-col">
      {rows.map((row) => (
        <Row key={row.label} row={row} />
      ))}
    </div>
  );
}

function Row({ row }: { row: TruthRow }) {
  const enhance = useEnhancementEnabled({ minWidth: 768 });
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.7], ["16px", "0px"]);
  const blur = useTransform(scrollYProgress, [0, 0.6], ["blur(3px)", "blur(0px)"]);
  // the leading dot lights to accent as the row enters the upper viewport. We
  // fade the OPACITY of a filled accent dot (no color animation, no raw hex) so
  // Motion stays on the compositor and tokens stay the source of truth.
  const fillOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);

  const rowStyle = enhance
    ? { opacity, y, filter: blur, willChange: "transform, opacity, filter" }
    : undefined;

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 gap-2 border-t border-white/10 py-7 first:border-t-0 md:grid-cols-12 md:gap-6"
      style={rowStyle}
    >
      <div className="flex items-start gap-4 md:col-span-6">
        {/* hollow ring (always) + filled accent dot fading up on scroll */}
        <span
          className="relative mt-[6px] h-[14px] w-[14px] shrink-0 rounded-full"
          style={{ border: "1.5px solid var(--color-on-dark-hairline-strong)" }}
          aria-hidden
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background: "var(--color-accent)",
              opacity: enhance ? fillOpacity : 1,
              willChange: "opacity",
            }}
          />
        </span>
        <span
          className="font-[family-name:var(--font-display)] font-semibold text-white/90"
          style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.3 }}
        >
          {row.label}
        </span>
      </div>
      <p className="font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-white/50 md:col-span-6">
        {row.detail}
      </p>
    </motion.div>
  );
}
