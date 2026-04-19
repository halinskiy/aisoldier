import type { CSSProperties, ReactNode } from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Tone = "default" | "accent" | "muted" | "outline";
type Size = "sm" | "md";

export type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  className?: string;
  style?: CSSProperties;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/Badge.tsx";

/* -------------------------------------------------------------------------- */
/*  Styles                                                                     */
/* -------------------------------------------------------------------------- */

const tones: Record<Tone, string> = {
  // Default: surface bg + border + text color.
  default:
    "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]",
  // Accent: accent fill. Near-black text for AAA contrast on orange-family
  // accents (matches Button `accent` variant decision).
  accent:
    "bg-[var(--color-accent)] border border-[var(--color-accent)] text-[#1e1e1e]",
  // Muted: deeper neutral surface + subtler text.
  muted:
    "bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-muted)]",
  // Outline: transparent fill, strong border.
  outline:
    "bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text)]",
};

const sizes: Record<Size, string> = {
  sm: "px-2 py-[2px] text-[10px]",
  md: "px-[10px] py-[3px] text-[12px]",
};

/* -------------------------------------------------------------------------- */
/*  Badge                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Small bordered pill for meta labels, status, counts.
 *
 * Uppercase letter-spaced text at 10px (sm) / 12px (md). The only two
 * sub-body text sizes in the kit beyond `EyebrowLabel` — both are
 * uppercase-only, which the doctrine allows at 10-12px.
 *
 * Tones:
 *   - `default` — surface fill + default border.
 *   - `accent`  — accent fill, near-black text (AAA-safe on orange family).
 *   - `muted`   — surface-2 fill, muted text.
 *   - `outline` — transparent fill, strong border.
 */
export function Badge({
  children,
  tone = "default",
  size = "md",
  className,
  style,
  dataSource,
}: BadgeProps) {
  return (
    <span
      data-component="Badge"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-surface,color-surface-2,color-border,color-border-strong,color-text,color-text-muted,color-accent,radius-pill"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full font-sans font-semibold uppercase leading-[1.2] tracking-[0.062em]",
        tones[tone],
        sizes[size],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
