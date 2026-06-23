"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";
import { useScrubProgress } from "@ui-kit/hooks/useScrubProgress";

/* -------------------------------------------------------------------------- */
/*  HeroMorphStage (V3) - 3-beat VERTICAL SCROLL SCRUB                          */
/* -------------------------------------------------------------------------- */
/**
 * The record -> your Dropbox -> share-link chain, physically SCRUBBED by the
 * wheel (SECTION_CONTRACT_V3 S2 / DIRECTION_V3 A1). Reworked from V2's enter-
 * played 5-beat sequence: the user cannot scroll the hero without the chain
 * advancing under the wheel. There is no dead text gap.
 *
 * HYDRATION FIX (2026-06-23): the scrub engine (useScrubProgress -> useScroll
 * with a target ref) lives ONLY in the inner <HeroScrubbed> component, which is
 * mounted ONLY when enhancement is on. The ref it passes to useScroll is always
 * attached to an unconditionally rendered runway element in the SAME commit the
 * hook first runs, so useScroll never sees a "defined but not hydrated" target.
 * The gate component owns NO scroll hook; the static fallback owns NO scroll
 * hook. This is the framer-motion-documented fix (motion.dev/.../use-scroll-ref)
 * and it keeps hook order stable in each component.
 *
 *   beat 1  p 0.00-0.40  RECORDER pill, red dot live, REC 00:0x (Geist Mono),
 *                        captured frame center, large.
 *   beat 2  p 0.33-0.72  the captured frame travels toward the Dropbox slot via
 *                        x/y; scale held >= 0.9 (never a speck); blur seam mid.
 *   beat 3  p 0.66-1.00  the folder resolves into the live link card (Geist Mono)
 *                        which clip-reveals left -> right and rests.
 *
 * Beats OVERLAP (cross-fade through a blur seam) so the stage is never empty
 * between beats. The subject is LARGE (fills the stage), one focal point.
 *
 * Static mode renders the BEAT-3 END state (link card resolved, dot frozen).
 * CLS 0. Anti-jank: J1-J10 (transform/opacity/clipPath/filter only; one spring;
 * sticky pin not a JS top; vh runway; will-change scoped to morph nodes).
 *
 * Project-local custom embed (HANDOFF.md). Geist Mono ONLY for the timer, path
 * label, and share-link string.
 */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

const BEAT_LABELS = ["Hit record.", "It is in your Dropbox.", "Share the link."];

export function HeroMorphStage() {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });

  // STATIC FALLBACK: hook-free, renders the composed beat-3 end state.
  if (!enhance) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-10 py-16">
        <span
          className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {BEAT_LABELS[2]}
        </span>
        <div className="w-full max-w-[620px]">
          <ShareLinkCard />
        </div>
      </div>
    );
  }

  return <HeroScrubbed />;
}

/* -------------------------------------------------------------------------- */
/*  HeroScrubbed - mounted only when enhanced; owns the scroll engine           */
/* -------------------------------------------------------------------------- */

