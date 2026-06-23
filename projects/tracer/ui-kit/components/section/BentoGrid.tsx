import type { CSSProperties, ReactNode } from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type BentoGridProps = {
  children: ReactNode;
  /** Number of columns. Default 12 (standard SaaS bento). */
  cols?: number;
  /** Minimum height per grid row in px. Default 240. */
  rowMinHeight?: number;
  /** Gap between cells in px. Default 16. */
  gap?: number;
  className?: string;
  dataSource?: string;
};

export type BentoCellSpan = {
  base?: number;
  md?: number;
  lg?: number;
};

export type BentoCellProps = {
  children: ReactNode;
  /** Responsive column span. Defaults: 12 / 6 / 6. */
  span?: BentoCellSpan;
  /** Row span (how many grid rows this cell occupies). Default 1. */
  rowSpan?: number;
  /** Surface variant. */
  tone?: "default" | "surface" | "accent";
  /** Padding preset. md = 24, lg = 32. Default lg. */
  padding?: "md" | "lg";
  className?: string;
  style?: CSSProperties;
  dataSource?: string;
};

const DATA_SOURCE_GRID = "ui-kit/components/section/BentoGrid.tsx";

const toneClasses: Record<NonNullable<BentoCellProps["tone"]>, string> = {
  default:
    "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:shadow-sm",
  surface:
    "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:shadow-sm",
  accent:
    "bg-[var(--color-accent)] border border-[var(--color-accent)] text-[#1e1e1e]",
};

const paddingClasses: Record<NonNullable<BentoCellProps["padding"]>, string> = {
  md: "p-6",
  lg: "p-8",
};

/* -------------------------------------------------------------------------- */
/*  BentoGrid                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * 12-column bento container — the default layout for feature sections in
 * 2024-2026 SaaS. Pair with `BentoCell` children; each cell picks its own
 * column span per breakpoint.
 */
export function BentoGrid({
  children,
  cols = 12,
  rowMinHeight = 240,
  gap = 16,
  className,
  dataSource,
}: BentoGridProps) {
  return (
    <div
      data-component="BentoGrid"
      data-source={dataSource ?? DATA_SOURCE_GRID}
      data-tokens="color-border,radius-window,ease-out"
      className={cn("grid w-full", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: `minmax(${rowMinHeight}px, auto)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BentoCell                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Single cell inside `BentoGrid`. 12px radius, 1px border, hover lifts the
 * border strength and adds a subtle shadow (light-theme only — shadows
 * don't carry in dark by doctrine; the border-strong transition is still
 * visible there).
 *
 * `span` is responsive via inline CSS custom properties because Tailwind
 * can't generate arbitrary `col-span-{n}` per breakpoint at runtime.
 */
export function BentoCell({
  children,
  span = { base: 12, md: 6, lg: 6 },
  rowSpan = 1,
  tone = "default",
  padding = "lg",
  className,
  style,
  dataSource,
}: BentoCellProps) {
  const base = span.base ?? 12;
  const md = span.md ?? base;
  const lg = span.lg ?? md;

  const inlineStyle: CSSProperties = {
    ...style,
    // Exposed as CSS variables so the classes below can reference them at
    // the correct breakpoint via arbitrary-variant utilities.
    ["--cell-col-base" as string]: `span ${base} / span ${base}`,
    ["--cell-col-md" as string]: `span ${md} / span ${md}`,
    ["--cell-col-lg" as string]: `span ${lg} / span ${lg}`,
    gridRow: `span ${rowSpan} / span ${rowSpan}`,
  };

  return (
    <div
      data-component="BentoCell"
      data-source={dataSource ?? DATA_SOURCE_GRID}
      data-tokens="color-bg,color-surface,color-accent,color-border,color-border-strong,radius-window,ease-out"
      className={cn(
        "flex flex-col rounded-[var(--radius-window)] transition-[border-color,box-shadow] duration-150",
        "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        "[grid-column:var(--cell-col-base)] md:[grid-column:var(--cell-col-md)] lg:[grid-column:var(--cell-col-lg)]",
        toneClasses[tone],
        paddingClasses[padding],
        className,
      )}
      style={inlineStyle}
    >
      {children}
    </div>
  );
}
