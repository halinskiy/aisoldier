"use client";

import {
  motion,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

import { useEnhancementEnabled } from "./useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  ScrollDot - the global scroll-driven through-element                       */
/* -------------------------------------------------------------------------- */
/**
 * ONE position:fixed accent dot, driven by the PAGE-level scroll progress
 * (passed in via `progress` so the host page owns the single no-target
 * useScroll()). It physically travels top -> bottom as you scroll and docks at
 * each section's live marker, tying a scroll-narrative page into one authored
 * journey. The single biggest "morphs that accompany scrolling" lever and the
 * cure for "unrelated blocks of text".
 *
 * Motion contract (anti-jank):
 *   - dotY / dotX are useTransform of the global progress -> transform props
 *     (`y`/`x`), NEVER animated `top`/`left`.
 *   - the dot's y uses a LIGHT spring (default stiffness 200 / damping 40) so it
 *     tracks the wheel honestly with a touch of glide, not a slow laggy spring.
 *   - at each `dockWindows` entry the dot fades opacity to 0 + a brief blur(2px)
 *     seam, then travels on; the host section fades up its own static marker.
 *   - the blink halo loop is opacity-gated to the hero dock + the rest window
 *     (the one allowed continuous loop), suspended while traveling.
 *   - will-change: transform, opacity scoped to THIS node only.
 *
 * Gated by useEnhancementEnabled (desktop only, off under reduced-motion /
 * ?motion=0): when false the dot is NOT rendered and each host section shows its
 * static local marker instead. CLS-neutral (fixed overlay, no layout box).
 *
 * Token contract: the host supplies `--color-accent` (the dot fill). All color
 * is token-driven; no literal hex.
 *
 * Promoted from tracer V3 (2026-06-23). Pairs with useScrubProgress (the per-
 * section scrub engine) and AmbientDrift (the ambient parallax layer).
 */

export type ScrollDotDockWindow = {
  /** global-p where the dock fade-out begins */
  start: number;
  /** global-p where the dock fade-out ends (dot fully handed off) */
  end: number;
};

export type ScrollDotProps = {
  /** The page-level scroll progress (0..1). The dot owns NO useScroll itself. */
  progress: MotionValue<number>;
  /** Dot diameter in px. Default 14. */
  size?: number;
  /** Dot fill (any CSS color). Default var(--color-accent). */
  color?: string;
  /** Vertical travel band in vh as [start, end]. Default [8, 92]. */
  travelVh?: [number, number];
  /**
   * Lateral weave stops as vw strings, sampled at evenly spaced progress points.
   * Default ["20vw","62vw","32vw","70vw","50vw"]. Pass a single-entry array for
   * a straight vertical line.
   */
  weaveVw?: string[];
  /**
   * Windows where the dot hands off to a section marker (fades to 0 + blur).
   * The dot is visible everywhere EXCEPT inside these windows.
   */
  dockWindows?: ScrollDotDockWindow[];
  /** global-p window where the dot blinks at the start. Default [0, 0.08]. */
  startBlink?: [number, number];
  /** global-p window where the dot rests + blinks at the end. Default [0.93, 1]. */
  restBlink?: [number, number];
  /** Light spring for the vertical glide. Default { stiffness: 200, damping: 40 }. */
  spring?: { stiffness?: number; damping?: number };
  /** Minimum viewport width for the overlay. Default 1024. */
  minWidth?: number;
  /** z-index of the fixed overlay. Default 40. */
  zIndex?: number;
  /**
   * Faint trailing spine drawn ABOVE the dot so it reads as one continuous
   * thread it is pulling through the page, not a stray dot that teleports
   * between frames. Default true. Length in vh + opacity are tunable.
   */
  spine?: boolean;
  /** Spine length above the dot, in vh. Default 26. */
  spineVh?: number;
  /** Spine peak opacity (fades to 0 at its top). Default 0.22. */
  spineOpacity?: number;
};

export function ScrollDot({
  progress,
  size = 14,
  color = "var(--color-accent)",
  travelVh = [8, 92],
  weaveVw = ["20vw", "62vw", "32vw", "70vw", "50vw"],
  dockWindows = [],
  startBlink = [0, 0.08],
  restBlink = [0.93, 1],
  spring,
  minWidth = 1024,
  zIndex = 40,
  spine = true,
  spineVh = 26,
  spineOpacity = 0.22,
}: ScrollDotProps) {
  const enhance = useEnhancementEnabled({ minWidth });

  // Vertical travel, lightly sprung so it glides with the wheel without lagging.
  const rawY = useTransform(progress, [0, 1], travelVh);
  const dotYvh = useSpring(rawY, {
    stiffness: spring?.stiffness ?? 200,
    damping: spring?.damping ?? 40,
  });
  const y = useTransform(dotYvh, (v) => `${v}vh`);

  // Lateral weave (evenly spaced sample points across the page progress).
  const weaveStops =
    weaveVw.length > 1
      ? weaveVw.map((_, i) => i / (weaveVw.length - 1))
      : [0, 1];
  const weaveVals = weaveVw.length > 1 ? weaveVw : [weaveVw[0], weaveVw[0]];
  const x = useTransform(progress, weaveStops, weaveVals);

  // Opacity: visible everywhere, fades to 0 inside each dock window + a brief
  // blur seam at the hand-off.
  const opacityStops: number[] = [0];
  const opacityVals: number[] = [1];
  const blurStops: number[] = [0];
  const blurVals: string[] = ["blur(0px)"];
  for (const d of dockWindows) {
    const mid = (d.start + d.end) / 2;
    opacityStops.push(d.start, mid, d.end);
    opacityVals.push(1, 0, 1);
    blurStops.push(d.start, mid, d.end);
    blurVals.push("blur(0px)", "blur(2px)", "blur(0px)");
  }
  opacityStops.push(1);
  opacityVals.push(1);
  blurStops.push(1);
  blurVals.push("blur(0px)");
  const opacity = useTransform(progress, opacityStops, opacityVals);
  const filter = useTransform(progress, blurStops, blurVals);

  // Blink halo: continuous loop, opacity-gated to the start blink + rest blink.
  const blinkOn = useTransform(
    progress,
    [
      0,
      startBlink[1],
      startBlink[1] + 0.01,
      restBlink[0] - 0.01,
      restBlink[0],
      1,
    ],
    [1, 1, 0, 0, 1, 1],
  );

  if (!enhance) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0"
      style={{ x, y, opacity, filter, zIndex, willChange: "transform, opacity" }}
    >
      {/* the trailing spine: a faint thread above the dot, fading upward, so the
          dot reads as drawing one continuous line through the page. Anchored at
          the dot center; shares the dot's opacity (so it fades at docks too). */}
      {spine && (
        <span
          className="absolute block"
          style={{
            left: 0,
            bottom: 0,
            width: 1,
            marginLeft: -0.5,
            height: `${spineVh}vh`,
            background: `linear-gradient(to top, ${color}, transparent)`,
            opacity: spineOpacity,
          }}
        />
      )}
      <span
        className="relative block rounded-full"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: color,
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: color, opacity: blinkOn, willChange: "transform, opacity" }}
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: color }}
            animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      </span>
    </motion.div>
  );
}
