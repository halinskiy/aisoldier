"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";
import { useScrubProgress } from "@ui-kit/hooks/useScrubProgress";

/* -------------------------------------------------------------------------- */
/*  HowItWorksScroll (V3) - pinned HORIZONTAL scrub                            */
/* -------------------------------------------------------------------------- */
/**
 * The record -> own -> share chain told once more, off-axis: vertical scroll
 * drives a horizontal track of 3 panels (SECTION_CONTRACT_V3 S3 / DIRECTION_V3
 * A2). The single permitted axis break, a real Framer scrub.
 *
 * HYDRATION FIX (2026-06-23): the scrub engine lives ONLY in the inner
 * <HowItWorksScrubbed>, mounted ONLY when enhanced, so the ref passed to
 * useScroll is always attached to a rendered runway element in the same commit.
 * No "defined but not hydrated" target. The gate + the static fallback own no
 * scroll hook.
 *
 * PANEL-WIDTH FIX (2026-06-23): each panel is a FULL viewport-width slide
 * (w-screen, content centered on a comfortable max-w-[1080px] inner). Body text
 * sits at a comfortable measure (max-w-[44ch]); the visual is placed in the
 * second grid column with its own column gap so it never overlaps the text. One
 * panel fills the screen at a time as the user scrubs. Track travel -200% over
 * 3 panels (x: 0% -> -66.667% of a 300%-wide track).
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): the 3 panels lay out
 * as a normal vertical stack (no x). CLS 0. Anti-jank: J1-J10 (only `x` is
 * scrubbed; one spring; sticky pin; vh runway; will-change on the track only).
 *
 * Project-local; stays project-local (Tracer-specific horizontal track).
 */

type Panel = {
  title: string;
  body: ReactNode;
  visual: ReactNode;
};

export function HowItWorksScroll({ panels }: { panels: Panel[] }) {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });

  // STATIC FALLBACK: hook-free, the 3 panels as a normal vertical stack.
  if (!enhance) {
    return (
      <div className="flex flex-col gap-16">
        {panels.map((panel, i) => (
          <PanelBody key={i} panel={panel} index={i} total={panels.length} />
        ))}
      </div>
    );
  }

  return <HowItWorksScrubbed panels={panels} />;
}

/* -------------------------------------------------------------------------- */
/*  HowItWorksScrubbed - mounted only when enhanced; owns the scroll engine     */
/* -------------------------------------------------------------------------- */

function HowItWorksScrubbed({ panels }: { panels: Panel[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrubProgress(ref); // ONE spring (J5). ref is ALWAYS attached.
  // 3 panels on a 300%-wide track => travel two panel widths = -66.667%.
  // SNAP (2026-06-23): instead of a linear scrub (which parks the track between
  // panels, showing sliced half-panels at both edges), the track DWELLS on each
  // panel. The transition between panels happens in a short window, then the
  // track holds on the next full panel for the rest of that third. Any rest
  // position shows ONE clean full panel, never a sliced half. Compositor `x`
  // only (J9); still ONE spring (the dwell is in the input->output map, not a
  // second spring).
  const x = useTransform(
    p,
    [0, 0.34, 0.46, 0.66, 0.78, 1],
    ["0%", "0%", "-33.333%", "-33.333%", "-66.667%", "-66.667%"],
  );

  return (
    // Full-bleed runway: break out of the grid column so each panel is a true
    // 100vw slide. The runway gives the sticky stage something to scrub.
    <div
      ref={ref}
      style={{ height: "240vh" }}
      className="relative left-1/2 w-screen -translate-x-1/2"
    >
      <div
        className="flex items-center overflow-hidden"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          // Edge mask: feather the left/right 7vw so a panel caught mid-slide at
          // a screen edge fades out instead of bleeding in as a sharp half-card.
          // With the dwell snap most rests land on a full panel; this makes the
          // in-between transition frames read clean too (no sliced half-panel).
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, rgba(0,0,0,1) 7vw, rgba(0,0,0,1) calc(100% - 7vw), transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0, rgba(0,0,0,1) 7vw, rgba(0,0,0,1) calc(100% - 7vw), transparent 100%)",
        }}
      >
        <motion.div
          className="flex h-full"
          style={{ x, width: "300vw", willChange: "transform" }}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              className="flex h-full w-screen shrink-0 items-center justify-center"
            >
              <PanelBody panel={panel} index={i} total={panels.length} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PanelBody({
  panel,
  index,
  total,
}: {
  panel: Panel;
  index: number;
  total: number;
}) {
  return (
    <div className="grid w-full max-w-[1120px] grid-cols-1 items-center gap-16 px-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-24">
      <div>
        <span className="font-[family-name:var(--font-mono)] text-[16px] tabular-nums text-[var(--color-text-muted)]">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <h3
          className="mt-4 font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)]"
          style={{ fontSize: "var(--text-display-md)", lineHeight: "var(--lh-h2)", letterSpacing: "var(--ls-display)" }}
        >
          {panel.title}
        </h3>
        <p className="mt-6 max-w-[44ch] font-[family-name:var(--font-sans)] text-[19px] leading-[1.6] text-[var(--color-text-muted)]">
          {panel.body}
        </p>
      </div>
      <div className="flex w-full justify-center lg:justify-end">{panel.visual}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel visuals - reading-pace static frames of each chain beat             */
/* -------------------------------------------------------------------------- */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-[240px] w-full max-w-[520px] items-center justify-center rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)] p-12"
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
        <svg width="34" height="32" viewBox="0 0 32 30" fill="none" aria-hidden className="shrink-0">
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
