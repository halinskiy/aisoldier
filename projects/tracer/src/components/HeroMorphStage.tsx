"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  HeroMorphStage                                                             */
/* -------------------------------------------------------------------------- */
/**
 * The cinematic morph that performs Tracer's whole promise once on load, then
 * rests on ONE composed artifact. A single protagonist (the red record dot)
 * threads three honest states; the stage RESTS as one generous share-link card
 * directly under the CTA, the frame people screenshot.
 *
 *   beat 1  REC          macOS menu-bar recorder pill springs in; red dot pulses
 *                        live (the ONLY permitted infinite loop); timer 00:00->00:04.
 *   beat 2  CONDENSE     the recording frame condenses into a travelling capture.
 *   beat 3  DROPBOX      the capture passes through a ~/Dropbox/Tracer/ folder
 *                        (monochrome Dropbox glyph). This is a TRANSIENT, the
 *                        morph passes through it and it leaves the stage.
 *   beat 4  LINK         the clean share-link card grows into the resting frame
 *                        showing tracer.nocorny.com/v/k7r2-mx9p.
 *   beat 5  COPY->TICK   the copy affordance becomes a record-red tick; rests.
 *
 * At rest (beat 5) exactly ONE element is on the stage: the share-link card, an
 * elevated dark card centered under the CTA. The recorder pill and the Dropbox
 * folder are transients that are gone once the story finishes. A faint vertical
 * thread traces the journey so "it travelled here" reads after motion ends.
 *
 * Gated by useEnhancementEnabled (viewport >= 1024, no reduced-motion, no
 * ?motion=0). When the gate is false the stage renders statically on beat 5
 * (the resting share-link card), so the meaning survives without the headline.
 * CLS = 0: the stage reserves a fixed height in every mode.
 *
 * Project-local custom embed (noted in HANDOFF.md). Geist Mono is used ONLY for
 * the timer, the path label, and the share-link string.
 */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

const SPRING = { type: "spring" as const, stiffness: 180, damping: 22, mass: 0.9 };
const SMOOTH = { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const };

const STAGE_H = 300;

type Beat = 1 | 2 | 3 | 4 | 5;

export function HeroMorphStage() {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });
  const prefersReduced = useReducedMotion();
  // Start on the final state so SSR + the static fallback both land on beat 5.
  const [beat, setBeat] = useState<Beat>(5);
  const [timer, setTimer] = useState("00:04");
  const [copied, setCopied] = useState(true);

  // Drive the sequence only when the enhancement is enabled. Otherwise the
  // initial beat-5 state stays put (static fallback).
  useEffect(() => {
    if (!enhance || prefersReduced) return;

    let mounted = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const at = (ms: number, fn: () => void) => {
      timeouts.push(setTimeout(() => mounted && fn(), ms));
    };

    // reset to the start of the story
    setBeat(1);
    setTimer("00:00");
    setCopied(false);

    // beat 1: timer ticks 00:00 -> 00:04
    at(400, () => {
      let s = 0;
      const iv = setInterval(() => {
        if (!mounted) return;
        s += 1;
        setTimer(`00:0${Math.min(s, 4)}`);
        if (s >= 4) clearInterval(iv);
      }, 750);
      intervals.push(iv);
    });

    // beat 2: condense + detach
    at(3600, () => setBeat(2));
    // beat 3: pass through Dropbox
    at(4400, () => setBeat(3));
    // beat 4: link materializes
    at(5500, () => setBeat(4));
    // beat 5: copy -> red tick, rest
    at(6800, () => {
      setBeat(5);
      setCopied(true);
    });

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [enhance, prefersReduced]);

  // Transients: the recorder pill (beats 1-2) and the Dropbox folder (beat 3).
  // The share-link card is the resting frame (beats 4-5). At rest only it shows.
  const recorderVisible = beat <= 2;
  const condensed = beat === 2;
  const folderVisible = beat === 3;
  const linkVisible = beat >= 4;

  return (
    <div
      className="relative mx-auto flex w-full max-w-[620px] items-center justify-center"
      style={{ minHeight: STAGE_H }}
      aria-hidden
    >
      {/* faint vertical thread tracing the journey the capture travelled */}
      <span
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-on-dark-hairline) 22%, var(--color-on-dark-hairline) 78%, transparent)",
        }}
      />

      {/* faint ambient glow under the protagonist, never a loop */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-soft) 0%, transparent 68%)",
          opacity: 0.5,
        }}
      />

      {/* ===================== TRANSIENT: recorder pill (beats 1-2) ========= */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          opacity: recorderVisible ? 1 : 0,
          scale: condensed ? 0.42 : 1,
          y: recorderVisible ? -84 : -40,
        }}
        transition={recorderVisible ? SPRING : { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ pointerEvents: "none" }}
      >
        <RecorderPill timer={timer} pulse={beat === 1} />
      </motion.div>

      {/* ===================== TRANSIENT: Dropbox folder (beat 3) ========== */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          opacity: folderVisible ? 1 : 0,
          scale: folderVisible ? 1 : 0.6,
          y: folderVisible ? 0 : -24,
        }}
        transition={SPRING}
        style={{ pointerEvents: "none" }}
      >
        <DropboxFolder syncing />
      </motion.div>

      {/* ===================== RESTING FRAME: share-link card (beats 4-5) == */}
      <motion.div
        className="absolute w-full max-w-[560px] px-2"
        initial={false}
        animate={{
          opacity: linkVisible ? 1 : 0,
          scale: linkVisible ? 1 : 0.92,
          y: linkVisible ? 0 : 28,
        }}
        transition={SPRING}
        style={{ pointerEvents: "none" }}
      >
        <ShareLinkCard copied={copied} />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Transient: native macOS menu-bar recorder pill                            */
