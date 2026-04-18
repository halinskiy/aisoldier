import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type BlurbData = {
  quote: string;
  source: string;
  stars?: number;
};

export type BlurbWallProps = {
  blurbs: BlurbData[];
  /** Responsive column count at the `lg` breakpoint. Defaults to 3. */
  cols?: 2 | 3;
  /** Optional header rendered above the grid. */
  header?: ReactNode;
  /** Small disclaimer line rendered below the grid. */
  footnote?: string;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/BlurbWall.tsx";

/* -------------------------------------------------------------------------- */
/*  BlurbWall — dense grid of quote cards (like the back of a paperback).      */
/* -------------------------------------------------------------------------- */

/**
 * BlurbWall — a dense, NOT-a-carousel grid of editorial blurb cards.
 *
 * Matches the back-of-paperback aesthetic: every card visible at once, no
 * swiping required. 3-col at `lg`, 2-col at `sm`, 1-col on narrow mobile.
 *
 * Each card carries `data-motion="blur-reveal"` + `data-motion-index`, so
 * the project-level `MotionProvider` staggers the entry animation.
 */
export function BlurbWall({
  blurbs,
  cols = 3,
  header,
  footnote,
  className,
  dataSource,
}: BlurbWallProps) {
  const colsClass = cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <section
      data-component="BlurbWall"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-text,color-text-muted,color-accent,font-serif,radius-window,ease-out"
      className={cn("relative w-full", className)}
    >
      {header && <div className="mb-14 lg:mb-20">{header}</div>}

      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", colsClass)}>
        {blurbs.map((b, i) => (
          <BlurbCard key={i} index={i} {...b} />
        ))}
      </div>

      {footnote && (
        <p
          className="mt-8 text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]"
        >
          {footnote}
        </p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  BlurbCard — one quote card.                                                */
/* -------------------------------------------------------------------------- */

export function BlurbCard({
  quote,
  source,
  stars = 5,
  index = 0,
}: BlurbData & { index?: number }) {
  return (
    <article
      data-component="BlurbCard"
      data-source={DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-text,color-text-muted,color-accent,font-serif,radius-window,ease-out"
      data-motion="blur-reveal"
      data-motion-index={index}
      className={cn(
        "group flex h-full flex-col justify-between gap-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] p-6 lg:p-7",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-[2px] hover:border-[var(--color-border-strong)] hover:shadow-[0_1px_0_rgba(33,33,33,0.04),_0_8px_32px_-12px_rgba(33,33,33,0.08)]",
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Stars row */}
      <StarRow count={stars} />

      {/* Quote */}
      <blockquote
        className="font-serif italic text-[var(--color-text)]"
        style={{
          fontSize: "18px",
          lineHeight: 1.45,
          letterSpacing: "-0.005em",
        }}
      >
        <span aria-hidden className="mr-1 font-serif text-[var(--color-accent)]">“</span>
        {quote}
        <span aria-hidden className="ml-1 font-serif text-[var(--color-accent)]">”</span>
      </blockquote>

      {/* Source */}
      <figcaption
        className="font-sans text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]"
      >
        — {source}
      </figcaption>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  StarRow — 5 dot-stars in accent colour.                                    */
/* -------------------------------------------------------------------------- */

function StarRow({ count = 5 }: { count?: number }) {
  const total = 5;
  return (
    <ul
      aria-label={`${count} out of ${total} stars`}
      className="flex items-center gap-[6px]"
    >
      {Array.from({ length: total }).map((_, i) => (
        <li
          key={i}
          aria-hidden
          className="inline-block h-[8px] w-[8px] rounded-full"
          style={{
            backgroundColor:
              i < count ? "var(--color-accent)" : "var(--color-border-strong)",
          }}
        />
      ))}
    </ul>
  );
}
