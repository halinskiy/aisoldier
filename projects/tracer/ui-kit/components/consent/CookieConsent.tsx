"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

import { cn } from "../../lib/cn";
import { EASE_OUT } from "../../lib/motion";

export type CookieConsentProps = {
  /** Render the card. The host owns this flag (derived from stored consent). */
  open: boolean;
  /** User granted analytics. Host persists the choice + loads analytics. */
  onAccept: () => void;
  /** User declined. Host persists the choice. No analytics. */
  onDecline: () => void;
  /** Optional privacy-policy URL. Renders a quiet text link when provided. */
  policyHref?: string;
  /** Optional eyebrow override. ASCII only. */
  eyebrow?: string;
  /** Optional title override. ASCII only. */
  title?: string;
  /** Optional body override. ASCII only. */
  body?: ReactNode;
  /** Accept button label. ASCII only. Default "Accept". */
  acceptLabel?: string;
  /** Decline button label. ASCII only. Default "Decline". */
  declineLabel?: string;
  /** Privacy link label. ASCII only. Default "Privacy". */
  policyLabel?: string;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/consent/CookieConsent.tsx";

/**
 * CookieConsent - presentational GDPR consent card.
 *
 * Pure and props-driven. It owns NO storage and NO analytics logic; the host
 * app passes `open` (derived from its own persisted consent state) and the
 * `onAccept` / `onDecline` callbacks. This keeps the component reusable across
 * every Aisoldier project regardless of how that project persists consent.
 *
 * Visual contract:
 *   - Fixed card, bottom-left, escapes ancestor overflow via a body portal so
 *     it works inside the studio-export Desktop route where #root is
 *     `overflow: hidden` and zoomed at large breakpoints.
 *   - MONOCHROME. No `--color-accent` anywhere in the chrome. It must read
 *     identically on the dark Desktop and the forced-light monochrome docs.
 *     All colour comes from the neutral token scale (`--color-bg`,
 *     `--color-surface`, `--color-border`, `--color-text*`), so it auto-themes
 *     wherever it mounts.
 *   - `--radius-window` (12px) surface, 1px `--color-border`, fade + 16px rise
 *     entry on `cubic-bezier(0.16,1,0.3,1)`. No bounce. Respects
 *     `prefers-reduced-motion` (instant, no transform).
 *
 * Accessibility:
 *   - `role="dialog"` + `aria-modal="false"` (it is a persistent corner card,
 *     not a blocking modal, the rest of the site stays usable).
 *   - Labelled by its own title + described by its body.
 *   - The card receives focus on mount so keyboard and screen-reader users
 *     land on it.
 *   - Escape does NOT silently dismiss. A choice must be made; Esc is a no-op
 *     so consent is never implicitly granted or denied.
 *
 * STRICT ASCII: all default copy uses plain hyphen and straight apostrophe
 * only. No em-dash, en-dash, bullet, middle dot, curly quotes.
 */
export function CookieConsent({
  open,
  onAccept,
  onDecline,
  policyHref,
  eyebrow = "Cookies",
  title = "Help improve this site",
  body,
  acceptLabel = "Accept",
  declineLabel = "Decline",
  policyLabel = "Privacy",
  className,
  dataSource,
}: CookieConsentProps) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const labelId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Move focus onto the card when it appears so keyboard / screen-reader
  // users are taken to the choice. Escape is intentionally swallowed: a
  // consent decision must be explicit, never implied by dismissal.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      cardRef.current?.focus();
    }, 0);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        // no-op: force an explicit choice
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  if (!mounted) return null;

  const defaultBody =
    "We use Google Analytics and Microsoft Clarity to understand how this " +
    "site is used so we can make it better. Nothing loads until you choose. " +
    "Decline and analytics stay off, no questions asked.";

  const initial = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, y: 16 };
  const animate = prefersReduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };
  const exit = prefersReduced
    ? { opacity: 0 }
    : { opacity: 0, y: 16 };

  const card = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={cardRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={labelId}
          aria-describedby={descId}
          tabIndex={-1}
          data-component="CookieConsent"
          data-source={dataSource ?? DATA_SOURCE_DEFAULT}
          data-tokens="color-bg,color-surface,color-border,color-border-strong,color-text,color-text-muted,radius-window,radius-button,ease-out"
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{
            duration: prefersReduced ? 0.2 : 0.4,
            ease: [...EASE_OUT],
          }}
          className={cn(
            "fixed bottom-4 left-4 z-[2147483000] w-[calc(100vw-2rem)] max-w-[380px]",
            "flex flex-col gap-4 p-5",
            "rounded-[12px] border border-[var(--color-border)]",
            "bg-[var(--color-bg)] text-[var(--color-text)]",
            "shadow-[0_8px_30px_rgba(0,0,0,0.10)]",
            "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
            className,
          )}
        >
          <div className="flex flex-col gap-2">
            <span
              className={cn(
                "inline-flex w-fit items-center font-sans text-[12px] font-semibold uppercase leading-[1.4]",
                "tracking-[0.062em] text-[var(--color-text-muted)]",
              )}
            >
              {eyebrow}
            </span>
            <h2
              id={labelId}
              className="font-serif text-[20px] font-semibold leading-[1.25] text-[var(--color-text)]"
            >
              {title}
            </h2>
          </div>

          <p
            id={descId}
            className="font-sans text-[16px] leading-[1.6] text-[var(--color-text-muted)]"
          >
            {body ?? defaultBody}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onAccept}
              data-component="CookieConsentAccept"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-[8px] px-5",
                "font-sans text-[16px] font-medium",
                "bg-[var(--color-text)] text-[var(--color-bg)]",
                "border border-transparent",
                "transition-[opacity,background-color,border-color] duration-150",
                "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "hover:opacity-90 active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
              )}
            >
              {acceptLabel}
            </button>
            <button
              type="button"
              onClick={onDecline}
              data-component="CookieConsentDecline"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-[8px] px-5",
                "font-sans text-[16px] font-medium",
                "bg-transparent text-[var(--color-text)]",
                "border border-[var(--color-border-strong)]",
                "transition-[background-color,border-color] duration-150",
                "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "hover:bg-[var(--color-surface)] hover:border-[var(--color-text)] active:scale-[0.985]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
              )}
            >
              {declineLabel}
            </button>
            {policyHref && (
              <a
                href={policyHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "ml-auto font-sans text-[14px] font-medium",
                  "text-[var(--color-text-subtle)] underline-offset-4",
                  "transition-colors duration-150",
                  "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                  "hover:text-[var(--color-text)] hover:underline",
                  "focus-visible:outline-none focus-visible:underline focus-visible:text-[var(--color-text)]",
                )}
              >
                {policyLabel}
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(card, document.body);
}
