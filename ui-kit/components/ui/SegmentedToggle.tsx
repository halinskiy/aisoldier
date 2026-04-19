"use client";

import { useRef, type KeyboardEvent } from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SegmentedToggleOption<V extends string = string> = {
  value: V;
  label: string;
};

export type SegmentedToggleProps<V extends string = string> = {
  options: SegmentedToggleOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Compact sm or standard md. Default md. */
  size?: "sm" | "md";
  /** Optional group label for screen readers. */
  ariaLabel?: string;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/SegmentedToggle.tsx";

const sizes: Record<"sm" | "md", { text: string; pad: string; height: string }> =
  {
    sm: {
      text: "text-[12px]",
      pad: "px-1",
      height: "h-6",
    },
    md: {
      text: "text-[12px]",
      pad: "px-1",
      height: "h-7",
    },
  };

/* -------------------------------------------------------------------------- */
/*  SegmentedToggle                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Minimal typographic segmented control. 2-3 states.
 *
 * Deliberately without pill background or group border — matches the
 * editorial restraint used on `/system`. Active option is weight 700 in
 * `--color-text`; inactive options sit at weight 500 in `--color-text-subtle`.
 * A faint slash divider sits between options.
 *
 * Keyboard: Arrow Left / Arrow Right cycles between options.
 */
export function SegmentedToggle<V extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  ariaLabel,
  className,
  dataSource,
}: SegmentedToggleProps<V>) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const s = sizes[size];

  const focusIndex = (idx: number) => {
    const next = (idx + options.length) % options.length;
    buttonsRef.current[next]?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % options.length;
      focusIndex(next);
      onChange(options[next].value);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (idx - 1 + options.length) % options.length;
      focusIndex(next);
      onChange(options[next].value);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-component="SegmentedToggle"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-text,color-text-subtle,color-text-faint"
      className={cn("inline-flex items-center gap-1", className)}
    >
      {options.map((opt, idx) => {
        const active = opt.value === value;
        return (
          <span key={opt.value} className="inline-flex items-center gap-1">
            <button
              type="button"
              ref={(el) => {
                buttonsRef.current[idx] = el;
              }}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => handleKey(e, idx)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-w-[28px] items-center justify-center uppercase tracking-[0.062em] transition-colors duration-150",
                "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-[2px]",
                s.text,
                s.pad,
                s.height,
                active
                  ? "font-bold text-[var(--color-text)]"
                  : "font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]",
              )}
            >
              {opt.label}
            </button>
            {idx < options.length - 1 && (
              <span
                aria-hidden
                className="font-sans text-[12px] font-medium text-[var(--color-text-faint)]"
              >
                /
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
