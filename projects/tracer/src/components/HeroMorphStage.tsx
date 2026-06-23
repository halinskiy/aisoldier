"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  HeroMorphStage (V2)                                                        */
/* -------------------------------------------------------------------------- */
/**
 * The cinematic morph that performs Tracer's whole promise once on load, then
 * rests on ONE composed artifact. A single protagonist (the red record dot)
 * threads four honest states. V2 fixes the v1 "odd / half-static / shrinks to a
 * tiny object" read:
 *
 *   - ALIVE FROM FRAME 1. The record dot pulses and the REC timer ticks the
 *     instant the stage paints (gated only by useEnhancementEnabled, never
 *     deferred behind a setTimeout). Three things move before beat 2: dot,
 *     timer, and (in the section) the ambient drift.
 *   - NEVER SHRINKS. Every beat holds a confident, legible size. Morphs travel
 *     by POSITION + CONTENT + a blur(2px) cross-fade seam, never scale-from-0,
 *     never below a 0.92 scale floor. Beat 2 is a file-capture CARD of
 *     comparable footprint to the REC pill, not a condensed speck.
 *
 *   beat 1  REC       macOS recorder pill; red dot pulses live; timer 00:00->00:04.
 *   beat 2  CAPTURE   the pill becomes a file-capture card (waveform thumbnail),
 *                     same visual weight, sliding toward Dropbox under a blur seam.
 *   beat 3  DROPBOX   the card morphs into the ~/Dropbox/Tracer/ folder + red sync dot.
 *   beat 4  LINK      resolves into the resting share-link card (the screenshot frame),
 *                     copy affordance -> record-red tick.
 *
 * At rest (beat 4) exactly ONE element is on the stage: the share-link card.
 * The recorder pill, capture card and folder are transients gone once the story
 * ends. Gated by useEnhancementEnabled (>=1024, no reduced-motion, no ?motion=0):
 * when false the stage renders statically on the resting share-link card. CLS 0.
 *
 * Project-local custom embed (noted in HANDOFF.md). Geist Mono is used ONLY for
 * the timer, path label, and share-link string.
 */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

const SPRING = { type: "spring" as const, stiffness: 170, damping: 21, mass: 0.9 };
const SMOOTH = { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const };

const STAGE_H = 320;

type Beat = 1 | 2 | 3 | 4;

