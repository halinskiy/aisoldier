"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Size = "md" | "lg";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  /** Field name for native form submission (hidden input). */
  name?: string;
  /** id / htmlFor target. Auto-generated if not passed. */
  id?: string;
  /** Label above the trigger. */
  label?: string;
  /** Helper text below the trigger. */
  helperText?: string;
  /** Error text. Overrides helperText styling. */
  error?: string;
  /** Options — accepts strings (becomes `{value: s, label: s}`) or full `SelectOption`. */
  options: Array<string | SelectOption>;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Default value (uncontrolled). */
  defaultValue?: string;
  /** Called on selection. */
  onChange?: (value: string) => void;
  /** Submits empty if unset when required. */
  required?: boolean;
  /** Disabled trigger. */
  disabled?: boolean;
  /** Size — mirrors Input sizing. */
  selectSize?: Size;
  /** Inspector `data-source` override. */
  dataSource?: string;
  className?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/ui/Select.tsx";

const sizes: Record<Size, string> = {
  md: "h-11",
  lg: "h-12",
};

/* -------------------------------------------------------------------------- */
/*  Select — headless listbox combobox                                         */
/* -------------------------------------------------------------------------- */

/**
 * Headless single-select combobox. Sibling of `Input` in feel, with custom
 * option list to avoid native dropdown chrome (macOS aqua popover, etc.).
 *
 * Accessibility: trigger is `role="combobox"`, listbox is `role="listbox"`,
 * options are `role="option"`. Arrow keys cycle, Enter/Space selects, Escape
 * closes, Tab closes without selecting. Outside click closes.
 *
 * Native form integration via a hidden `<input type="hidden" name={name}>`
 * so the Select participates in plain `<form>` submission with no JS glue.
 *
 * Visual: 8px radius (`--radius-button`), `--color-border` default, accent
 * focus ring at 20% alpha, matches the Input/Textarea voice.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    name,
    id,
    label,
    helperText,
    error,
    options,
    placeholder = "Choose one",
    value: valueProp,
    defaultValue,
    onChange,
    required,
    disabled,
    selectSize = "md",
    dataSource,
    className,
  },
  triggerRef,
) {
  const reactId = useId();
  const triggerId = id ?? `sel-${reactId}`;
  const listboxId = `${triggerId}-listbox`;
  const helperId = `${triggerId}-helper`;

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );

  // Controlled / uncontrolled
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? "");
  const value = isControlled ? (valueProp as string) : internal;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const idx = normalized.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedLabel =
    normalized.find((o) => o.value === value)?.label ?? "";

  const commit = useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
      setOpen(false);
    },
    [isControlled, onChange],
  );

  // Outside click closes
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Scroll the active option into view when it changes
  useEffect(() => {
    if (!open) return;
    const el = listboxRef.current?.querySelector<HTMLLIElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => {
        const idx = normalized.findIndex((o) => o.value === value);
        return idx >= 0 ? idx : 0;
      });
    }
  };

  const onListboxKey = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, normalized.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(normalized.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(normalized[activeIndex]?.value ?? "");
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const hasError = Boolean(error);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative flex flex-col gap-1.5", className)}
      data-component="Select"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-accent,radius-button,ease-out,color-bg,color-surface"
    >
      {label && (
        <label
          htmlFor={triggerId}
          className="font-sans font-medium text-[var(--color-text)]"
          style={{ fontSize: "14px" }}
        >
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-[var(--color-accent)]">
              *
            </span>
          )}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={helperText || error ? helperId : undefined}
        aria-invalid={hasError || undefined}
        aria-required={required}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className={cn(
          "inline-flex w-full items-center justify-between gap-3 rounded-[8px] border bg-[var(--color-bg)] px-4 text-left font-sans text-[var(--color-text)] transition-colors duration-150",
          "focus:outline-none focus:ring-[3px]",
          hasError
            ? "border-[var(--color-accent)] focus:border-[var(--color-accent)] focus:ring-[rgba(47,27,78,0.2)]"
            : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[rgba(47,27,78,0.2)]",
          disabled && "cursor-not-allowed opacity-60",
          sizes[selectSize],
        )}
        style={{
          fontSize: "16px",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span
          className={cn(
            value
              ? "text-[var(--color-text)]"
              : "text-[var(--color-text-subtle)]",
          )}
        >
          {selectedLabel || placeholder}
        </span>
        <svg
          aria-hidden
          width="12"
          height="12"
          viewBox="0 0 14 14"
          className="shrink-0 text-[var(--color-text-muted)] transition-transform duration-200"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <path
            d="M3 5l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Listbox */}
      {open && (
        <ul
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          aria-labelledby={triggerId}
          tabIndex={-1}
          onKeyDown={onListboxKey}
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-y-auto rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)] py-1 shadow-[0_12px_32px_-8px_rgba(30,20,50,0.18)] focus:outline-none"
          style={{
            top: "100%",
          }}
        >
          <ListboxAutoFocus listRef={listboxRef} open={open} />
          {normalized.map((o, i) => {
            const selected = o.value === value;
            const active = i === activeIndex;
            return (
              <li
                key={o.value}
                data-index={i}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(o.value);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 px-4 py-2 font-sans text-[var(--color-text)] transition-colors duration-100",
                  active && "bg-[var(--color-accent-subtle)]",
                )}
                style={{
                  fontSize: "16px",
                }}
              >
                <span>{o.label}</span>
                {selected && (
                  <svg
                    aria-hidden
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    className="text-[var(--color-accent)]"
                  >
                    <path
                      d="M3 7.5l3 3 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Helper / error text */}
      {(helperText || error) && (
        <p
          id={helperId}
          className={cn(
            "font-sans",
            hasError
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-text-muted)]",
          )}
          style={{ fontSize: "14px", lineHeight: 1.5 }}
        >
          {error ?? helperText}
        </p>
      )}

      {/* Hidden input for native form submission */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        aria-hidden
      />
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Small utility: focus the listbox when it opens.                            */
/*  Separate component so useEffect runs only while the listbox is mounted.    */
/* -------------------------------------------------------------------------- */

function ListboxAutoFocus({
  listRef,
  open,
}: {
  listRef: React.RefObject<HTMLUListElement | null>;
  open: boolean;
}) {
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [listRef, open]);
  return null;
}
