import type { CSSProperties } from "react";

import { cn } from "../../lib/cn";

export type SectionColophonProps = {
  /** Two-digit section number, e.g. "01". */
  n: string;
  /** Section name, e.g. "hero". Lowercase input is fine; CSS uppercases. */
  name: string;
  /**
   * When the component is rendered through a project wrapper or vendored copy,
   * pass the wrapper's source path so Inspector points there.
   */
  dataSource?: string;
  className?: string;
  style?: CSSProperties;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/SectionColophon.tsx";

/**
 * SectionColophon: small editorial annotation for a section corner.
 *
 * Renders the section number and name in the canonical "01 / hero" form
 * (number, space, slash, space, name). IBM Plex Mono, 11px, uppercase,
 * letter-spacing 0.062em, muted token. Purely presentational; not a link.
 *
 * Placement convention: top-right of the section's content container so the
 * eye reads heading, then colophon, then body. Below 640px the colophon
 * is hidden (cramped on small screens; the section heading already names
 * the chapter).
 *
 * Doctrine notes:
 *   - ASCII only. Separator is a literal " / " (space-slash-space).
 *   - Static. No motion, no scroll-driven animation. Renders identically
 *     under `prefers-reduced-motion` and `?motion=0`.
 *   - Inspector triple `data-component` / `data-source` / `data-tokens`
 *     applied at the root span.
 */
export function SectionColophon({
  n,
  name,
  dataSource,
  className,
  style,
}: SectionColophonProps) {
  return (
    <span
      data-component="SectionColophon"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-text-subtle,font-mono,ls-eyebrow"
      className={cn("section-colophon", className)}
      style={style}
      aria-hidden="true"
    >
      <span className="section-colophon__n">{n}</span>
      <span className="section-colophon__sep" aria-hidden="true">{" / "}</span>
      <span className="section-colophon__name">{name}</span>
    </span>
  );
}
