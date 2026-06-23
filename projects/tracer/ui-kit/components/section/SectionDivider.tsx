import { cn } from "../../lib/cn";

export type SectionDividerProps = {
  /** Color variant — `default` uses `--color-border`, `strong` uses `--color-border-strong`. */
  tone?: "default" | "strong";
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/SectionDivider.tsx";

/**
 * Section-level 1px hairline divider — 100% width of its parent.
 *
 * Trivial but named: Inspector picks it up, and the token contract stays
 * consistent across all the sections that use it (Approach, Testimonials,
 * Footer). Prefer this over inline `<hr />`.
 */
export function SectionDivider({
  tone = "default",
  className,
  dataSource,
}: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-component="SectionDivider"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-border-strong"
      className={cn(
        "h-px w-full",
        tone === "strong"
          ? "bg-[var(--color-border-strong)]"
          : "bg-[var(--color-border)]",
        className,
      )}
    />
  );
}
