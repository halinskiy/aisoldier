"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

/**
 * DocFooter -- quiet, single-line footer for documentation pages.
 *
 * Unlike `FooterEditorial`, which oversizes the wordmark for landing
 * heroes, this footer reads as a system credit: a small wordmark on
 * the left, an optional links row, an optional legal line on the
 * right. No motion, no decoration, no oversized type.
 *
 * Designed for `/system`, `/orchestras` and any future documentation
 * routes where the page itself is the content. Stays inside the
 * neutral palette -- no accent.
 */

export type DocFooterLink = { label: string; href: string };

export type DocFooterProps = {
  wordmark: string;
  /** Optional caption beside the wordmark, eg. version tag. */
  caption?: string;
  /** Optional sitemap row, rendered as small-caps text links. */
  links?: DocFooterLink[];
  /** Optional fineprint, eg. copyright line. */
  legal?: string;
  /** Optional "built with" line, eg. tech stack credit. */
  builtWith?: string;
  /** Optional ReactNode rendered on the right edge (eg. last-updated
   *  date or build hash). Renders below the legal line on mobile. */
  meta?: ReactNode;
  /** Optional click handler for sitemap links. Receives the link's
   *  href and the event. Use it to call `preventDefault()` and scroll
   *  to in-page anchors without breaking the HashRouter route. */
  onLinkClick?: (href: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  dataSource?: string;
};

export function DocFooter({
  wordmark,
  caption,
  links,
  legal,
  builtWith,
  meta,
  onLinkClick,
  className,
  dataSource = "ui-kit/components/system/DocFooter.tsx",
}: DocFooterProps) {
  return (
    <footer
      data-component="DocFooter"
      data-source={dataSource}
      data-tokens="color-border,color-text,color-text-muted,color-text-subtle,font-serif,font-sans"
      className={cn(
        "w-full border-t border-[var(--color-border)] bg-[var(--color-bg)]",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-8 md:py-12 lg:px-10">
        <div className="flex flex-col gap-1">
          <span
            className="font-serif font-medium leading-none text-[var(--color-text)]"
            style={{ fontSize: "22px", letterSpacing: "-0.01em" }}
          >
            {wordmark}
          </span>
          {caption ? (
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
              {caption}
            </span>
          ) : null}
        </div>

        {links && links.length > 0 ? (
          <nav aria-label="Footer links" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={onLinkClick ? (e) => onLinkClick(l.href, e) : undefined}
                className="font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                style={{ transitionDuration: "150ms" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="flex flex-col items-start gap-1 md:items-end">
          {legal ? (
            <span className="font-sans text-[12px] text-[var(--color-text-subtle)]">{legal}</span>
          ) : null}
          {builtWith ? (
            <span className="font-sans text-[12px] text-[var(--color-text-subtle)]">{builtWith}</span>
          ) : null}
          {meta}
        </div>
      </div>
    </footer>
  );
}
