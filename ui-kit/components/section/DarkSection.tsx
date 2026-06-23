import type { ReactNode } from "react";

/**
 * DarkSection - a full-bleed near-black break section for the light -> dark ->
 * light page rhythm. Sets a warm ink surface, scopes child text to an on-dark
 * paper-white ramp, and lays a soft dark dot-grid behind the content. Hairlines
 * on the dark surface are white at low alpha; the single project accent pops on
 * it. Shadows are a light-theme device, so the dark surface relies on the accent
 * and the white-opacity ramp, not drop shadows (doctrine §2.7, §2.8).
 *
 * Token contract (the consuming project supplies these in its @theme):
 *   --color-ink-surface  warm near-black break surface (e.g. #160C0A)
 *   --color-on-dark      paper-white text on the dark surface
 *   --color-accent       the single project accent
 * and two utility classes in the project's globals.css:
 *   .dark-scope     { color: var(--color-on-dark); }  + an on-dark ::selection
 *   .dot-grid-dark  radial-gradient(circle, rgba(255,255,255,.08) 1px, transparent 1px)
 *                   at 24px 24px
 *
 * Why a token contract rather than baked-in colours: the kit stays monochrome
 * and theme-agnostic; each project owns its accent + exact near-black. The
 * quirky-landing instance is the reference implementation.
 *
 * Motion-off safe: this is a static surface. Any child motion must gate itself
 * (BlurReveal / useEnhancementEnabled already do). CLS-neutral: no layout shift.
 *
 * Promoted from quirky-landing 2026-06-01 (the redesign light/dark rhythm).
 */
type DarkSectionProps = {
  id?: string;
  /** Inspector component name for the section element. */
  component: string;
  /** Inspector source path. */
  source: string;
  /** Comma list of tokens this section uses, for the Inspector overlay. */
  tokens?: string;
  /** soft dark dot-grid atmosphere behind the content (default true) */
  grid?: boolean;
  /** vertical padding scale: "lg" (default, py-24/py-32) or "md" (py-16/py-20) */
  pad?: "md" | "lg";
  /**
   * Bleed mode: drop the inner max-width + horizontal padding so the consumer
   * supplies its own content grid (e.g. a project .grid-page). The dark
   * background still bleeds full-viewport; vertical padding is kept. Use this
   * when a project enforces a single page grid across light AND dark sections.
   */
  bleed?: boolean;
  /**
   * Keep the section overflow VISIBLE so a child `position: sticky` runway can
   * pin (an `overflow: hidden` ancestor silently disables sticky). Default
   * false (overflow hidden, the original full-bleed clip behavior). Set true on
   * a dark section that hosts a scroll-scrubbed pinned stage; clip any bleeding
   * atmosphere in an inner `absolute inset-0 overflow-hidden` layer instead.
   */
  allowSticky?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function DarkSection({
  id,
  component,
  source,
  tokens = "ink-surface,on-dark,accent",
  grid = true,
  pad = "lg",
  bleed = false,
  allowSticky = false,
  className,
  innerClassName,
  children,
}: DarkSectionProps) {
  return (
    <section
      id={id}
      data-component={component}
      data-source={source}
      data-tokens={tokens}
      className={cx(
        "dark-scope relative border-y border-white/10 scroll-mt-24",
        allowSticky ? "" : "overflow-hidden",
        grid && "dot-grid-dark",
        className,
      )}
      style={{ background: "var(--color-ink-surface)" }}
    >
      <div
        className={cx(
          "relative",
          bleed ? "" : "mx-auto max-w-6xl px-5",
          pad === "lg" ? "py-24 md:py-32" : "py-16 md:py-20",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
