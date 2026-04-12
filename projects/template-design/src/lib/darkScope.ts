import type { CSSProperties } from "react";

/**
 * Shared dark-theme scope override.
 *
 * Apply as `style={DARK_SCOPE}` on a plain wrapper `<div>` or `<section>`.
 * Kit components inside render purely from `var(--color-*)` tokens and
 * inherit the inverted palette automatically via CSS cascade.
 *
 * See DECISIONS.md "Theme-scope pattern via CSS variable override".
 * Used by Section 11 (Contact) and Section 12 (Footer).
 */
export const DARK_SCOPE: CSSProperties = {
  ["--color-bg" as string]: "#1e1e1e",
  ["--color-surface" as string]: "#262626",
  ["--color-surface-2" as string]: "#2f2f2f",
  ["--color-border" as string]: "rgba(255, 255, 255, 0.14)",
  ["--color-border-strong" as string]: "rgba(255, 255, 255, 0.28)",
  ["--color-text" as string]: "#f4f4f4",
  ["--color-text-muted" as string]: "rgba(244, 244, 244, 0.72)",
  ["--color-text-subtle" as string]: "rgba(244, 244, 244, 0.5)",
  ["--color-text-faint" as string]: "rgba(244, 244, 244, 0.3)",
  backgroundColor: "#1e1e1e",
  color: "#f4f4f4",
};
