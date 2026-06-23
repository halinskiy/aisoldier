"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  HowItWorksScroll                                                          */
/* -------------------------------------------------------------------------- */
/**
 * The hero chain re-staged at reading pace: three full-width panels, each a beat
 * of the record -> ~/Dropbox/Tracer/ -> share-link story. The record-red dot is
 * the through-line: REC dot (panel 1) -> Dropbox sync dot (panel 2) -> copied
 * tick (panel 3). Same object, three honest jobs, blur-morphing as the dot rail
 * tracks scroll progress down the section.
 *
 * Replaces the v1 StickyFeatureList approach. Each panel is a grid child (its
 * caller wraps the whole section in GridPage); the panel text + visual span the
 * full 1-12. Panel entrances use the kit scroll-timeline reveal (.st-reveal),
 * native, off main thread. The dot rail is a single Framer element whose colour
 * and glyph cross-fade with scroll progress, gated by useEnhancementEnabled.
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): the rail dot rests as
 * the tick at the bottom; every panel is fully visible. CLS 0.
 *
 * Project-local; promote on second use (HANDOFF.md).
 */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

type Panel = {
  title: string;
  body: React.ReactNode;
  visual: React.ReactNode;
};

export function HowItWorksScroll({ panels }: { panels: Panel[] }) {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });
  const prefersReduced = useReducedMotion();
  const live = enhance && !prefersReduced;

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 70%", "end 60%"],
  });

  // The rail dot travels top -> bottom as the section scrolls through.
  const dotTop = useTransform(scrollYProgress, [0, 1], ["4%", "96%"]);

  return (
    <div ref={railRef} className="relative">
      {/* the dot rail: a faint vertical line on the far left of the content */}
      <span
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-px lg:block"
        style={{ background: "var(--color-border)" }}
        aria-hidden
      />
      {live && (
        <motion.span
          className="pointer-events-none absolute left-0 z-[2] hidden h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
          style={{ top: dotTop, background: "var(--color-accent)" }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}

      <ol className="flex flex-col gap-px lg:pl-12">
        {panels.map((panel, i) => (
          <li
            key={i}
            className={`st-reveal st-reveal-${(i % 4) + 1} grid grid-cols-1 items-center gap-10 border-t border-[var(--color-border)] py-16 first:border-t-0 lg:grid-cols-2 lg:gap-16`}
          >
            <div>
              <h3
                className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)]"
                style={{ fontSize: "var(--text-body-lg)" }}
              >
                {panel.title}
              </h3>
              <p className="mt-4 max-w-[46ch] font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
                {panel.body}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">{panel.visual}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel visuals - reading-pace static frames of each hero beat              */
/* -------------------------------------------------------------------------- */

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[180px] w-full max-w-[460px] items-center justify-center rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {children}
    </div>
  );
}

export function RecordVisual() {
  return (
    <PanelShell>
      <div
        className="flex items-center gap-4 rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-7 py-5"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <span
          className="h-[18px] w-[18px] rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
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

export function DropboxVisual() {
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

export function LinkVisual() {
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
