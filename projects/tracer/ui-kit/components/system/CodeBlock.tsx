"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../../lib/cn";

/**
 * CodeBlock -- neutral, monochrome code surface for /system documentation.
 *
 * Plex Mono 14px, line-height 1.55, hairline border, radius 8, padded
 * 16px / 20px. Optional 36px toolbar on top with a filename on the left
 * and a Copy button on the right. No syntax highlighting in v1 (mono
 * surfaces stay calm; reaching for token colours would re-introduce
 * accent and break the page's no-accent contract).
 *
 * The Copy button has a fixed min-width so the "Copy" -> "Copied"
 * transition does not produce a layout shift. The button uses
 * `navigator.clipboard.writeText`. If the API is unavailable (older
 * browsers, embedded contexts) it falls back to a hidden textarea +
 * `execCommand("copy")` path.
 */

export type CodeBlockProps = {
  code: string;
  /** Cosmetic label on the toolbar left edge. Pass a file name or a
   *  short caption like "JSX". When omitted the toolbar collapses. */
  filename?: string;
  /** Render without the toolbar entirely (no Copy button). */
  bare?: boolean;
  /** Optional copy-button label override (default "Copy"). */
  copyLabel?: string;
  /** Optional copied-state label override (default "Copied"). */
  copiedLabel?: string;
  /** Optional ReactNode shown above the toolbar (eg. a Pairs-with note).
   *  Stays inside the same bordered shell. */
  preamble?: ReactNode;
  className?: string;
  dataSource?: string;
};

export function CodeBlock({
  code,
  filename,
  bare = false,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  preamble,
  className,
  dataSource = "ui-kit/components/system/CodeBlock.tsx",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const onCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // swallow -- user can still select + copy manually.
    }
  };

  return (
    <div
      data-component="CodeBlock"
      data-source={dataSource}
      data-tokens="color-border,color-surface,color-text,font-mono,radius-button"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-[8px] border",
        // Dark surface keeps code distinct from the documentation chrome
        // and lets the developer's eye land on the snippet immediately.
        // Border + tones are hard-coded to the doctrine dark-theme values
        // so the surface reads the same on light and dark pages alike.
        "border-[#2a2a2a] bg-[#161616] text-[#f4f4f4]",
        className,
      )}
    >
      {preamble ? (
        <div className="border-b border-[#2a2a2a] px-5 py-3 text-[14px] leading-[1.5] text-[rgba(244,244,244,0.7)]">
          {preamble}
        </div>
      ) : null}

      {!bare ? (
        <div className="flex h-10 items-center justify-between border-b border-[#2a2a2a] bg-[#1e1e1e] px-3 pl-5">
          <span
            className="truncate text-[12px] font-semibold uppercase tracking-[0.062em] text-[rgba(244,244,244,0.5)]"
          >
            {filename ?? "snippet"}
          </span>
          <button
            type="button"
            onClick={onCopy}
            aria-live="polite"
            className={cn(
              // Matches Button variant="secondary", scaled down: rounded-full pill,
              // transparent fill, hairline border that solidifies on hover. Sized
              // to sit comfortably inside the 40px toolbar.
              "inline-flex h-8 min-w-[104px] items-center justify-center gap-2 rounded-full border bg-transparent px-4 text-[13px] font-medium transition-colors",
              "border-[rgba(244,244,244,0.4)] text-[#f4f4f4] hover:border-[#f4f4f4] hover:bg-[rgba(244,244,244,0.1)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4f4f4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]",
            )}
            style={{ transitionDuration: "150ms", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <span aria-hidden className="block h-3.5 w-3.5">
              {copied ? (
                <svg viewBox="0 0 14 14" width="14" height="14">
                  <path d="M3 7.4 L6 10.3 L11 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 14 14" width="14" height="14">
                  <rect x="4" y="4" width="7" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" fill="none" />
                  <rect x="1.5" y="1.5" width="7" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" fill="none" />
                </svg>
              )}
            </span>
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>
        </div>
      ) : null}

      <pre
        className="m-0 overflow-x-auto px-5 py-4 text-[14px] leading-[1.55] text-[#f4f4f4]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
