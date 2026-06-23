"use client";

import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
 * Honours `prefers-reduced-motion` AND `?motion=0` URL param — in either
 * static-mode branch the wrapper renders children as a plain div, skipping
 * the motion.div entirely. This removes the "blur-block stays below fold"
 * failure mode where useInView never fires for offscreen elements and
 * imperative controls.set() fails to propagate through AnimationControls
 * before first paint on some WebKit builds.
 *
 * Hydration-safe: SSR always renders the motion.div with initial blur. On
 * client first paint this matches (mounted=false), then after mount the
 * `mounted` flag flips and, if static-mode is detected, we re-render as a
 * plain div. No element-type mismatch during hydration.
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
  const controls = useAnimationControls();

  // Mounted flag — false on SSR and on the first client paint, true after
  // useEffect fires. Used as the hydration-safe hinge between the motion
  // branch and the static-mode plain-div branch.
  const [mounted, setMounted] = useState(false);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const urlStatic =
      new URLSearchParams(window.location.search).get("motion") === "0";
    if (prefersReduced || urlStatic) {
      setStaticMode(true);
    }
  }, [prefersReduced]);

  useEffect(() => {
    if (!mounted || staticMode) return;
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration, ease: [...EASE_OUT], delay },
      });
    }
  }, [mounted, staticMode, inView, controls, duration, delay]);

  // Static-mode branch: render children directly, no motion wrapper, no
  // blur, no animation. Judge-mode and reduced-motion users see a fully
  // legible page immediately — no 41-of-47 blur-blocks below the fold.
  if (mounted && staticMode) {
    return (
      <div
        className={className}
        data-component="BlurReveal"
        data-source={dataSource ?? DATA_SOURCE_DEFAULT}
        data-tokens="ease-out"
        data-static="1"
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      data-component="BlurReveal"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="ease-out"
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
