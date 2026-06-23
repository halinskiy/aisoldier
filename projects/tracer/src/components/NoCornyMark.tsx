"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * NoCornyMark - Tracer's own brand identity (NOT the 3mpq fallback logo).
 *
 * A squiggle that resolves into a single record dot: the line is the
 * "recording", the dot is the record button. Monochrome ink line + the one
 * record-red dot. Strokes use currentColor so it themes to ink on light and
 * paper on dark; the dot is always the accent. Pixel-honest, no gradient.
 *
 * The terminal dot is where the page's record-red protagonist is BORN. With
 * `pulse`, it plays ONE soft scale pulse on first paint then rests (not a loop).
 * Reduced-motion / ?motion=0: no pulse, dot renders full red statically.
 *
 * Project-local (Tracer owns this mark). Pairs with the "NoCorny Tracer"
 * wordmark in the nav and footer.
 */
type NoCornyMarkProps = {
  /** Mark height in px. Width scales with the viewBox. Default 18. */
  size?: number;
  /** One-shot pulse on the terminal dot on first paint (birth signal). */
  pulse?: boolean;
  className?: string;
};

export function NoCornyMark({ size = 18, pulse = false, className }: NoCornyMarkProps) {
  const prefersReduced = useReducedMotion();
  const animate = pulse && !prefersReduced;

  return (
    <svg
      width={(size * 34) / 18}
      height={size}
      viewBox="0 0 34 18"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* the squiggle: a recorded waveform settling into a flat line */}
      <path
        d="M1 9C2.6 9 2.6 4 4.2 4C5.8 4 5.8 14 7.4 14C9 14 9 3 10.6 3C12.2 3 12.2 15 13.8 15C15.4 15 15.4 6 17 6C18.6 6 18.6 11 20.2 11C21.4 11 22 9 23 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the record dot - the one accent element, born with a one-shot pulse */}
      <motion.circle
        cx="29"
        cy="9"
        r="4"
        fill="var(--color-accent)"
        style={{ transformOrigin: "29px 9px" }}
        initial={animate ? { scale: 1 } : false}
        animate={animate ? { scale: [1, 1.18, 1] } : undefined}
        transition={{ duration: 0.7, ease: [0.34, 1.42, 0.5, 1], delay: 0.2 }}
      />
    </svg>
  );
}
