"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Size = "md" | "lg";

export type InputProps = {
  label?: string;
  helperText?: string;
  error?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  inputSize?: Size;
  dataSource?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/Input.tsx";

const sizes: Record<Size, string> = {
  md: "h-11 text-[16px]",
  lg: "h-12 text-[16px]",
};

/* -------------------------------------------------------------------------- */
/*  Input                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Standard text input with label + helper + error states.
 *
 * Visual:
 *   - md = 44px height, lg = 48px.
 *   - 8px radius (`--radius-button`).
 *   - `--color-border` default, `--color-accent` on focus with a 3px
 *     accent ring at 20% alpha.
 *
 * Doctrine: minimum 16px font-size on the input itself so mobile Safari
 * doesn't zoom in. Labels are `body-sm` (14px) but helper + error are 14px
 * weight 500 — the doctrine only enforces ≥16px on body/running text.
 * Form meta copy at 14px is explicitly allowed.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    leftSlot,
    rightSlot,
    inputSize = "md",
    className,
    id,
    dataSource,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div
      data-component="Input"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-text,color-text-muted,color-text-faint,color-border,color-accent,radius-button,ease-out"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="font-sans text-[14px] font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "group relative flex items-center overflow-hidden rounded-[var(--radius-button)] border bg-[var(--color-bg)]",
          "transition-[border-color,box-shadow] duration-150",
          "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          error
            ? "border-[var(--color-accent)]"
            : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
          "focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]",
        )}
      >
        {leftSlot && (
          <span className="flex shrink-0 items-center pl-3 text-[var(--color-text-muted)]">
            {leftSlot}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full min-w-0 flex-1 bg-transparent px-3 font-sans text-[var(--color-text)] outline-none",
            "placeholder:text-[var(--color-text-faint)]",
            sizes[inputSize],
          )}
          {...rest}
        />
        {rightSlot && (
          <span className="flex shrink-0 items-center pr-3 text-[var(--color-text-muted)]">
            {rightSlot}
          </span>
        )}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="font-sans text-[14px] font-medium text-[var(--color-accent)]"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="font-sans text-[14px] text-[var(--color-text-muted)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
