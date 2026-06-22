import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  SpecStrip                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * SpecStrip - a single quiet hairline-bordered row (or column) of terse facts.
 *
 * The credibility primitive that replaces "chip soup": instead of a scatter of
 * coloured proof pills, the killer facts collapse into ONE bordered, monochrome,
 * uniformly-shaped strip. Two layouts:
 *
 *   direction="horizontal" (default): one row of `|`-divided spans. Used near a
 *   hero fold (Free forever | MIT licensed | ~12MB | ...). Mono internals by
 *   default so it reads like spec metadata, not marketing.
 *
 *   direction="vertical": a stack of hairline-divided rows, each a label + an
 *   optional detail. Used for an ownership / truth strip (label left, detail
 *   right) where a horizontal row would not fit prose.
 *
 * Tone "light" (default) sits on a light surface; tone "dark" sits on a dark
 * stage and uses the on-dark opacity ramp. All text is >= 16px. No icons, no
 * colour except an optional single accent dot per vertical row.
 *
 * Token contract: --color-text, --color-text-muted, --color-border,
 * --color-accent, --radius-window, --radius-pill, --font-display, --font-sans,
 * --font-mono. Promoted from projects/tracer 2026-06-22 (hero spec row + the
 * ownership truth strip).
 */

export type SpecStripTruth = {
  label: string;
  detail?: ReactNode;
};

export type SpecStripProps = {
  /** Horizontal: short fact strings. Vertical: label + detail rows. */
  items: string[] | SpecStripTruth[];
  direction?: "horizontal" | "vertical";
  /** Use the mono face for the fact strings (horizontal). Default true. */
  mono?: boolean;
  /** Surface ramp. */
  tone?: "light" | "dark";
  /** Show a single accent dot before each vertical row label. Default false. */
  accentDot?: boolean;
  className?: string;
};

function isTruthList(
  items: string[] | SpecStripTruth[],
): items is SpecStripTruth[] {
  return items.length > 0 && typeof items[0] !== "string";
}

export function SpecStrip({
  items,
  direction = "horizontal",
  mono = true,
  tone = "light",
  accentDot = false,
  className,
}: SpecStripProps) {
  const labelColor =
    tone === "dark" ? "text-white/80" : "text-[var(--color-text)]";
  const detailColor =
    tone === "dark" ? "text-white/50" : "text-[var(--color-text-muted)]";
  const borderColor = tone === "dark" ? "border-white/10" : "border-[var(--color-border)]";
  const dividerColor = tone === "dark" ? "bg-white/10" : "bg-[var(--color-border)]";

  if (direction === "vertical") {
    const truths: SpecStripTruth[] = isTruthList(items)
      ? items
      : (items as string[]).map((label) => ({ label }));
    return (
      <ul
        className={[
          "w-full overflow-hidden rounded-[var(--radius-window)] border",
          borderColor,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {truths.map((t, i) => (
          <li
            key={i}
            className={[
              "grid grid-cols-1 gap-2 px-6 py-6 lg:grid-cols-[280px_1fr] lg:gap-10 lg:px-8",
              i > 0 ? `border-t ${borderColor}` : "",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              {accentDot && (
                <span
                  aria-hidden
                  className="h-[8px] w-[8px] shrink-0 rounded-full bg-[var(--color-accent)]"
                />
              )}
              <span
                className={`font-[family-name:var(--font-display)] text-[18px] font-semibold leading-[1.3] ${labelColor}`}
              >
                {t.label}
              </span>
            </div>
            {t.detail && (
              <span className={`text-[16px] leading-[1.6] ${detailColor}`}>
                {t.detail}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // horizontal
  const facts = (items as string[]).map(String);
  return (
    <div
      className={[
        "inline-flex max-w-full flex-wrap items-center rounded-[var(--radius-pill)] border px-2 py-1",
        borderColor,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {facts.map((fact, i) => (
        <span key={i} className="inline-flex items-center">
          {i > 0 && (
            <span
              aria-hidden
              className={`mx-3 h-[14px] w-px ${dividerColor}`}
            />
          )}
          <span
            className={[
              "px-2 text-[16px] leading-none",
              mono
                ? "font-[family-name:var(--font-mono)] tracking-[-0.01em]"
                : "font-[family-name:var(--font-sans)]",
              detailColor,
            ].join(" ")}
          >
            {fact}
          </span>
        </span>
      ))}
    </div>
  );
}
