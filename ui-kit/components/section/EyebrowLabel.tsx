import type { CSSProperties, ReactNode } from "react";

import { cn } from "../../lib/cn";

export type EyebrowLabelProps = {
  children: ReactNode;
  /** Render as a pill with a border. Defaults to true — the Figma pattern. */
  pill?: boolean;
  /** Tint the label with the project accent instead of the default text color. */
  accent?: boolean;
  className?: string;
  style?: CSSProperties;
  /**
   * When the component is used through a project wrapper, pass the wrapper's
   * source path so Inspector points there; otherwise defaults to the kit path.
   */
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/EyebrowLabel.tsx";

/**
 * Eyebrow label — the only place the doctrine allows 12px text.
 *
 * Rules (from ~/Aisoldier/CLAUDE.md §2.4):
 *   - 12px (`--text-label-lg`)
 *   - IBM Plex Sans, weight 600
 *   - uppercase
 *   - letter-spacing 0.062em (from DESIGN_SYSTEM.md)
 *
 * Variants:
 *   - `pill` (default) — border + rounded-full + horizontal padding
 *   - non-pill — bare inline label, useful inside dark banners
 */
export function EyebrowLabel({
  children,
  pill = true,
  accent = false,
  className,
  style,
  dataSource,
}: EyebrowLabelProps) {
  return (
    <span
      data-component="EyebrowLabel"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="text-label-lg,color-border,color-text,color-accent,radius-pill"
      className={cn(
        "inline-flex w-fit self-start items-center font-sans text-[14px] font-medium uppercase leading-[1.5]",
        "tracking-[0.062em]",
        accent ? "text-[var(--color-accent)]" : "text-[var(--color-text)]",
        pill &&
          "rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-1 backdrop-blur-[2px]",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
