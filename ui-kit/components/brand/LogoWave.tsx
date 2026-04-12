import { cn } from "../../lib/cn";

export type LogoWaveProps = {
  /** Full logo string. Must contain `~` — the glyph splits on it. */
  logo: string;
  /** Font-size in px. Default 18 (matches NavSticky). */
  size?: number;
  /** Visual tone. `inherit` lets the parent scope set the color (used in dark footer). */
  tone?: "inherit" | "muted";
  /** Inline anchor href — usually `#top`. Omit for a non-link span. */
  href?: string;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/brand/LogoWave.tsx";

/**
 * `Template ~ Design` style wordmark with an accent wave glyph between halves.
 *
 * Promoted to the kit in session 14 after hitting 2 confirmed uses:
 *   - `NavSticky` (project Nav)
 *   - `FooterEditorial` (project Footer)
 *
 * Split on the first `~`; renders the accent wave in `var(--color-accent)`
 * so both light and dark themes work without overrides.
 */
export function LogoWave({
  logo,
  size = 18,
  tone = "inherit",
  href,
  className,
  dataSource,
}: LogoWaveProps) {
  const [left, right] = splitLogo(logo);
  const color =
    tone === "muted" ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)]";

  const body = (
    <>
      <span>{left}</span>
      <WaveGlyph size={size} />
      <span>{right}</span>
    </>
  );

  const common = {
    "data-component": "LogoWave",
    "data-source": dataSource ?? DATA_SOURCE_DEFAULT,
    "data-tokens": "color-text,color-accent,font-serif",
  } as const;

  const classes = cn(
    "inline-flex items-baseline gap-[6px] font-serif font-medium tracking-[-0.01em] transition-opacity duration-150 hover:opacity-75",
    color,
    className,
  );

  // Accessible name is the visible text content ("Template Design") plus
  // the wave glyph which is `aria-hidden`. No explicit aria-label — that
  // would cause a label-content-name-mismatch audit fail.
  if (href) {
    return (
      <a
        href={href}
        {...common}
        className={classes}
        style={{
          fontSize: `${size}px`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {body}
      </a>
    );
  }

  return (
    <span
      {...common}
      className={classes}
      style={{ fontSize: `${size}px` }}
    >
      {body}
    </span>
  );
}

function WaveGlyph({ size }: { size: number }) {
  const w = Math.round(size * 1.2);
  const h = Math.round(size * 0.55);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 22 10"
      aria-hidden
      className="translate-y-[1px] text-[var(--color-accent)]"
    >
      <path
        d="M1 5 Q 4.5 0.5, 8 5 T 15 5 T 22 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function splitLogo(logo: string): [string, string] {
  const idx = logo.indexOf("~");
  if (idx === -1) return [logo, ""];
  return [logo.slice(0, idx).trim(), logo.slice(idx + 1).trim()];
}
