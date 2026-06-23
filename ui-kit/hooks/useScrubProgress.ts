"use client";

import { type RefObject } from "react";
import {
  useScroll,
  useSpring,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  useScrubProgress - the scroll-scrub engine                                 */
/* -------------------------------------------------------------------------- */
/**
 * The single scroll-scrub primitive every pinned-runway section is an instance
 * of. Wraps `useScroll({ target, offset })` and springs the raw progress ONCE
 * so every `useTransform` in a section derives from one smoothed value `p`
 * (never spring individual transforms - that compounds lag and reads janky).
 *
 * Returns `p`, a MotionValue<number> in 0..1 LOCAL to the section's runway:
 *   0 = section top reaches viewport top
 *   1 = section bottom reaches viewport bottom
 * with the default offset ["start start","end end"].
 *
 * The canonical recipe for an AirBnB-style scroll-scrubbed section:
 *   const ref = useRef(null);
 *   const p = useScrubProgress(ref);            // ONE spring per section
 *   const x = useTransform(p, [0,1], ["0%","-66%"]);   // map to compositor props
 *   <section ref={ref} style={{ height: "300vh" }}>    // vh runway
 *     <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
 *       <motion.div style={{ x }} />
 *     </div>
 *   </section>
 *
 * Anti-jank contract: exactly ONE useSpring per section file (call this hook
 * once per scrubbed section, feed `p` to every transform). Map ONLY to
 * compositor props (transform/opacity/clipPath/filter), never width/height/top/
 * left/margin/padding. Runway heights LOCKED in vh. The pin is position:sticky,
 * never a JS-driven top. Requires a single rAF scroll loop (e.g. one Lenis
 * instance with autoRaf); Framer useScroll reads the real window natively.
 *
 * Promoted from tracer V3 (2026-06-23): the engine behind the hero / how-it-
 * works / ownership-numbers / CTA scroll-scrubbed sections.
 */
export type UseScrubProgressOptions = {
  /** Spring stiffness. Default 120 (100-140 reads buttery, still responsive). */
  stiffness?: number;
  /** Spring damping. Default 30. Over-damping reads laggy. */
  damping?: number;
  /**
   * useScroll offset. Default ["start start","end end"] (pinned-runway scrub).
   * Override for a local element reveal, e.g. ["start end","start center"].
   */
  offset?: UseScrollOptions["offset"];
};

export function useScrubProgress(
  ref: RefObject<HTMLElement | null>,
  options: UseScrubProgressOptions = {},
): MotionValue<number> {
  const {
    stiffness = 120,
    damping = 30,
    offset = ["start start", "end end"],
  } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // Spring the raw progress ONCE. This is the section's single `p`.
  return useSpring(scrollYProgress, {
    stiffness,
    damping,
    restDelta: 0.001,
  });
}
