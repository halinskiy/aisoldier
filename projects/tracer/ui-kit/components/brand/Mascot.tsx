"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mascot — a token-driven friendly blob creature for landing pages that want a
 * character with personality. Theme-agnostic: every colour is a CSS variable
 * (default --color-accent-soft body, --color-ink stroke, --color-paper eyes,
 * --color-accent accents) so any project can drop it in and it inherits the
 * project accent + neutral ramp. Promoted from quirky-landing's Quirky character.
 *
 * Behaviour (the "FRIEND, not Clippy" contract):
 *  - Blinks on a randomized 2.6 to 6s cadence so it never feels metronomic.
 *  - Pupils track the cursor on FINE pointers only. Coarse pointers (touch) get
 *    a calm centred pose so it cannot wobble or cost layout on mobile.
 *  - `mood`: "idle" rests, "happy" squishes up with blush (no bounce, EASE_OUT),
 *    "peek" tilts in curiously.
 *
 * Static safety (load-bearing): pass `still` (e.g. reduced-motion / a ?motion=0
 * flag) and the creature renders a calm static pose: no blink, no tracking, no
 * transitions. Still present and charming.
 *
 * NOTE: kept dependency-free (no framer-motion) so the kit stays portable. The
 * happy "squish" is a CSS transform transition with the pneumatic ease. Projects
 * that want richer motion can wrap it; quirky-landing wraps reactions + a speech
 * bubble around this shell in src/components/character/Quirky.tsx.
 *
 * Inspector: carries data-component / data-source / data-tokens.
 */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export type MascotMood = "idle" | "happy" | "peek";

export type MascotProps = {
  size?: number;
  mood?: MascotMood;
  /** Render the calm static pose (reduced motion / ?motion=0). */
  still?: boolean;
  className?: string;
  decorative?: boolean;
  label?: string;
};

export function Mascot({
  size = 96,
  mood = "idle",
  still = false,
  className,
  decorative = false,
  label = "A small friendly blob creature",
}: MascotProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (still) return;
    let t: ReturnType<typeof setTimeout>;
    let o: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        o = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, 2600 + Math.random() * 3400);
    };
    schedule();
    return () => {
      clearTimeout(t);
      clearTimeout(o);
    };
  }, [still]);

  useEffect(() => {
    if (still || coarse) return;
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.42;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 220, 1);
      setPupil({ x: (dx / dist) * 3 * reach, y: (dy / dist) * 3 * reach });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [still, coarse]);

  const happy = mood === "happy" && !still;
  const peek = mood === "peek";
  const px = still ? 0 : pupil.x;
  const py = still ? 0 : happy ? pupil.y - 0.6 : pupil.y;

  const eyeY = 42;
  const eyeR = 8;
  const pupilR = 3.6;

  const bodyTransform = still
    ? undefined
    : peek
      ? "rotate(-8deg)"
      : happy
        ? "translateY(-3px) scale(0.98, 1.04)"
        : "none";

  return (
    <div
      ref={wrapRef}
      data-component="Mascot"
      data-source="ui-kit/components/brand/Mascot.tsx"
      data-tokens="accent,accent-soft,ink,paper"
      className={["relative inline-block", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role={decorative ? "presentation" : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        className="overflow-visible"
        style={{
          transformOrigin: "50% 80%",
          transform: bodyTransform,
          transition: still ? undefined : `transform 450ms ${EASE}`,
        }}
      >
        <path
          d="M50 8 C72 8 90 20 92 44 C94 68 82 90 50 92 C18 90 6 68 8 44 C10 20 28 8 50 8 Z"
          fill="var(--color-accent-soft, #f0eeea)"
          stroke="var(--color-ink, #1a1614)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <ellipse cx="50" cy="64" rx="20" ry="14" fill="var(--color-accent, #e63e2e)" opacity={0.16} />
        <g style={{ opacity: happy ? 1 : 0, transition: still ? undefined : `opacity 250ms ${EASE}` }}>
          <circle cx="26" cy="54" r="5" fill="var(--color-accent, #e63e2e)" opacity={0.4} />
          <circle cx="74" cy="54" r="5" fill="var(--color-accent, #e63e2e)" opacity={0.4} />
        </g>
        {[38, 62].map((ex, i) => (
          <g key={i}>
            <circle cx={ex} cy={eyeY} r={eyeR} fill="var(--color-paper, #fff)" stroke="var(--color-ink, #1a1614)" strokeWidth={1.6} />
            <circle
              cx={ex + px}
              cy={eyeY + py}
              r={pupilR}
              fill="var(--color-ink, #1a1614)"
              style={{ transition: still ? undefined : "cx 120ms linear, cy 120ms linear" }}
            />
            <circle cx={ex + px - 1.1} cy={eyeY + py - 1.1} r={1.1} fill="var(--color-paper, #fff)" />
            <rect
              x={ex - eyeR - 1.4}
              y={eyeY - eyeR - 1.4}
              width={(eyeR + 1.4) * 2}
              height={(eyeR + 1.4) * 2}
              rx={eyeR}
              fill="var(--color-accent-soft, #f0eeea)"
              style={{
                transformOrigin: `${ex}px ${eyeY - eyeR}px`,
                transform: blink ? "scaleY(1)" : "scaleY(0)",
                transition: still ? undefined : "transform 90ms linear",
              }}
            />
          </g>
        ))}
        <path
          d={happy ? "M40 70 Q50 80 60 70" : "M42 70 Q50 75 58 70"}
          fill="none"
          stroke="var(--color-ink, #1a1614)"
          strokeWidth={2.4}
          strokeLinecap="round"
          style={{ transition: still ? undefined : `d 250ms ${EASE}` }}
        />
      </svg>
    </div>
  );
}
