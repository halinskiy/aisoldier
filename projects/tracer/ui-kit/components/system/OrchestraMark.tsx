"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

/**
 * OrchestraMark -- quiet, typographic "Built by" credit shown in the
 * corner of a doc page hero.
 *
 * Pairs an eyebrow caption ("Built by") with a serif wordmark (defaults
 * to "3mpq orchestra") and a trailing arrow that nudges right on hover.
 * No fill, no border in the resting state -- just text. The whole mark
 * is a link, by default to the project's orchestra page.
 *
 * Designed to be used both inside Aisoldier (where Link is provided
 * by Next.js) and inside 3mpq-studio-export (Vite + react-router). It
 * accepts a `LinkComponent` override; defaults to a plain <a>.
 */

export type OrchestraMarkProps = {
  href?: string;
  eyebrow?: string;
  wordmark?: string;
  /** Optional render prop for the link element -- pass `Link` from
   *  react-router or next/link when client-side navigation is needed.
   *  The component will spread `{ to / href, className, children }`
   *  consistently and let the caller adapt. */
  LinkComponent?: React.ComponentType<{ to?: string; href?: string; className?: string; children?: ReactNode }>;
  className?: string;
  dataSource?: string;
};

export function OrchestraMark({
  href = "/#/orchestras/3mpq",
  eyebrow = "Built by",
  wordmark = "3mpq orchestra",
  LinkComponent,
  className,
  dataSource = "ui-kit/components/system/OrchestraMark.tsx",
}: OrchestraMarkProps) {
  const inner = (
    <span
      data-component="OrchestraMark"
      data-source={dataSource}
      data-tokens="color-text,color-text-subtle,font-serif,font-sans"
      className={cn(
        "group inline-flex items-baseline gap-2 transition-colors",
        className,
      )}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-subtle)] transition-colors group-hover:text-[var(--color-text-muted)]">
        {eyebrow}
      </span>
      <span className="inline-flex items-baseline gap-2 text-[var(--color-text)]">
        <span
          className="font-serif text-[16px] font-medium leading-none tracking-[-0.01em]"
        >
          {wordmark}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          aria-hidden
          className="translate-x-0 self-center transition-transform group-hover:translate-x-[2px]"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", transitionDuration: "180ms" }}
        >
          <path
            d="M3 7h7M7.5 3.5L11 7l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    </span>
  );

  if (LinkComponent) {
    return (
      <LinkComponent to={href} href={href} className="inline-block no-underline">
        {inner}
      </LinkComponent>
    );
  }

  return (
    <a href={href} className="inline-block no-underline">
      {inner}
    </a>
  );
}
