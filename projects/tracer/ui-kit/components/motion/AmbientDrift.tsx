"use client";

import { useEffect, useId, useState } from "react";

/**
 * AmbientDrift - a single slow, heavily-blurred, low-opacity glow blob that
 * drifts behind a dark stage's content. The ONE sanctioned continuous content
 * area loop besides a genuine live indicator: it reads as atmosphere, never as
 * a shape, and never crosses a text edge (it sits behind content in the
 * margins). Use it on cinematic dark stages where a still surface would feel
 * dead. One instance per stage; do not stack several.
 *
 * Hard rules baked in (non-overridable, so a caller cannot make it loud):
 *   - opacity is clamped to <= 0.12 regardless of the prop.
 *   - duration is clamped to >= 20s.
 *   - the blob is position:absolute, pointer-events:none, z-index:0. The
 *     consuming content must be position:relative z-index:1 ABOVE it.
 *   - ONLY translation drift (x/y). No scale pulse, no opacity pulse - the
 *     opacity is static at the set value so it never "breathes".
 *   - prefers-reduced-motion AND html[data-motion="off"] (the ?motion=0 QA
 *     flag) halt the drift immediately; the blob renders statically at its
 *     start position. CLS-neutral (it is absolutely positioned, no layout box).
 *
 * Token-agnostic: pass any CSS color (defaults to the project accent var). The
 * keyframes are injected once per mounted instance via a scoped <style> using a
 * unique animation name, so no global stylesheet entry is required and the kit
 * stays drop-in for both Next.js and Vite consumers.
 *
 * Promoted from tracer V2 (2026-06-23): used on the Hero, Ownership and CTA
 * dark stages.
 */
export type AmbientDriftProps = {
  /** Blob color (any CSS color). Applied under the clamped opacity. Default: var(--color-accent). */
  color?: string;
  /** Max opacity. Clamped to <= 0.12. Default: 0.08. */
  opacity?: number;
  /** Drift cycle seconds. Clamped to >= 20. Default: 30. */
  duration?: number;
  /** Heavy blur radius in px. Default: 80. */
  blur?: number;
  /** Blob diameter in px. Default: 400. */
  size?: number;
  /** Inline positioning of the blob's center (e.g. { top: "30%", left: "12%" }). */
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  /** Drift travel amplitude in px (peak offset from start). Default: 60. */
  amplitude?: number;
  className?: string;
};

export function AmbientDrift({
  color = "var(--color-accent)",
  opacity = 0.08,
  duration = 30,
  blur = 80,
  size = 400,
  position,
  amplitude = 60,
  className,
}: AmbientDriftProps) {
  const safeOpacity = Math.min(Math.max(opacity, 0), 0.12);
  const safeDuration = Math.max(duration, 20);

  const [paused, setPaused] = useState(true); // SSR + first frame: static
  // useId is stable across SSR and client, so the injected keyframe name and the
  // <style> content match on hydration (no mismatch). Sanitize the colon.
  const name = `ambient-drift-${useId().replace(/[:]/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => {
      const motionOff = document.documentElement.dataset.motion === "off";
      setPaused(reduceQuery.matches || motionOff);
    };
    evaluate();
    reduceQuery.addEventListener("change", evaluate);
    const observer = new MutationObserver(evaluate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    return () => {
      reduceQuery.removeEventListener("change", evaluate);
      observer.disconnect();
    };
  }, []);

  const a = amplitude;
  const keyframes = `@keyframes ${name}{
    0%{transform:translate(0px,0px)}
    25%{transform:translate(${a}px,${-a * 0.6}px)}
    50%{transform:translate(${a * 0.4}px,${a}px)}
    75%{transform:translate(${-a * 0.7}px,${a * 0.3}px)}
    100%{transform:translate(0px,0px)}
  }`;

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        zIndex: 0,
        pointerEvents: "none",
        top: position?.top ?? "50%",
        left: position?.left,
        right: position?.right,
        bottom: position?.bottom,
        ...(position?.top || position?.bottom ? {} : { top: position?.top ?? "50%" }),
        ...(position?.left || position?.right ? {} : { left: "50%" }),
        width: size,
        height: size,
        marginTop: -size / 2,
        marginLeft: position?.left || position?.right ? undefined : -size / 2,
        borderRadius: "9999px",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity: safeOpacity,
        willChange: "transform",
        animation: paused ? "none" : `${name} ${safeDuration}s ease-in-out infinite`,
      }}
    >
      <style>{keyframes}</style>
    </div>
  );
}
