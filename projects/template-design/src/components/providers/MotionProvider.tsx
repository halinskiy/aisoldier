"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Root-level motion driver.
 *
 * Scans the DOM once on mount for every `[data-motion="blur-reveal"]` that
 * hasn't been initialised (not `data-motion-state="..."` already) and:
 *   1. Sets `data-motion-state="initial"` so CSS can apply the hidden style.
 *   2. Observes the element with an `IntersectionObserver`.
 *   3. On enter, flips to `data-motion-state="visible"` so CSS transitions
 *      the element to its resting state.
 *
 * Respects `prefers-reduced-motion` — every motion target is marked
 * `data-motion-state="reduced"` and skipped.
 *
 * If `?motion=0` is in the URL (e.g. for regression screenshots) all motion
 * targets are set to `visible` immediately. This keeps layout pixel-stable
 * for the CDP regression assertion.
 *
 * Kit `BlurReveal` + `SplitText` components opt OUT of this driver by using
 * their own Framer Motion hooks — they set `data-motion-state` themselves
 * so the observer skips them.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staticMode =
      new URLSearchParams(window.location.search).get("motion") === "0";

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-motion="blur-reveal"], [data-motion="line-draw"]',
      ),
    ).filter((el) => !el.dataset.motionState);

    if (reduced || staticMode) {
      targets.forEach((el) => {
        el.dataset.motionState = staticMode ? "visible" : "reduced";
      });
      return;
    }

    targets.forEach((el) => {
      el.dataset.motionState = "initial";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // Respect stagger index if one is set.
            const idx = Number(el.dataset.motionIndex ?? 0);
            const delay = Math.min(idx, 10) * 60;
            window.setTimeout(() => {
              el.dataset.motionState = "visible";
            }, delay);
            observer.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
