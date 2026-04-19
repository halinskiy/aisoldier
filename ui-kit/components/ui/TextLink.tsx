import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Tone = "default" | "subtle" | "accent";
type As = "a" | "span" | "button";

type BaseProps = {
  children: ReactNode;
  /** Visual tone — all three use the doctrine easing on hover. */
  tone?: Tone;
  /** External link — adds target="_blank", rel="noopener noreferrer", optional trailing arrow. */
  external?: boolean;
  /** Show a small trailing arrow glyph. Automatically enabled for `external`. */
  showArrow?: boolean;
  /** Render as a non-anchor element (e.g. when wrapping a router Link). */
  as?: As;
  className?: string;
  dataSource?: string;
};

type AnchorProps = BaseProps & {
  as?: "a";
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href">;

type SpanProps = BaseProps & {
  as: "span";
  href?: never;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, keyof BaseProps>;

type ButtonProps = BaseProps & {
  as: "button";
  href?: never;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

export type TextLinkProps = AnchorProps | SpanProps | ButtonProps;

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/TextLink.tsx";

/* -------------------------------------------------------------------------- */
/*  Styles                                                                     */
/* -------------------------------------------------------------------------- */

const base =
  "inline-flex items-center gap-1 font-sans font-medium " +
  "transition-[color,text-decoration-color] duration-150 " +
  "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[var(--color-bg)] rounded-[2px]";

const tones: Record<Tone, string> = {
  // Inherits current text color, underline appears on hover only.
  default:
    "text-[var(--color-text)] underline decoration-transparent underline-offset-[3px] hover:decoration-current",
  // Muted until hover, then normal text color. No underline by default.
  subtle:
    "text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline decoration-transparent underline-offset-[3px] hover:decoration-current",
  // Accent color always + underline on hover.
  accent:
    "text-[var(--color-accent)] underline decoration-transparent underline-offset-[3px] hover:decoration-current",
};

/* -------------------------------------------------------------------------- */
/*  TextLink                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Inline text link primitive.
 *
 * Not a button — use `Button` for CTAs. This primitive is used when the
 * element is a link in running text, a "Back to top" utility, an RU/EN
 * toggle segment, or when wrapping a router Link (use `as="span"` so the
 * router component provides the anchor).
 *
 * Tones:
 *   - `default`  — inherits `--color-text`, underline shows on hover.
 *   - `subtle`   — `--color-text-muted` until hover, then resolves to `--color-text`.
 *   - `accent`   — `--color-accent`, underline on hover.
 *
 * External links auto-apply `target="_blank" rel="noopener noreferrer"` and
 * show a trailing arrow glyph.
 */
export function TextLink(props: TextLinkProps) {
  const {
    children,
    tone = "default",
    external = false,
    showArrow,
    as = "a",
    className,
    dataSource,
    ...rest
  } = props as BaseProps & Record<string, unknown>;

  const cls = cn(base, tones[tone], className);
  const shouldShowArrow = showArrow ?? external;

  const dataProps = {
    "data-component": "TextLink",
    "data-source": dataSource ?? DATA_SOURCE_DEFAULT,
    "data-tokens": "color-text,color-text-muted,color-accent",
  } as const;

  const content = (
    <>
      <span>{children}</span>
      {shouldShowArrow && (
        <svg
          aria-hidden
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className="-translate-y-[1px]"
        >
          <path
            d="M1.5 6.5L6.5 1.5M6.5 1.5H2.5M6.5 1.5V5.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  if (as === "span") {
    return (
      <span className={cls} {...(rest as React.HTMLAttributes<HTMLSpanElement>)} {...dataProps}>
        {content}
      </span>
    );
  }

  if (as === "button") {
    const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        type={type ?? "button"}
        className={cls}
        {...buttonRest}
        {...dataProps}
      >
        {content}
      </button>
    );
  }

  const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string;
  };
  const externalAttrs = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a
      href={anchorRest.href}
      className={cls}
      {...externalAttrs}
      {...anchorRest}
      {...dataProps}
    >
      {content}
    </a>
  );
}
