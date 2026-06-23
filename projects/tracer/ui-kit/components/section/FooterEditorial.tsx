import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { TextLink } from "../ui/TextLink";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type FooterLink = {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
};

export type FooterColumn = {
  /** Small-caps column label (e.g. "Product", "Open source"). */
  label: string;
  links: FooterLink[];
};

export type FooterEditorialProps = {
  /** Oversized typographic mark, the author/brand name. */
  wordmark: string;
  /** Short line beneath the nav grid. Sans, not serif. */
  tagline?: string;
  /** Flat sitemap nav. Ignored when `columns` is provided. */
  links?: FooterLink[];
  /**
   * Labeled nav columns (label + links). When provided, renders a labeled
   * column grid instead of the flat `links` row (contract S7b style).
   */
  columns?: FooterColumn[];
  /** Small print on the bottom rule, the copyright line. */
  legal?: string;
  /** Optional right-aligned bottom string (e.g. "Built with Booquarium"). */
  builtWith?: ReactNode;
  /** Optional top-anchor href for the scroll-to-top link. Defaults to `#top`. */
  topHref?: string;
  /** Optional translated label for the scroll-to-top link. Defaults to "Back to top". */
  topLabel?: string;
  /** When true, hides the bottom bar (legal + builtWith + back-to-top). */
  hideBottomBar?: boolean;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/FooterEditorial.tsx";

/* -------------------------------------------------------------------------- */
/*  FooterEditorial                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Editorial footer: large typographic wordmark + sitemap + tagline + legal.
 *
 * Light-theme default: the studio's "one colour at the bottom" pattern is
 * the oversized display wordmark in `--color-text`, a hairline bottom rule,
 * and a small-caps nav. Pass `columns` for labeled column groups, or `links`
 * for a flat sitemap row.
 */
export function FooterEditorial({
  wordmark,
  tagline,
  links = [],
  columns,
  legal,
  builtWith,
  topHref = "#top",
  topLabel = "Back to top",
  hideBottomBar = false,
  className,
  dataSource,
}: FooterEditorialProps) {
  const hasColumns = !!columns && columns.length > 0;
  return (
    <footer
      data-component="FooterEditorial"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-bg,color-text,color-text-muted,color-text-subtle,color-border,color-accent,font-serif,ease-out"
      className={cn("relative w-full bg-[var(--color-bg)]", className)}
      style={{
        paddingTop: "clamp(80px,12vh,128px)",
        paddingBottom: "clamp(40px,6vh,64px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        {/* Row 1 - oversized wordmark. overflow-x protects long wordmarks
            from horizontal page-scroll, but we MUST keep overflow-y visible
            so descenders (y, p, q) on the last line aren't clipped. The
            h2 gets explicit padding-bottom to reserve descender space. */}
        <div style={{ overflowX: "hidden", overflowY: "visible" }}>
          <h2
            data-component="FooterWordmark"
            data-source={dataSource ?? DATA_SOURCE_DEFAULT}
            className="font-serif font-medium leading-[1.0] tracking-[-0.03em] text-[var(--color-text)]"
            style={{
              fontSize: "clamp(72px, 16vw, 240px)",
              paddingBottom: "0.22em",
            }}
          >
            {wordmark}
          </h2>
        </div>

        {/* Row 2 - nav + tagline */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[var(--color-border)] pt-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {hasColumns ? (
            <nav
              aria-label="Footer"
              data-component="FooterColumns"
              data-source={dataSource ?? DATA_SOURCE_DEFAULT}
              className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
            >
              {columns!.map((col) => (
                <div key={col.label} className="flex flex-col gap-4">
                  <span className="font-sans text-[16px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
                    {col.label}
                  </span>
                  <ul className="flex flex-col gap-3">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="inline-block font-sans text-[16px] font-medium text-[var(--color-text)] transition-colors duration-150 hover:text-[var(--color-accent)]"
                          style={{
                            transitionTimingFunction:
                              "cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          ) : (
            links.length > 0 && (
              <nav
                aria-label="Footer"
                data-component="FooterSitemap"
                data-source={dataSource ?? DATA_SOURCE_DEFAULT}
                className="flex flex-wrap items-center gap-x-8 gap-y-3"
              >
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-block font-sans text-[16px] font-medium uppercase tracking-[0.062em] text-[var(--color-text)] transition-colors duration-150 hover:text-[var(--color-accent)]"
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )
          )}

          {tagline && (
            <p
              className="max-w-[520px] font-sans text-[16px] leading-[1.5] text-[var(--color-text-muted)] lg:justify-self-end lg:text-right"
            >
              {tagline}
            </p>
          )}
        </div>

        {/* Row 3 - legal + built-with (hidden when hideBottomBar=true) */}
        {!hideBottomBar && (
          <div
            className="mt-10 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 font-sans text-[16px] text-[var(--color-text-subtle)] lg:flex-row lg:items-center lg:justify-between lg:gap-8"
          >
            {legal && <p>{legal}</p>}

            <div className="flex items-center gap-5">
              {builtWith && <span>{builtWith}</span>}
              <TextLink
                href={topHref}
                tone="subtle"
                className="whitespace-nowrap font-sans text-[16px] uppercase tracking-[0.062em]"
                aria-label={topLabel}
              >
                <span>{topLabel}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M6 10V2M6 2L2.5 5.5M6 2L9.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </TextLink>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
