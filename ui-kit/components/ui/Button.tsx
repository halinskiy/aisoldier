"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "md" | "lg";

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /**
   * Pass `href` to render as an anchor instead of a button (for link CTAs
   * that are commonly styled as buttons in landing pages).
   */
  href?: string;
  /** Primary-variant trailing accent dot, the Figma pattern. Defaults to true for primary. */
  trailingDot?: boolean;
  /** Optional icon component rendered to the right of the label. */
  trailingIcon?: ReactNode;
  /** Magnetic hover — the button attracts the pointer within its bounding box. Opt-in, off by default. */
  magnetic?: boolean;
  /** Magnetic strength — how far the button drifts toward the cursor (px). Default 12. */
  magneticStrength?: number;
  dataSource?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/Button.tsx";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium " +
  "transition-[background-color,border-color,color,transform] duration-150 " +
  "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[var(--color-bg)]";

const variants: Record<Variant, string> = {
  // Dark pill on light bg, light pill on dark bg — inverts automatically
  // via `var(--color-text)` / `var(--color-bg)` tokens. Was hardcoded
  // `bg-[#212121] text-white` before session 13 — fixed during the
  // Section 11 dark-theme audit.
  primary:
    "bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 rounded-full",
  secondary:
    "border border-[var(--color-border-strong)] text-[var(--color-text)] " +
    "bg-transparent hover:bg-[var(--color-surface)] hover:border-[var(--color-text)] rounded-full",
  ghost:
    "text-[var(--color-text)] bg-transparent hover:bg-[var(--color-surface)] rounded-[8px]",
  // Accent variant — the project accent colour as the fill. Added in
  // session 13 for Section 11 submit button. Works on any theme scope
  // because the accent is constant across light and dark. Text colour is
  // near-black (not white) because #ffffff on #FF512A is only 3.24:1
  // contrast (AA fail). Near-black #1e1e1e on orange is ~7:1 (AAA).
  accent:
    "bg-[var(--color-accent)] text-[#1e1e1e] hover:bg-[var(--color-accent-hover)] rounded-full",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[14px]", // 44px tall matches Figma
  lg: "h-12 px-6 text-[15px]",
};

/**
 * Shared CTA primitive.
 *
 * Variants: `primary` / `secondary` / `ghost` / `accent`.
 * Sizes: `md` (44px Figma height) / `lg` (48px).
 * Renders as `<a>` when `href` is passed, otherwise `<button>`.
 *
 * Optional `magnetic` prop enables a pointer-tracking translate effect on
 * hover — the button drifts toward the cursor within a spring-damped range.
 * Respects `prefers-reduced-motion` (disabled entirely). Added in session 15.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  trailingDot,
  trailingIcon,
  magnetic = false,
  magneticStrength = 12,
  className,
  dataSource,
  ...rest
}: ButtonProps) {
  const showDot = trailingDot ?? variant === "primary";
  const cls = cn(base, variants[variant], sizes[size], className);

  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!magnetic || prefersReduced) return;
    return () => {
      x.set(0);
      y.set(0);
    };
  }, [magnetic, prefersReduced, x, y]);

  const handleMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (!magnetic || prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = ((e.clientX - cx) / (r.width / 2)) * magneticStrength;
    const dy = ((e.clientY - cy) / (r.height / 2)) * magneticStrength;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    if (!magnetic || prefersReduced) return;
    x.set(0);
    y.set(0);
  };

  const content = (
    <>
      <span>{children}</span>
      {trailingIcon}
      {showDot && (
        <span
          aria-hidden
          className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]"
        />
      )}
    </>
  );

  const dataProps = {
    "data-component": "Button",
    "data-source": dataSource ?? DATA_SOURCE_DEFAULT,
    "data-tokens": "accent,color-text,color-border-strong,radius-pill",
  } as const;

  // Wrap in a motion element ONLY when magnetic is on — keeps the static
  // case zero-cost and keeps the SSR output identical to pre-motion.
  if (magnetic && !prefersReduced) {
    if (href) {
      return (
        <motion.a
          ref={ref as never}
          href={href}
          className={cls}
          style={{ x: sx, y: sy }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          {...dataProps}
        >
          {content}
        </motion.a>
      );
    }
    const { type: restType = "button", ...restNoType } = rest;
    return (
      <motion.button
        ref={ref as never}
        type={restType as "button" | "submit" | "reset"}
        className={cls}
        style={{ x: sx, y: sy }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        disabled={restNoType.disabled}
        {...dataProps}
      >
        {content}
      </motion.button>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} {...dataProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={cls} {...dataProps} {...rest}>
      {content}
    </button>
  );
}
