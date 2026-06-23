"use client";

import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

/**
 * PropsTable -- fixed four-column schema (Name / Type / Default /
 * Description) for documenting a component's API on /system.
 *
 * Monospace 14px for the first three columns, Plex Sans 16px line-height
 * 1.55 for Description. Header row uppercase 12px small-caps. Hairline
 * cell borders. Hover row tint is `--color-surface` (#fafafa). The table
 * does not scroll horizontally above 480px -- Description wraps instead.
 *
 * "No default" renders as the literal lower-case word `none` rather than
 * an em dash, in compliance with the studio ASCII-only rule. Pass an
 * empty string for `default` to opt into that rendering automatically.
 */

export type PropRow = {
  name: string;
  type: string;
  /** Empty string renders as "none". Pass any other string verbatim. */
  default?: string;
  description: ReactNode;
};

export type PropsTableProps = {
  rows: PropRow[];
  /** Optional caption shown above the table as small-caps eyebrow. */
  caption?: string;
  className?: string;
  dataSource?: string;
};

export function PropsTable({
  rows,
  caption,
  className,
  dataSource = "ui-kit/components/system/PropsTable.tsx",
}: PropsTableProps) {
  return (
    <div
      data-component="PropsTable"
      data-source={dataSource}
      data-tokens="color-border,color-surface,color-text,font-mono,font-sans"
      className={cn("flex w-full flex-col gap-3", className)}
    >
      {caption ? (
        <span className="text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
          {caption}
        </span>
      ) : null}

      <div className="overflow-hidden rounded-[8px] border border-[var(--color-border)]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              <ColHead label="Name" />
              <ColHead label="Type" />
              <ColHead label="Default" />
              <ColHead label="Description" wide />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <PropsRow key={`${row.name}-${i}`} row={row} last={i === rows.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ColHead({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-[var(--color-border)] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]",
        wide && "w-[44%]",
      )}
    >
      {label}
    </th>
  );
}

function PropsRow({ row, last }: { row: PropRow; last: boolean }) {
  const defaultText = row.default && row.default.trim().length > 0 ? row.default : "none";
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-[var(--color-surface)]",
        !last && "border-b border-[var(--color-border)]",
      )}
      style={{ transitionDuration: "120ms" }}
    >
      <td
        className="px-4 py-3 align-top text-[14px] font-semibold text-[var(--color-text)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {row.name}
      </td>
      <td
        className="px-4 py-3 align-top text-[14px] text-[var(--color-text-muted)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {row.type}
      </td>
      <td
        className="px-4 py-3 align-top text-[14px] text-[var(--color-text-subtle)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {defaultText}
      </td>
      <td className="px-4 py-3 align-top text-[16px] leading-[1.55] text-[var(--color-text)]">
        {row.description}
      </td>
    </tr>
  );
}
