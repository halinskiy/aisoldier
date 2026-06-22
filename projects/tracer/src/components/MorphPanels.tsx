/**
 * MorphPanels - static, simplified frames of the three hero beats, sized for the
 * "How it works" sticky visual (S3). These are the calm reading-pace restatement
 * of the hero morph: record / lands in your Dropbox / share the link. No
 * animation here (the StickyFeatureList cross-fades between them); each panel is
 * the resting state of its beat. Light surface (the kit card is light).
 *
 * The frames are scaled to fill the panel confidently (roughly half its width)
 * at full opacity, so they read as three legible product frames rather than
 * faint ghosts on the dotted card.
 *
 * Project-local. Geist Mono only for the path and link strings.
 */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-7">
      <div className="flex w-full max-w-[420px] items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function RecordPanel() {
  return (
    <PanelShell>
      <div
        className="flex items-center gap-4 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-7 py-5"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <span className="relative flex h-[18px] w-[18px] items-center justify-center">
          <span
            className="h-[18px] w-[18px] rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[22px] tabular-nums text-[var(--color-text-muted)]">
          00:04
        </span>
        <span className="mx-1 h-[22px] w-px bg-[var(--color-border-strong)]" />
        <span className="font-[family-name:var(--font-display)] text-[20px] font-semibold text-[var(--color-text)]">
          Recording
        </span>
      </div>
    </PanelShell>
  );
}

export function DropboxPanel() {
  return (
    <PanelShell>
      <div
        className="flex w-full items-center gap-5 rounded-[var(--radius-window)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-7 py-6"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <svg width="34" height="32" viewBox="0 0 32 30" fill="none" aria-hidden>
          <path
            d="M8 0L0 5.2L8 10.4L16 5.2L8 0ZM24 0L16 5.2L24 10.4L32 5.2L24 0ZM0 15.6L8 20.8L16 15.6L8 10.4L0 15.6ZM24 10.4L16 15.6L24 20.8L32 15.6L24 10.4ZM8 22.5L16 27.7L24 22.5L16 17.3L8 22.5Z"
            fill="var(--color-text-muted)"
          />
        </svg>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="truncate font-[family-name:var(--font-mono)] text-[20px] text-[var(--color-text)]">
            {PATH}
          </span>
          <span className="flex items-center gap-2.5 text-[18px] text-[var(--color-text-muted)]">
            <span
              className="h-[10px] w-[10px] rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <span className="font-[family-name:var(--font-sans)]">Synced</span>
          </span>
        </div>
      </div>
    </PanelShell>
  );
}

export function LinkPanel() {
  return (
    <PanelShell>
      <div
        className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] py-4 pl-7 pr-4"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <span className="truncate font-[family-name:var(--font-mono)] text-[19px] text-[var(--color-text)]">
          {SHARE}
        </span>
        <span
          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--color-on-dark)]"
          style={{ background: "var(--color-accent)" }}
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2.5 7.5L5.5 10.5L11.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </PanelShell>
  );
}
