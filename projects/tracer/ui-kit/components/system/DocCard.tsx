"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

import { CodeBlock } from "./CodeBlock";
import { PropsTable, type PropRow } from "./PropsTable";

/**
 * DocCard -- the canonical component-documentation block on /system.
 *
 * Renders, in fixed order, the four parts every component record carries:
 *   1. Header -- name, status badge, source path, pairs-with line, last
 *      updated date
 *   2. Preview -- live JSX rendered inside a hairline-bordered surface
 *   3. Code -- copyable JSX snippet via CodeBlock
 *   4. Props -- fixed-schema table via PropsTable
 * Plus a quietly bordered Don't / Do paragraph below the table. Variants
 * or extended notes can be passed in `extras` and render last.
 *
 * The card sits in a single column. Heading is serif h4 24px. Preview
 * surface defaults to `--color-surface` (#fafafa) without dot-grid (the
 * page never decorates previews unless the component itself is about
 * the dot-grid).
 */

export type DocCardStatus = "stable" | "beta" | "spec-only";

export type DocCardProps = {
  name: string;
  source: string;
  status?: DocCardStatus;
  /** One-sentence description, sits beneath the source path. */
  description?: string;
  /** Comma-joined inline list rendered as muted small-caps below the
   *  description. Each entry is a plain string (not a link in v1). */
  pairsWith?: string[];
  /** Example real-world usage: "Used in corder hero, booquarium chapter list". */
  usedIn?: string;
  /** ISO date string, eg. "2026-05-14". Rendered with a "Last updated"
   *  caption. Omit if unknown. */
  lastUpdated?: string;
  /** Live preview node -- the actual rendered component. */
  preview: ReactNode;
  /** Code snippet shown verbatim under the preview. */
  code: string;
  /** Toolbar filename for the CodeBlock (eg. "EyebrowLabel.tsx"). */
  codeFilename?: string;
  /** Optional Props table rows. Pass empty array to skip the table. */
  props?: PropRow[];
  /** Short editorial Do paragraph. */
  doNote?: string;
  /** Short editorial Don't paragraph. */
  dontNote?: string;
  /** Anything extra (variants gallery, accessibility notes) rendered at
   *  the bottom inside the same outer shell. */
  extras?: ReactNode;
  /** Used to scroll-spy / anchor link. Defaults to a kebab-cased name. */
  id?: string;
  className?: string;
};

export function DocCard({
  name,
  source,
  status = "stable",
  description,
  pairsWith,
  usedIn,
  lastUpdated,
  preview,
  code,
  codeFilename,
  props,
  doNote,
  dontNote,
  extras,
  id,
  className,
}: DocCardProps) {
  const anchorId = id ?? toKebab(name);

  return (
    <article
      id={anchorId}
      data-component="DocCard"
      data-source="ui-kit/components/system/DocCard.tsx"
      data-tokens="color-border,color-surface,color-text,font-serif,font-sans,font-mono"
      className={cn(
        "flex w-full scroll-mt-32 flex-col gap-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] p-6 md:p-8",
        className,
      )}
    >
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3
            className="font-serif font-medium text-[var(--color-text)]"
            style={{ fontSize: "28px", lineHeight: 1.15, letterSpacing: "-0.01em" }}
          >
            {name}
          </h3>
          <StatusBadge status={status} />
        </div>
        <code
          className="break-all text-[14px] text-[var(--color-text-subtle)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {source}
        </code>
        {description ? (
          <p className="font-sans text-[16px] leading-[1.55] text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
        {(pairsWith && pairsWith.length > 0) || usedIn ? (
          <div className="flex flex-col gap-1 pt-1">
            {pairsWith && pairsWith.length > 0 ? (
              <MetaLine label="Pairs with" value={pairsWith.join(", ")} />
            ) : null}
            {usedIn ? <MetaLine label="Used in" value={usedIn} /> : null}
          </div>
        ) : null}
      </header>

      {/* Preview */}
      <div className="flex min-h-[220px] items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8">
        {preview}
      </div>

      {/* Code */}
      <CodeBlock code={code} filename={codeFilename ?? `${name}.tsx`} />

      {/* Props */}
      {props && props.length > 0 ? <PropsTable rows={props} caption="API" /> : null}

      {/* Don't / Do */}
      {doNote || dontNote ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {doNote ? <DoDontCard tone="do" note={doNote} /> : null}
          {dontNote ? <DoDontCard tone="dont" note={dontNote} /> : null}
        </div>
      ) : null}

      {extras}

      {lastUpdated ? (
        <footer className="border-t border-[var(--color-border)] pt-3 text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
          Last updated {lastUpdated}
        </footer>
      ) : null}
    </article>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-2 text-[14px] text-[var(--color-text-muted)]">
      <span className="text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        {label}
      </span>
      <span>{value}</span>
    </p>
  );
}

function StatusBadge({ status }: { status: DocCardStatus }) {
  const label = status === "stable" ? "Stable" : status === "beta" ? "Beta" : "Spec only";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em]",
        status === "stable" && "border-[var(--color-text)] text-[var(--color-text)]",
        status === "beta" && "border-[var(--color-border-strong)] text-[var(--color-text-muted)]",
        status === "spec-only" &&
          "border-dashed border-[var(--color-border-strong)] text-[var(--color-text-muted)]",
      )}
    >
      {label}
    </span>
  );
}

function DoDontCard({ tone, note }: { tone: "do" | "dont"; note: string }) {
  const label = tone === "do" ? "Do" : "Don't";
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[8px] border p-4",
        tone === "do" ? "border-[var(--color-text)]" : "border-dashed border-[var(--color-border-strong)]",
      )}
    >
      <span className="text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        {label}
      </span>
      <p className="text-[16px] leading-[1.55] text-[var(--color-text)]">{note}</p>
    </div>
  );
}

function toKebab(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
}
