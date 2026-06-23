"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";

import { EASE_OUT } from "../../lib/motion";

export type MetricItem = {
  /**
   * Final display value. Accepts:
   *   - plain strings ("54K", "6.4%", "2.1M", "3,800")
   *   - numbers (will be displayed with thousands separators)
   *
   * The count-up animation parses the leading numeric portion and preserves
   * the suffix (K, M, %, etc.) and any trailing prose.
   */
  value: string;
  /** Small-caps label shown below the big number. */
  label: string;
  /** Optional detail line below the label (e.g. "@yourhandle"). */
  detail?: string;
};

export type MetricsBarProps = {
  /** Eyebrow label rendered to the left of the metrics row. Optional. */
  eyebrow?: string;
  /** One-line headline sitting above the metrics row. Optional. */
  headline?: string;
  /** Intro line rendered beneath the headline. Optional. */
  intro?: string;
  /** Trailing footnote rendered beneath the metrics row. Optional. */
  note?: string;
  /** 2-6 metric items. Four is the canonical default. */
  items: MetricItem[];
  /** Pass-through class on the outer <section>. */
  className?: string;
  /** Override for Inspector data-source. */
  dataSource?: string;
  /** Section id for deep-linking. */
  id?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/MetricsBar.tsx";

/**
 * MetricsBar — editorial audience-metrics row.
 *
 * Designed for creator / publisher / bookstagram landings where the site must
 * display audience numbers as the central trust anchor. Big serif numbers,
 * small-caps sans labels, hairline border grid, count-up on scroll-into-view.
 *
 * Promoted from pagestack session 1 (2026-04-22).
 *
 * Doctrine rules honored:
 *   - Count-up uses `cubic-bezier(0.16, 1, 0.3, 1)` only.
 *   - `prefers-reduced-motion` and `?motion=0` skip the animation and render
 *     the final values synchronously (no "0" flash — learned from template-
 *     design Stats CountUp bug).
 *   - Borders everywhere: top+bottom section hairlines + inner cell dividers.
 *   - 16px minimum on label/detail text. 12px only on the uppercase eyebrow
 *     which has 0.062em tracking + weight 600 via EyebrowLabel contract.
 *
 * Usage:
 *
 *   <MetricsBar
 *     eyebrow="01 Audience"
 *     headline="The numbers brands ask for first."
 *     intro="Updated quarterly."
 *     items={[
 *       { value: "54K", label: "Instagram followers", detail: "@handle" },
 *       { value: "2.1M", label: "TikTok reach", detail: "trailing 90 days" },
 *       { value: "3,800", label: "Newsletter subscribers" },
 *       { value: "6.4%", label: "Engagement rate" },
 *     ]}
 *     note="Full audience demographics in the media kit below."
 *   />
 */
export function MetricsBar({
  eyebrow,
  headline,
  intro,
  note,
  items,
  className,
  dataSource,
  id,
}: MetricsBarProps) {
  return (
    <section
      id={id}
      data-component="MetricsBar"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-bg,color-text,color-text-muted,color-border,font-serif,ease-out"
      className={className}
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10"
        style={{ paddingTop: "clamp(56px, 8vh, 96px)", paddingBottom: "clamp(56px, 8vh, 96px)" }}
      >
        {(eyebrow || headline || intro) && (
          <header
            className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10"
          >
            <div className="flex flex-col gap-3">
              {eyebrow && (
                <span
                  className="font-sans font-semibold uppercase text-[var(--color-text-muted)]"
                  style={{
                    fontSize: "14px",
                    letterSpacing: "0.062em",
                    lineHeight: 1.2,
                  }}
                >
                  {eyebrow}
                </span>
              )}
              {headline && (
                <h2
                  className="font-serif font-medium text-[var(--color-text)]"
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    maxWidth: "24ch",
                  }}
                >
                  {headline}
                </h2>
              )}
            </div>
            {intro && (
              <p
                className="font-sans text-[var(--color-text-muted)]"
                style={{ fontSize: "16px", lineHeight: 1.55, maxWidth: "34ch" }}
              >
                {intro}
              </p>
            )}
          </header>
        )}

        <div
          className="grid grid-cols-2 md:grid-cols-4"
          role="list"
          style={{
            borderTop: "1px solid var(--color-border)",
            borderLeft: "1px solid var(--color-border)",
          }}
        >
          {items.map((item, i) => (
            <MetricCell key={`${item.label}-${i}`} item={item} />
          ))}
        </div>

        {note && (
          <p
            className="mt-8 font-sans text-[var(--color-text-subtle)]"
            style={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            {note}
          </p>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Metric cell with count-up on scroll-into-view
 * ------------------------------------------------------------------------ */

const cellStyle: CSSProperties = {
  borderRight: "1px solid var(--color-border)",
  borderBottom: "1px solid var(--color-border)",
  padding: "clamp(20px, 3vw, 36px)",
  minHeight: "clamp(140px, 18vh, 200px)",
};

function MetricCell({ item }: { item: MetricItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div
      role="listitem"
      ref={ref}
      className="flex flex-col justify-between gap-6"
      style={cellStyle}
    >
      <MetricNumber value={item.value} animate={inView} />
      <div className="flex flex-col gap-1">
        <span
          className="font-sans font-semibold uppercase text-[var(--color-text)]"
          style={{
            fontSize: "14px",
            letterSpacing: "0.062em",
            lineHeight: 1.3,
          }}
        >
          {item.label}
        </span>
        {item.detail && (
          <span
            className="font-sans text-[var(--color-text-subtle)]"
            style={{ fontSize: "14px", lineHeight: 1.4 }}
          >
            {item.detail}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Parse a value string into { leading number, suffix }.
 *
 * Examples:
 *   "54K"    → { n: 54,    suffix: "K",  fractionDigits: 0 }
 *   "2.1M"   → { n: 2.1,   suffix: "M",  fractionDigits: 1 }
 *   "3,800"  → { n: 3800,  suffix: "",   fractionDigits: 0, thousands: true }
 *   "6.4%"   → { n: 6.4,   suffix: "%",  fractionDigits: 1 }
 *   "Soon"   → null  (no numeric portion — render as-is)
 */
function parseValue(value: string) {
  const m = value.match(/^([0-9]+(?:[.,][0-9]+)?)(.*)$/);
  if (!m) return null;
  const rawNumber = m[1];
  const suffix = m[2];
  const thousands = /,/.test(rawNumber) && !/\./.test(rawNumber);
  const normalized = rawNumber.replace(/,/g, "");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  const fractionDigits = normalized.includes(".")
    ? normalized.split(".")[1].length
    : 0;
  return { n, suffix, fractionDigits, thousands };
}

function formatNumber(n: number, fractionDigits: number, thousands: boolean) {
  if (thousands) {
    // Integer with thousands separators. Round — the parsed number is always int here.
    return Math.round(n).toLocaleString("en-US");
  }
  return n.toFixed(fractionDigits);
}

function MetricNumber({ value, animate: shouldAnimate }: { value: string; animate: boolean }) {
  const prefersReduced = useReducedMotion();
  const parsed = parseValue(value);
  const staticMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("motion") === "0";

  // Hooks must be called unconditionally in the same order on every render,
  // so we always call them — even when we fall back to static rendering.
  const progress = useMotionValue(parsed ? parsed.n : 0);
  const display = useTransform(progress, (v) =>
    parsed ? formatNumber(v, parsed.fractionDigits, parsed.thousands) : value,
  );
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!parsed) return;
    const el = numberRef.current;
    if (!el) return;

    // Reduced-motion / static-mode fallback — render final value synchronously.
    // Fixes the template-design CountUp bug where motion=0 left "0" on screen.
    if (prefersReduced || staticMode || !shouldAnimate) {
      el.textContent = formatNumber(parsed.n, parsed.fractionDigits, parsed.thousands);
      return;
    }

    progress.set(0);
    const controls = animate(progress, parsed.n, {
      duration: 1.4,
      ease: [...EASE_OUT],
    });
    const unsub = display.on("change", (v) => {
      el.textContent = String(v);
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [parsed, shouldAnimate, prefersReduced, staticMode, progress, display]);

  if (!parsed) {
    // Non-numeric value — render as-is.
    return (
      <span
        className="font-serif font-medium text-[var(--color-accent)]"
        style={{
          fontSize: "clamp(40px, 5.5vw, 64px)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          fontFeatureSettings: '"tnum" 1, "lnum" 1',
        }}
      >
        {value}
      </span>
    );
  }

  // SSR and the first client paint MUST render the same text content.
  // We always render "0" here — the useEffect above takes over synchronously
  // on client mount and swaps to the final formatted value when reduced
  // motion / ?motion=0 is active, or animates up when the element enters view.
  // Previously this branched on `prefersReduced || staticMode` inside the
  // render tree, which produced a hydration mismatch because staticMode is
  // only truthy on the client (typeof window check). That shipped "0" on SSR
  // and the final value on hydrate → React threw a hydration error.
  return (
    <span
      className="font-serif font-medium text-[var(--color-accent)]"
      style={{
        fontSize: "clamp(40px, 5.5vw, 64px)",
        lineHeight: 1,
        letterSpacing: "-0.03em",
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
        display: "inline-flex",
        alignItems: "baseline",
      }}
      aria-label={value}
    >
      <span
        ref={numberRef}
        aria-hidden
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        0
      </span>
      {parsed.suffix && <span aria-hidden>{parsed.suffix}</span>}
    </span>
  );
}
