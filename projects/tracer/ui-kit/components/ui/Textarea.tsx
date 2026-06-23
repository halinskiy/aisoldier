"use client";

import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type TextareaProps = {
  label?: string;
  helperText?: string;
  error?: string;
  dataSource?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/Textarea.tsx";

/* -------------------------------------------------------------------------- */
/*  Textarea                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Multi-line text input, sibling of `Input`.
 *
 * Shares the same visual language: 8px radius, default `--color-border`,
 * accent focus ring. Default `rows={4}` which resolves to roughly 120px of
 * content height at doctrine line-height 1.625.
 *
 * Keeps text at 16px (doctrine minimum) to prevent Safari iOS zoom.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      helperText,
      error,
      className,
      id,
      rows = 4,
      dataSource,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const textareaId = id ?? autoId;
    const describedBy = error
      ? `${textareaId}-error`
      : helperText
        ? `${textareaId}-helper`
        : undefined;

    return (
      <div
        data-component="Textarea"
        data-source={dataSource ?? DATA_SOURCE_DEFAULT}
        data-tokens="color-text,color-text-muted,color-text-faint,color-border,color-accent,radius-button,ease-out"
        className={cn("flex w-full flex-col gap-2", className)}
      >
        {label && (
          <label
            htmlFor={textareaId}
            className="font-sans text-[14px] font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "group relative flex overflow-hidden rounded-[var(--radius-button)] border bg-[var(--color-bg)]",
            "transition-[border-color,box-shadow] duration-150",
            "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
            error
              ? "border-[var(--color-accent)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
            "focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]",
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full min-w-0 flex-1 resize-y bg-transparent px-3 py-3 font-sans text-[16px] leading-[1.625] text-[var(--color-text)] outline-none",
              "placeholder:text-[var(--color-text-faint)]",
            )}
            {...rest}
          />
        </div>

        {error ? (
          <p
            id={`${textareaId}-error`}
            className="font-sans text-[14px] font-medium text-[var(--color-accent)]"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${textareaId}-helper`}
            className="font-sans text-[14px] text-[var(--color-text-muted)]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
