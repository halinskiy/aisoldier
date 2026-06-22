import { NoCornyMark } from "./NoCornyMark";
import copy from "@content/copy.json";

/**
 * Mobile stub - the deliberate single-screen mobile layout. Desktop-only is the
 * mandate; the product is macOS. One screen: mark + wordmark, one line, one
 * Download button. Nothing else (no hero morph, no nav links, no accordion).
 * Visible only below md; the full desktop experience is hidden below md.
 */
export function MobileStub() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-7 px-8 text-center md:hidden">
      <div className="flex items-center gap-2.5">
        <NoCornyMark size={20} className="text-[var(--color-text)]" />
        <span className="font-[family-name:var(--font-display)] text-[20px] font-semibold tracking-[-0.01em] text-[var(--color-text)]">
          {copy.nav.logo}
        </span>
      </div>
      <p className="max-w-[30ch] font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
        macOS only. Download on your desktop.
      </p>
      <a
        href="/download"
        className="inline-flex items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-6 py-3 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        {copy.nav.cta_primary}
      </a>
    </main>
  );
}