export function HeroMorphStage() {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });
  const prefersReduced = useReducedMotion();
  // SSR + static fallback land on the final state (resting share-link card).
  const [beat, setBeat] = useState<Beat>(4);
  const [timer, setTimer] = useState("00:04");
  const [copied, setCopied] = useState(true);
  // Alive flag: when enhanced, the dot pulses + timer ticks from frame 1.
  const live = enhance && !prefersReduced;

  useEffect(() => {
    if (!live) return;

    let mounted = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const at = (ms: number, fn: () => void) => {
      timeouts.push(setTimeout(() => mounted && fn(), ms));
    };

    // Start of the story: dot + timer alive immediately, no dead air.
    setBeat(1);
    setTimer("00:00");
    setCopied(false);

    // Timer ticks 00:00 -> 00:04 from frame 1 (no 400ms gate).
    let s = 0;
    const iv = setInterval(() => {
      if (!mounted) return;
      s += 1;
      setTimer(`00:0${Math.min(s, 4)}`);
      if (s >= 4) clearInterval(iv);
    }, 800);
    intervals.push(iv);

    // beat 2: pill becomes file-capture card, slides toward Dropbox
    at(3400, () => setBeat(2));
    // beat 3: card morphs into Dropbox folder + sync dot
    at(4500, () => setBeat(3));
    // beat 4: resolves into share-link card, copy -> red tick, rest
    at(5800, () => {
      setBeat(4);
      setCopied(true);
    });

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [live]);

  // Transients vs the resting frame. Each leaves the stage once its job is done.
  const recorderVisible = beat === 1;
  const captureVisible = beat === 2;
  const folderVisible = beat === 3;
  const linkVisible = beat === 4;

  return (
    <div
      className="relative mx-auto flex w-full max-w-[620px] items-center justify-center"
      style={{ minHeight: STAGE_H }}
      aria-hidden
    >
      {/* faint vertical thread tracing the journey */}
      <span
        className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-on-dark-hairline) 22%, var(--color-on-dark-hairline) 78%, transparent)",
        }}
      />

      {/* ===================== TRANSIENT: recorder pill (beat 1) =========== */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          opacity: recorderVisible ? 1 : 0,
          x: recorderVisible ? 0 : -40,
          y: recorderVisible ? -88 : -72,
          filter: recorderVisible ? "blur(0px)" : "blur(2px)",
        }}
        transition={SPRING}
        style={{ pointerEvents: "none" }}
      >
        <RecorderPill timer={timer} pulse={live && beat === 1} />
      </motion.div>

      {/* ===================== TRANSIENT: file-capture card (beat 2) ======= */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          opacity: captureVisible ? 1 : 0,
          x: captureVisible ? 0 : beat < 2 ? -36 : 36,
          y: captureVisible ? -36 : -16,
          filter: captureVisible ? "blur(0px)" : "blur(2px)",
        }}
        transition={SPRING}
        style={{ pointerEvents: "none" }}
      >
        <CaptureCard />
      </motion.div>

      {/* ===================== TRANSIENT: Dropbox folder (beat 3) ========== */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          opacity: folderVisible ? 1 : 0,
          x: folderVisible ? 0 : beat < 3 ? -28 : 28,
          y: folderVisible ? 0 : -12,
          filter: folderVisible ? "blur(0px)" : "blur(2px)",
        }}
        transition={SPRING}
        style={{ pointerEvents: "none" }}
      >
        <DropboxFolder syncing />
      </motion.div>

      {/* ===================== RESTING FRAME: share-link card (beat 4) ===== */}
      <motion.div
        className="absolute w-full max-w-[560px] px-2"
        initial={false}
        animate={{
          opacity: linkVisible ? 1 : 0,
          scale: linkVisible ? 1 : 0.94,
          y: linkVisible ? 24 : 40,
          filter: linkVisible ? "blur(0px)" : "blur(2px)",
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
      className="flex items-center gap-3 rounded-[var(--radius-pill)] px-5 py-3"
      style={{
        background: "var(--color-on-dark-glass-strong)",
        border: "1px solid var(--color-on-dark-hairline-strong)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      {/* the live record dot - the ONLY permitted infinite loop */}
      <span className="relative flex h-[13px] w-[13px] items-center justify-center">
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--color-accent)" }}
            animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <span
          className="relative h-[13px] w-[13px] rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[18px] tabular-nums text-[var(--color-on-dark)] opacity-60">
        {timer}
      </span>
      <span
        className="mx-1 h-[18px] w-px"
        style={{ background: "var(--color-on-dark-hairline-strong)" }}
      />
      <span className="font-[family-name:var(--font-display)] text-[18px] font-medium text-[var(--color-on-dark)] opacity-90">
        Recording
      </span>
      <span
        className="ml-1 flex h-[24px] w-[24px] items-center justify-center rounded-[var(--radius-button)]"
        style={{ border: "1px solid var(--color-on-dark-hairline-strong)" }}
      >
        <span className="h-[10px] w-[10px] rounded-[2px] bg-[var(--color-on-dark)] opacity-70" />
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Transient: file-capture card (beat 2). Same visual weight as the pill.    */
/* -------------------------------------------------------------------------- */

function CaptureCard() {
  return (
    <div
      className="flex items-center gap-4 rounded-[var(--radius-window)] px-5 py-4"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
        minWidth: 280,
      }}
    >
      {/* the protagonist red dot stays on the card as it travels */}
      <span
        className="h-[13px] w-[13px] shrink-0 rounded-full"
        style={{ background: "var(--color-accent)" }}
      />
      {/* a small waveform thumbnail: the recording, captured */}
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[10, 18, 8, 22, 14, 20, 9, 16].map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-[var(--color-on-dark)] opacity-50"
            style={{ height: h }}
          />
        ))}
      </span>
      <div className="ml-1 flex flex-col gap-1">
        <span className="font-[family-name:var(--font-display)] text-[16px] font-medium text-[var(--color-on-dark)] opacity-90">
          Capture saved
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-50">
          recording.mp4
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Transient: monochrome Dropbox folder, ~/Dropbox/Tracer/                   */
/* -------------------------------------------------------------------------- */

function DropboxGlyph() {
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
              initial={{ scale: 0.9, opacity: 0 }}
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
