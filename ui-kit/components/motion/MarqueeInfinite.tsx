"use client";

import { useReducedMotion } from "framer-motion";
import { useRef } from "react";

export type MarqueeInfiniteProps = {
  items: string[];
  /** pixels per second — default 60 */
  speed?: number;
  /** separator rendered between items — defaults to a small crimson diamond */
  separator?: React.ReactNode;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/motion/MarqueeInfinite.tsx";

export function MarqueeInfinite({
  items,
  speed = 60,
  separator,
  className = "",
  dataSource,
}: MarqueeInfiniteProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items so the second copy seamlessly follows the first
  const row = [...items, ...items];

  // Animation duration: track is 2× the single-copy width.
  // We measure by item count as a proxy — real width via CSS var set on mount
  // would be more precise but requires JS. Instead we use a known-good formula:
  // duration = (number of original items × item width estimate) / speed
  // We hard-code nothing; we set --duration via inline style calculated from speed.
  // Since we can't know exact width at build time, we use a CSS animation with
  // a fixed duration per item, tuned to speed prop.
  const perItemMs = 1000 / (speed / 160); // ~160px average item width
  const durationMs = Math.round(items.length * perItemMs);

  const sep = separator ?? (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        backgroundColor: "var(--color-accent)",
        margin: "0 32px",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );

  return (
    <div
      data-component="MarqueeInfinite"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text-subtle,font-sans"
      className={`overflow-hidden ${className}`}
      style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          width: "max-content",
          animation: reduced ? "none" : `marquee-scroll ${durationMs}ms linear infinite`,
          willChange: "transform",
        }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-subtle)",
              flexShrink: 0,
            }}
          >
            {item}
            {sep}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
