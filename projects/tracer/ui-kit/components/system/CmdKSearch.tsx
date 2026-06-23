"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "../../lib/cn";

/**
 * CmdKSearch -- minimal command-K search dialog over a static list of
 * documentation entries.
 *
 * Bound to Cmd+K (mac) / Ctrl+K (others) and to the lone "/" key when
 * focus is not in an editable element. Opens a centred dialog with a
 * text input and a results list. Matches are filtered client-side by
 * substring against `label` and `keywords`. Closes on Escape, on
 * click-outside, or after a result is chosen.
 *
 * Selecting a result triggers `onSelect(item.id)`. The caller wires
 * that to a scroll-to-anchor or a router push. No backend, no fuzzy.
 *
 * In monochrome the matched substring is rendered weight 600 against
 * weight 400 context. No colour highlight.
 */

export type CmdKItem = {
  id: string;
  /** Human-readable label rendered in the result row. */
  label: string;
  /** Optional category caption rendered to the right. */
  category?: string;
  /** Optional secondary keywords matched alongside the label. */
  keywords?: string[];
};

export type CmdKSearchProps = {
  items: CmdKItem[];
  onSelect: (id: string) => void;
  /** Optional input placeholder. */
  placeholder?: string;
  /** Optional empty-state caption. */
  emptyLabel?: string;
  /** Disable the global Cmd+K binding (the parent will open it
   *  manually via the returned controller). Default false. */
  disableHotkey?: boolean;
  dataSource?: string;
};

export function CmdKSearch({
  items,
  onSelect,
  placeholder = "Search components and tokens",
  emptyLabel = "No matches.",
  disableHotkey = false,
  dataSource = "ui-kit/components/system/CmdKSearch.tsx",
}: CmdKSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (disableHotkey) return;
    const onKey = (e: KeyboardEvent) => {
      const inEditable = isEditable(e.target);
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isSlash = e.key === "/" && !inEditable;
      if (isCmdK || isSlash) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [disableHotkey]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 24);
    return items.filter((it) => {
      const hay = [it.label, ...(it.keywords ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, items]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) {
        onSelect(item.id);
        close();
      }
    }
  };

  if (!open) return null;

  return (
    <div
      data-component="CmdKSearch"
      data-source={dataSource}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-surface"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
    >
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.36)]"
        aria-hidden
        onClick={close}
      />
      <div
        ref={dialogRef}
        className="relative z-[81] flex w-full max-w-[640px] flex-col rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_64px_-24px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="text-[var(--color-text-muted)]">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <path d="M9.2 9.2L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[16px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
          />
          <span className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--color-border-strong)] px-2 py-[2px] text-[11px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
            esc
          </span>
        </div>

        <ul className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-5 py-4 text-[14px] text-[var(--color-text-muted)]">{emptyLabel}</li>
          ) : (
            results.map((it, i) => (
              <li key={it.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onSelect(it.id);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left transition-colors",
                    activeIndex === i ? "bg-[var(--color-surface)]" : "bg-transparent",
                  )}
                  style={{ transitionDuration: "100ms" }}
                >
                  <Match label={it.label} query={query} />
                  {it.category ? (
                    <span className="shrink-0 text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
                      {it.category}
                    </span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3 text-[12px] text-[var(--color-text-subtle)]">
          <span>
            <Kbd>up</Kbd>
            <Kbd>down</Kbd> to move, <Kbd>enter</Kbd> to open
          </span>
          <span>
            <Kbd>cmd</Kbd>+<Kbd>k</Kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}

function Match({ label, query }: { label: string; query: string }) {
  const q = query.trim();
  if (!q) {
    return (
      <span className="text-[15px] text-[var(--color-text)]">{label}</span>
    );
  }
  const lower = label.toLowerCase();
  const start = lower.indexOf(q.toLowerCase());
  if (start === -1) {
    return (
      <span className="text-[15px] text-[var(--color-text)]">{label}</span>
    );
  }
  return (
    <span className="text-[15px] text-[var(--color-text)]">
      {label.slice(0, start)}
      <span className="font-semibold">{label.slice(start, start + q.length)}</span>
      {label.slice(start + q.length)}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-center rounded-[4px] border border-[var(--color-border-strong)] px-1 text-[10px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-muted)]">
      {children}
    </span>
  );
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}
