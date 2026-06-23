"use client";

import { useEffect, useState } from "react";

/**
 * useEnhancementEnabled — the single gate for any heavy, scroll-linked, or
 * pinned motion ENHANCEMENT that must layer on top of a static content
 * backbone, not replace it.
 *
 * Returns true only when ALL of these hold:
 *   - viewport width >= `minWidth` (default 768): pinned / fixed-overlay motion
 *     is desktop/tablet only; narrow screens fall back to the calm per-section
 *     reveals so nothing traps scroll on touch or overflows.
 *   - prefers-reduced-motion is NOT set.
 *   - html[data-motion] is NOT "off" (the ?motion=0 QA flag + any pre-hydration
 *     bootstrap that sets it). useReducedMotion() alone does NOT cover ?motion=0
 *     on browsers that do not report reduced-motion (headless QA), so we read the
 *     attribute too.
 *
 * Returns false during SSR and the first client frame, then resolves after
 * mount, so the gated enhancement only ever mounts when it is genuinely safe.
 * Re-evaluates on resize, on the reduced-motion media query changing, and on the
 * data-motion attribute changing (MutationObserver).
 *
 * This is the load-bearing lesson from template-design: a scroll-driven flourish
 * must never be the only way content renders. Gate the flourish on this hook;
 * render the static sections unconditionally underneath. Promoted from
 * quirky-landing 2026-06-01 (the scroll-pinned morph overlay).
 *
 * Token-agnostic and consumer-agnostic: works from any Next.js / Vite app.
 */
export type UseEnhancementEnabledOptions = {
  /** Minimum viewport width (px) at which the enhancement may run. */
  minWidth?: number;
};

export function useEnhancementEnabled(
  options: UseEnhancementEnabledOptions = {},
): boolean {
  const { minWidth = 768 } = options;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideQuery = window.matchMedia(`(min-width: ${minWidth}px)`);

    const evaluate = () => {
      const motionOff = document.documentElement.dataset.motion === "off";
      setEnabled(wideQuery.matches && !reduceQuery.matches && !motionOff);
    };

    evaluate();

    reduceQuery.addEventListener("change", evaluate);
    wideQuery.addEventListener("change", evaluate);

    const observer = new MutationObserver(evaluate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    return () => {
      reduceQuery.removeEventListener("change", evaluate);
      wideQuery.removeEventListener("change", evaluate);
      observer.disconnect();
    };
  }, [minWidth]);

  return enabled;
}
