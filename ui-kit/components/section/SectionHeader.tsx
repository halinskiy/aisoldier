import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { EyebrowLabel } from "./EyebrowLabel";

type CtaObject = { label: string; href: string };

export type SectionHeaderProps = {
  eyebrow: string | ReactNode;
  headline: string | ReactNode;
  body?: string | ReactNode;
  /** Pass `{label, href}` for the default primary Button, or any ReactNode to render a custom CTA. */
  cta?: CtaObject | ReactNode;
  /**
   * `split` (default) — eyebrow + headline on the left, body + CTA on the right,
   *   using the project canonical `501fr 200fr 676fr` grid.
   * `stacked` — single left-aligned column, max-width 720. Used by FAQ section where
   *   there's no right column.
   */
  align?: "split" | "stacked";
  /**
   * Override the heading element. Default `h2`.
   * Use `h1` when SectionHeader is the page-level title (e.g. index pages
   * like /case-studies, /services, /blog that have no separate hero h1).
   */
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/SectionHeader.tsx";

function isCtaObject(value: unknown): value is CtaObject {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CtaObject).label === "string" &&
    typeof (value as CtaObject).href === "string"
  );
}

/**
 * Section header — eyebrow + headline [+ body + CTA on the right in split mode].
 *
 * This is the most-reused layout primitive in the kit. The "split" variant
 * reuses the project canonical `501fr 200fr 676fr` grid so gutters line up
 * across every 2-column section (Hero, About, Approach, Services, Case Studies,
 * Testimonials, Process).
 *
 * Typography follows DESIGN_SYSTEM.md exactly:
 *   H3 = Plex Serif Regular 400, var(--text-h3), var(--lh-h3), var(--ls-h3)
 *
 * If you pass a `headline` as a plain string, it renders inside a single `<h2>`.
 * Pass a ReactNode (e.g. multiple spans) if you need a forced line break.
 */
export function SectionHeader({
  eyebrow,
  headline,
  body,
  cta,
  align = "split",
  headingLevel = "h2",
  className,
  dataSource,
}: SectionHeaderProps) {
  const eyebrowEl =
    typeof eyebrow === "string" ? (
      <EyebrowLabel>{eyebrow}</EyebrowLabel>
    ) : (
      eyebrow
    );

  const Heading = headingLevel;

  const headlineEl = (
    <Heading
      data-motion="blur-reveal"
      className="font-serif font-normal text-[var(--color-text)]"
      style={{
        fontSize: "var(--text-h3)",
        lineHeight: "var(--lh-h3)",
        letterSpacing: "var(--ls-h3)",
      }}
    >
      {headline}
    </Heading>
  );

  const ctaEl = cta
    ? isCtaObject(cta)
      ? (
          <Button href={cta.href} variant="primary" size="md">
            {cta.label}
          </Button>
        )
      : cta
    : null;

  if (align === "stacked") {
    return (
      <header
        data-component="SectionHeader"
        data-source={dataSource ?? DATA_SOURCE_DEFAULT}
        data-tokens="text-h3,lh-h3,ls-h3,font-serif,color-text,color-text-muted"
        className={cn("flex max-w-[720px] flex-col gap-5", className)}
      >
        <span data-motion="blur-reveal">{eyebrowEl}</span>
        {headlineEl}
        {body && (
          <p
            data-motion="blur-reveal"
            className="text-[16px] leading-[1.5] text-[var(--color-text-muted)]"
          >
            {body}
          </p>
        )}
        {ctaEl && <div>{ctaEl}</div>}
      </header>
    );
  }

  // split
  return (
    <header
      data-component="SectionHeader"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="text-h3,lh-h3,ls-h3,font-serif,color-text,color-text-muted"
      className={cn(
        "grid grid-cols-1 items-start gap-y-8 lg:grid-cols-[501fr_200fr_676fr] lg:gap-y-0",
        className,
      )}
    >
      <div className="flex max-w-[501px] flex-col gap-5">
        <span data-motion="blur-reveal">{eyebrowEl}</span>
        {headlineEl}
      </div>
      <div aria-hidden className="hidden lg:block" />
      <div className="flex max-w-[676px] flex-col gap-6">
        {body && (
          <p
            data-motion="blur-reveal"
            className="text-[16px] leading-[1.5] text-[var(--color-text-muted)]"
          >
            {body}
          </p>
        )}
        {ctaEl && <div>{ctaEl}</div>}
      </div>
    </header>
  );
}