/* -------------------------------------------------------------------------- */

function RecorderPill({ timer, pulse }: { timer: string; pulse: boolean }) {
  return (
    <div
      className="flex items-center gap-3 rounded-[var(--radius-pill)] px-4 py-2.5"
      style={{
        background: "var(--color-on-dark-glass-strong)",
        border: "1px solid var(--color-on-dark-hairline-strong)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      {/* the live record dot - the ONLY permitted infinite loop */}
      <span className="relative flex h-[12px] w-[12px] items-center justify-center">
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--color-accent)" }}
            animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <span
          className="relative h-[12px] w-[12px] rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[16px] tabular-nums text-[var(--color-on-dark)] opacity-50">
        {timer}
      </span>
      <span
        className="mx-1 h-[16px] w-px"
        style={{ background: "var(--color-on-dark-hairline-strong)" }}
      />
      <span className="font-[family-name:var(--font-display)] text-[16px] font-medium text-[var(--color-on-dark)] opacity-80">
        Recording
      </span>
      {/* a stop affordance, native-honest */}
      <span
        className="ml-1 flex h-[22px] w-[22px] items-center justify-center rounded-[var(--radius-button)]"
        style={{ border: "1px solid var(--color-on-dark-hairline-strong)" }}
      >
        <span
          className="h-[9px] w-[9px] rounded-[2px] bg-[var(--color-on-dark)] opacity-70"
        />
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Transient: monochrome Dropbox folder, ~/Dropbox/Tracer/                   */
/* -------------------------------------------------------------------------- */

function DropboxGlyph() {
  // The standard Dropbox open-box mark, monochrome (on-dark at 60%), NOT blue.
  return (
    <svg
      width="22"
      height="21"
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

function DropboxFolder({ syncing }: { syncing: boolean }) {
  return (
    <div
      className="flex items-center gap-4 rounded-[var(--radius-window)] px-5 py-4"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      <DropboxGlyph />
      <div className="flex flex-col gap-1">
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-80">
          {PATH}
        </span>
        <span className="flex items-center gap-2 text-[16px] text-[var(--color-on-dark)] opacity-40">
          {/* the protagonist red dot, now the sync dot */}
          <span
            className="h-[8px] w-[8px] rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
          <span className="font-[family-name:var(--font-sans)]">
            {syncing ? "Syncing" : "Synced"}
          </span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Resting frame: the elevated share-link card, copy -> red tick             */
/* -------------------------------------------------------------------------- */

function ShareLinkCard({ copied }: { copied: boolean }) {
  return (
    <div
      className="w-full rounded-[var(--radius-window)] px-6 py-5"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      {/* path provenance row: where it lives */}
      <div className="flex items-center gap-2.5">
        <DropboxGlyph />
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-50">
          {PATH}
        </span>
        <span className="ml-auto flex items-center gap-2 text-[16px] text-[var(--color-on-dark)] opacity-40">
          <span
            className="h-[8px] w-[8px] rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
          <span className="font-[family-name:var(--font-sans)]">Synced</span>
        </span>
      </div>

      <div
        className="my-4 h-px w-full"
        style={{ background: "var(--color-on-dark-hairline)" }}
      />

      {/* the share link + copy affordance: the frame people screenshot */}
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono)] text-[19px] text-[var(--color-on-dark)] opacity-90">
          {SHARE}
        </span>
        <span
          className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--color-on-dark)]"
          style={{
            background: copied
              ? "var(--color-accent)"
              : "var(--color-on-dark-glass-strong)",
            border: "1px solid var(--color-on-dark-hairline)",
          }}
        >
          {copied ? (
            <motion.svg
              key="tick"
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SMOOTH}
            >
              <path
                d="M2.5 7.5L5.5 10.5L11.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              style={{ opacity: 0.7 }}
            >
              <rect
                x="3.5"
                y="3.5"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M2 9V2.5C2 2 2.4 1.5 3 1.5H9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}