function HeroScrubbed() {
  const ref = useRef<HTMLDivElement>(null);
  // ONE spring for the whole section (J5). The ref below is ALWAYS attached.
  const p = useScrubProgress(ref);

  // -------- Beat label cross-fades (overlapping so the line never blanks) ----
  const label0Op = useTransform(p, [0, 0.05, 0.3, 0.38], [1, 1, 1, 0]);
  const label1Op = useTransform(p, [0.32, 0.42, 0.62, 0.7], [0, 1, 1, 0]);
  const label2Op = useTransform(p, [0.64, 0.74, 1], [0, 1, 1]);
  const label0Blur = useTransform(p, [0.3, 0.38], ["blur(0px)", "blur(4px)"]);
  const label1Blur = useTransform(
    p,
    [0.32, 0.42, 0.62, 0.7],
    ["blur(4px)", "blur(0px)", "blur(0px)", "blur(4px)"],
  );
  const label2Blur = useTransform(p, [0.64, 0.74], ["blur(4px)", "blur(0px)"]);

  // -------- Beat 1: recorder pill (visible 0 - 0.40, overlaps beat 2) --------
  const recOpacity = useTransform(p, [0, 0.05, 0.32, 0.42], [1, 1, 1, 0]);
  const recScale = useTransform(p, [0, 0.42], [1, 0.92]);
  const recBlur = useTransform(p, [0.32, 0.42], ["blur(0px)", "blur(3px)"]);

  // -------- Beat 2: the captured frame travels toward the Dropbox slot -------
  // Enters at 0.33 (overlaps beat 1 fade-out), leaves at 0.72 (overlaps beat 3).
  const capOpacity = useTransform(p, [0.3, 0.4, 0.64, 0.74], [0, 1, 1, 0]);
  const capX = useTransform(p, [0.33, 0.74], ["-90px", "60px"]);
  const capY = useTransform(p, [0.33, 0.74], ["10px", "-6px"]);
  // scale held >= 0.9 throughout the hand-off.
  const capScale = useTransform(p, [0.33, 0.54, 0.74], [0.94, 1, 0.93]);
  // blur seam at the 0.48-0.56 midpoint.
  const capBlur = useTransform(
    p,
    [0.4, 0.48, 0.52, 0.56, 0.66, 0.72],
    ["blur(0px)", "blur(0px)", "blur(2px)", "blur(0px)", "blur(0px)", "blur(3px)"],
  );

  // -------- Beat 3: the live link card clip-reveals (0.62 - 0.84, then rests) -
  // The reveal OVERLAPS beat 2's exit and finishes well before p=1 so the card
  // is substantial for the whole back third of the runway (no clipped sliver,
  // no empty stage between beats).
  const linkOpacity = useTransform(p, [0.6, 0.66], [0, 1]);
  const linkClip = useTransform(
    p,
    [0.62, 0.84],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const linkY = useTransform(p, [0.62, 0.78], ["22px", "0px"]);

  return (
    <div ref={ref} style={{ height: "230vh" }}>
      {/* The sticky stage biases its content toward the UPPER portion (pt-[14vh],
          justify-start) so the beat label + morph subject sit right under the H1,
          closing the soft void that opened when content was pure-centered in a
          full 100vh stage. */}
      <div
        className="flex flex-col items-center justify-start overflow-hidden pt-[14vh]"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {/* one label per beat, cross-faded so the line never blanks */}
        <div className="relative mb-8 flex h-[2.4em] items-center justify-center">
          <motion.span
            className="absolute whitespace-nowrap font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
            style={{ fontSize: "var(--text-h2)", opacity: label0Op, filter: label0Blur, willChange: "opacity, filter" }}
          >
            {BEAT_LABELS[0]}
          </motion.span>
          <motion.span
            className="absolute whitespace-nowrap font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
            style={{ fontSize: "var(--text-h2)", opacity: label1Op, filter: label1Blur, willChange: "opacity, filter" }}
          >
            {BEAT_LABELS[1]}
          </motion.span>
          <motion.span
            className="absolute whitespace-nowrap font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
            style={{ fontSize: "var(--text-h2)", opacity: label2Op, filter: label2Blur, willChange: "opacity, filter" }}
          >
            {BEAT_LABELS[2]}
          </motion.span>
        </div>

        {/* the morph subject: one large focal point, beats cross-fade over it */}
        <div className="relative flex h-[300px] w-full max-w-[700px] items-center justify-center">
          {/* beat 1: recorder pill */}
          <motion.div
            className="absolute"
            style={{ opacity: recOpacity, scale: recScale, filter: recBlur, willChange: "transform, opacity, filter" }}
            aria-hidden
          >
            <RecorderPill />
          </motion.div>

          {/* beat 2: the captured frame travels to the Dropbox slot */}
          <motion.div
            className="absolute"
            style={{ opacity: capOpacity, x: capX, y: capY, scale: capScale, filter: capBlur, willChange: "transform, opacity, filter" }}
            aria-hidden
          >
            <CaptureCard />
          </motion.div>

          {/* beat 3: the live link card clip-reveals into place and rests */}
          <motion.div
            className="absolute w-full max-w-[660px] px-2"
            style={{ opacity: linkOpacity, y: linkY, clipPath: linkClip, willChange: "clip-path, transform, opacity" }}
            aria-hidden
          >
            <ShareLinkCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Beat visuals                                                               */
/* -------------------------------------------------------------------------- */

function RecorderPill() {
  return (
    <div
      className="flex items-center gap-3 rounded-[var(--radius-pill)] px-7 py-4"
      style={{
        background: "var(--color-on-dark-glass-strong)",
        border: "1px solid var(--color-on-dark-hairline-strong)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      <span className="relative flex h-[15px] w-[15px] items-center justify-center">
        {/* the ONE blink loop in this stage: the live record dot */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--color-accent)" }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="relative h-[15px] w-[15px] rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[20px] tabular-nums text-[var(--color-on-dark)] opacity-60">
        00:04
      </span>
      <span
        className="mx-1 h-[20px] w-px"
        style={{ background: "var(--color-on-dark-hairline-strong)" }}
      />
      <span className="font-[family-name:var(--font-display)] text-[20px] font-medium text-[var(--color-on-dark)] opacity-90">
        Recording
      </span>
      <span
        className="ml-1 flex h-[28px] w-[28px] items-center justify-center rounded-[var(--radius-button)]"
        style={{ border: "1px solid var(--color-on-dark-hairline-strong)" }}
      >
        <span className="h-[11px] w-[11px] rounded-[2px] bg-[var(--color-on-dark)] opacity-70" />
      </span>
    </div>
  );
}

function CaptureCard() {
  return (
    <div
      className="flex items-center gap-5 rounded-[var(--radius-window)] px-7 py-6"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
        minWidth: 360,
      }}
    >
      <span
        className="h-[15px] w-[15px] shrink-0 rounded-full"
        style={{ background: "var(--color-accent)" }}
      />
      <span className="flex items-end gap-[4px]" aria-hidden>
        {[12, 22, 10, 26, 16, 24, 11, 20].map((h, i) => (
          <span
            key={i}
            className="w-[4px] rounded-full bg-[var(--color-on-dark)] opacity-50"
            style={{ height: h }}
          />
        ))}
      </span>
      <div className="ml-1 flex flex-col gap-1.5">
        <span className="font-[family-name:var(--font-display)] text-[18px] font-medium text-[var(--color-on-dark)] opacity-90">
          Capture saved
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-50">
          recording.mp4
        </span>
      </div>
    </div>
  );
}

function DropboxGlyph() {
  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 32 30"
      fill="none"
      aria-hidden
      className="text-[var(--color-on-dark)]"
      style={{ opacity: 0.6 }}
    >
      <path
        d="M8 0L0 5.2L8 10.4L16 5.2L8 0ZM24 0L16 5.2L24 10.4L32 5.2L24 0ZM0 15.6L8 20.8L16 15.6L8 10.4L0 15.6ZM24 10.4L16 15.6L24 20.8L32 15.6L24 10.4ZM8 22.5L16 27.7L24 22.5L16 17.3L8 22.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShareLinkCard() {
  return (
    <div
      className="w-full rounded-[var(--radius-window)] px-7 py-6"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <DropboxGlyph />
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-50">
          {PATH}
        </span>
        <span className="ml-auto flex items-center gap-2 text-[16px] text-[var(--color-on-dark)] opacity-40">
          <span
            className="h-[9px] w-[9px] rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
          <span className="font-[family-name:var(--font-sans)]">Synced</span>
        </span>
      </div>

      <div
        className="my-5 h-px w-full"
        style={{ background: "var(--color-on-dark-hairline)" }}
      />

      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono)] text-[20px] text-[var(--color-on-dark)] opacity-90">
          {SHARE}
        </span>
        <span
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--color-on-dark)]"
          style={{
            background: "var(--color-accent)",
            border: "1px solid var(--color-on-dark-hairline)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden>
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
    </div>
  );
}
