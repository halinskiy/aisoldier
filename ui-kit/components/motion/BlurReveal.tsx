"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { EASE_OUT } from "../../lib/motion";

export type BlurRevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds. Useful for ordered lists. */
  delay?: number;
  /** Entry duration in seconds. Default 0.6. */
  duration?: number;
  /** Intersection-observer margin. Default "-10%" so the reveal fires slightly before the element touches the viewport edge. */
  margin?: `${number}%` | `${number}px`;
  /** Fire only once. Default true. */
  once?: boolean;
  /** Pass-through class on the wrapper. */
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/motion/BlurReveal.tsx";

/**
 * Blur-reveal entry animation primitive.
 *
 * The canonical "section enter" effect in the Aisoldier kit. Wraps children
 * and transitions them from `{ opacity: 0, y: 24, filter: blur(8px) }` to
 * their resting state when they enter the viewport.
 *
 * Honours `prefers-reduced-motion` — renders children without any animation
 * when the user has motion reduced.
 *
 * Tagging contract: adds `data-motion="blur-reveal"` so the attribute is
 * discoverable via `rg "data-motion"` just like the inline attributes in
 * section files. Stagger via `delay` prop, not via the parent's
 * `data-motion-index`.
 */
export function BlurReveal({
  children,
  delay = 0,
  duration = 0.6,
  margin = "-10%",
  once = true,
  className,
  dataSource,
}: BlurRevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin });

  if (prefersReduced) {
    return (
      <div
        ref={ref}
        className={className}
        data-component="BlurReveal"
        data-source={dataSource ?? DATA_SOURCE_DEFAULT}
        data-tokens="ease-out"
        data-motion-state="reduced"
      >
        {children}
      </div>
    );
  }

  // NOTE: we do NOT set `data-motion="blur-reveal"` on the rendered div —
  // that attribute is reserved for elements managed by the global
  // `MotionProvider` observer. BlurReveal manages its own animation
  // through Framer Motion, so the observer should NOT double-animate it.
  return (
    <motion.div
      ref={ref}
      className={className}
      data-component="BlurReveal"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="ease-out"
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={
        inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
      }
      transition={{ duration, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
