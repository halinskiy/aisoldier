"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  ScrubReveal - A4 scroll-scrubbed type / element reveal                     */
/* -------------------------------------------------------------------------- */
/**
 * Replaces every "fade up on enter" with a scroll-LINKED reveal: the element
 * paints IN PROPORTION to scroll via a clip + blur mask tied to its own local
 * useScroll progress (offset start-end -> start-center, so it completes by the
 * time the line reaches the upper third). The wheel drives it; it is not a
 * play-once timer (SECTION_CONTRACT_V3 A4 / S4 / S6).
 *
 * Compositor-only: clipPath + filter(blur) + opacity (J4/J9). No layout props.
 * No useSpring here (this is a light local reveal, not a pinned runway - the J5
 * one-spring-per-section rule governs the scrubbed pinned stages, not these
 * reveals; using raw scroll progress keeps the reveal honest to the wheel).
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): renders children at
 * the resting END state (no clip, no blur, full opacity). CLS 0.
 *
 * Project-local; small enough to stay project-local until a second use.
 */
export function ScrubReveal({
  children,
  className,
  variant = "clip",
}: {
  children: ReactNode;
  className?: string;
  /** "clip": clip-reveal left-to-right. "blur": blur+fade reveal. */
  variant?: "clip" | "blur";
}) {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });

  // STATIC FALLBACK: hook-free, the resting END state (no clip, no blur).
  if (!enhance) {
    return <div className={className}>{children}</div>;
  }

  return (
    <ScrubRevealInner className={className} variant={variant}>
      {children}
    </ScrubRevealInner>
  );
}

/* -------------------------------------------------------------------------- */
/*  ScrubRevealInner - mounted only when enhanced; owns the local useScroll     */
/* -------------------------------------------------------------------------- */
/**
 * HYDRATION FIX (2026-06-23): useScroll's target ref is attached here, in a
 * component that only mounts when enhanced, to an unconditionally rendered
 * motion.div in the same commit. So useScroll never sees a "defined but not
 * hydrated" target.
 */
function ScrubRevealInner({
  children,
  className,
  variant,
}: {
  children: ReactNode;
  className?: string;
  variant: "clip" | "blur";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  const clip = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(8px)", "blur(0px)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        variant === "clip"
          ? { clipPath: clip, willChange: "clip-path" }
          : { filter: blur, opacity, willChange: "transform, opacity, filter" }
      }
    >
      {children}
    </motion.div>
  );
}
