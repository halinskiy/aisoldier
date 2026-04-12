"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@kit/components/ui/Button";
import { SectionDivider } from "@kit/components/section/SectionDivider";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import copy from "@content/copy.json";
import statsJson from "@content/stats.json";
import testimonialsJson from "@content/testimonials.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Testimonials.tsx";

type Testimonial = (typeof testimonialsJson)[number];
type Stat = (typeof statsJson)[number];

/**
 * Section 8 — Testimonials + Stats.
 *
 * Largest section on the page (2493px in Figma). Resolves the most
 * designer gaps of any section:
 *
 *   🔴 #2  eyebrow "Services" → "Testimonials" (sourced from copy.json,
 *          fixed in session 1; this section consumes it verbatim)
 *   🔴 #3  fixed 400px card height with varying quote lengths →
 *          `grid-auto-rows: minmax(400px, auto)` on the grid + `mt-auto`
 *          on the author block. Wendy Kemp / Diana Xavier / Holly Woods
 *          all live in row 2 and must share a single computed row height.
 *   🔴     row 4 orphan → render 10 cards, let CSS grid place the tenth
 *          card on row 4 column 1. No empty divs, no placeholder cells.
 *   🟠 #8  fractional card width (442.67) → `grid grid-cols-3 gap-6`
 *   🟡 #16 "12% annual returns" → replaced with "400+ Families served"
 *          in stats.json (session 1)
 *
 * Content:
 *   10 testimonials from `content/testimonials.json` (all 10 roles still
 *   say "Co-Founder @ Company" — flagged in HANDOFF as client-rewrite).
 *   4 stats from `content/stats.json`.
 */
export function Testimonials() {
  const { testimonials } = copy;
  const cards = (testimonialsJson as Testimonial[]).slice(0, 10);
  const stats = statsJson as Stat[];

  return (
    <section
      id="testimonials"
      data-component="Testimonials"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,font-serif,text-h3"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="split"
          eyebrow={testimonials.eyebrow}
          headline={testimonials.headline}
          body={testimonials.sidebar}
          cta={
            <Button
              href={testimonials.leaveReview.href}
              variant="secondary"
              size="md"
              trailingDot={false}
            >
              {testimonials.leaveReview.label}
            </Button>
          }
          dataSource={DATA_SOURCE}
        />

        <div className="mt-16 lg:mt-20">
          <SectionDivider dataSource={DATA_SOURCE} />
        </div>

        <TestimonialGrid cards={cards} />

        <div className="mt-16 lg:mt-20">
          <SectionDivider dataSource={DATA_SOURCE} />
        </div>

        <div className="mt-12 lg:mt-16">
          <StatsRow stats={stats} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function TestimonialGrid({ cards }: { cards: Testimonial[] }) {
  return (
    <ul
      data-component="TestimonialGrid"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-bg"
      className="mt-16 grid grid-cols-1 gap-6 [grid-auto-rows:minmax(400px,auto)] sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
    >
      {cards.map((t, i) => (
        <TestimonialCard key={t.id} testimonial={t} index={i} />
      ))}
    </ul>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <li
      data-motion="blur-reveal"
      data-motion-index={index}
      data-component="TestimonialCard"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-text,color-text-muted,color-accent,radius-window,font-sans"
      className="flex flex-col rounded-[var(--radius-window)] border border-[var(--color-border)] bg-white p-7 md:p-10"
    >
      <StarRating rating={testimonial.rating} />
      <p className="mt-5 text-[16px] leading-[1.5] text-[var(--color-text)]">
        {testimonial.quote}
      </p>
      <div className="mt-auto flex items-center gap-4 pt-8">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
          <Image
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-[16px] font-semibold leading-[1.4] text-[var(--color-text)]">
            {testimonial.name}
          </span>
          <span className="text-[14px] leading-[1.4] text-[var(--color-text-muted)]">
            {testimonial.role}
          </span>
        </div>
      </div>
    </li>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex items-center gap-1 text-[var(--color-accent)]"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

/**
 * CountUp — local stat number animator.
 *
 * Parses the leading digit/decimal prefix from strings like `"500+"`,
 * `"$3.2B+"`, `"18 years"`, `"400+"` and animates the numeric part from
 * 0 to the target over 1.6s with an ease-out easing curve. The non-numeric
 * suffix (`"+"`, `"B+"`, `" years"`) is appended at the end — during the
 * animation we only show the integer part.
 *
 * Uses IntersectionObserver + requestAnimationFrame — no animation library.
 * Respects `prefers-reduced-motion` (renders the final value instantly).
 */
function CountUp({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  const parsed = parseNumericPrefix(value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!parsed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staticMode =
      new URLSearchParams(window.location.search).get("motion") === "0";
    if (reduced || staticMode) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    setDisplay(formatNumber(0, parsed.suffix, parsed.hasDecimal));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            observer.disconnect();
            animateTo(parsed.number, parsed.suffix, parsed.hasDecimal, setDisplay);
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, value]);

  return (
    <span
      ref={ref}
      data-motion="count-up"
      className={className}
      style={style}
    >
      {display}
    </span>
  );
}

function parseNumericPrefix(value: string): {
  number: number;
  suffix: string;
  hasDecimal: boolean;
} | null {
  const match = value.match(/^(\$)?(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, dollar, numStr, rest] = match;
  const number = parseFloat(numStr);
  return {
    number,
    suffix: `${dollar ?? ""}${rest}`, // trailing content — e.g. "B+", "+", " years"
    hasDecimal: numStr.includes("."),
  };
}

function formatNumber(current: number, suffix: string, hasDecimal: boolean): string {
  const n = hasDecimal ? current.toFixed(1) : Math.round(current).toString();
  // If the original had a leading `$`, parseNumericPrefix stores it at the
  // start of `suffix`. Detect and re-prepend so `$3.2B+` animates correctly.
  if (suffix.startsWith("$")) return `$${n}${suffix.slice(1)}`;
  return `${n}${suffix}`;
}

function animateTo(
  target: number,
  suffix: string,
  hasDecimal: boolean,
  setDisplay: (s: string) => void,
) {
  const duration = 1600;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const current = target * ease(t);
    setDisplay(formatNumber(current, suffix, hasDecimal));
    if (t < 1) requestAnimationFrame(step);
    else setDisplay(formatNumber(target, suffix, hasDecimal));
  };
  requestAnimationFrame(step);
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.2}
      aria-hidden
    >
      <path d="M6 0.6 L7.53 3.72 L10.98 4.22 L8.49 6.64 L9.08 10.08 L6 8.46 L2.92 10.08 L3.51 6.64 L1.02 4.22 L4.47 3.72 Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <ul
      data-component="StatsRow"
      data-source={DATA_SOURCE}
      data-tokens="color-text,color-text-muted,font-serif,text-h3"
      className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-12"
    >
      {stats.map((stat, i) => (
        <li
          key={stat.label}
          data-motion="count-up"
          data-motion-index={i}
          data-component="StatCell"
          data-source={DATA_SOURCE}
          data-tokens="color-text,color-text-muted,font-serif"
          className="flex flex-col gap-2"
        >
          <CountUp
            value={stat.value}
            className="font-serif font-normal text-[var(--color-text)]"
            style={{
              fontSize: "clamp(32px, 4vw, 44px)",
              lineHeight: "1.05",
              letterSpacing: "-0.025em",
            }}
          />
          <span className="text-[14px] leading-[1.5] text-[var(--color-text-muted)]">
            {stat.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
