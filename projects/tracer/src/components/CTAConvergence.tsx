"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  CTAConvergence (B2 payoff convergence)                                    */
/* -------------------------------------------------------------------------- */
/**
 * The closing CTA as the narrative climax: the whole hero chain re-staged ONE
 * final time and collapsing into the live share-link pill beside the Download
 * button. Plays ONCE on scroll-into-view, then rests. The record-red dot is the
 * protagonist's last journey:
 *
 *   beat 1  dot arrives, pulsing live (the dot travels in from the heading side).
 *   beat 2  dot blooms into the file-capture card (content morph, blur seam).
 *   beat 3  card morphs into the ~/Dropbox/Tracer/ folder + red sync dot.
 *   beat 4  folder resolves into the live tracer.nocorny.com/v/k7r2-mx9p link
 *           pill that comes to rest directly beside the Download button.
 *           After 1.5s the pill's copy affordance auto-morphs to a red tick.
 *
 * Rest state (permanent): the live link pill + the Download button + the note
 * line. Only the ambient drift (the section supplies it) and the pill's copy
 * interaction remain alive. Reuses HeroMorphStage's visual vocabulary but is a
 * distinct composition. Gated by useEnhancementEnabled; static mode lands on the
 * rest state (link pill with red tick beside Download). CLS 0.
 *
 * Project-local custom embed (HANDOFF.md). Geist Mono only for the link string.
 */

const PATH = "~/Dropbox/Tracer/";
const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

const SPRING = { type: "spring" as const, stiffness: 160, damping: 21, mass: 0.9 };
const SMOOTH = { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] as const };

const STAGE_H = 132;

type Beat = 1 | 2 | 3 | 4;

export function CTAConvergence({
  downloadLabel,
  downloadHref,
}: {
  downloadLabel: string;
  downloadHref: string;
}) {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });
  const prefersReduced = useReducedMotion();
  const live = enhance && !prefersReduced;

  const ref = useRef<HTMLDivElement>(null);
  // Static fallback rests on beat 4 with the tick shown.
  const [beat, setBeat] = useState<Beat>(4);
  const [ticked, setTicked] = useState(true);
  const [copied, setCopied] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!live) {
      setBeat(4);
      setTicked(true);
      return;
    }
    setBeat(1);
    setTicked(false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  useEffect(() => {
    if (!started || !live) return;
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(setTimeout(() => mounted && fn(), ms));
    at(500, () => setBeat(2));
    at(1100, () => setBeat(3));
    at(1700, () => setBeat(4));
    at(3200, () => setTicked(true)); // auto-tick ~1.5s after the pill rests
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [started, live]);

  const dotVisible = beat === 1;
  const captureVisible = beat === 2;
  const folderVisible = beat === 3;
  const pillVisible = beat === 4;

  const onCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${SHARE}`).catch(() => {});
    }
    setCopied(true);
    setTicked(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex flex-col items-start gap-8">
      {/* the convergence stage: dot -> capture -> folder -> (pill handed off below) */}
      <div ref={ref} className="relative w-full" style={{ minHeight: STAGE_H }}>
        {/* beat 1: the dot arrives, pulsing */}
        <motion.span
          className="absolute left-0 top-1/2 z-[2] h-[16px] w-[16px] -translate-y-1/2 rounded-full"
          style={{ background: "var(--color-accent)" }}
          initial={false}
          animate={{
            opacity: dotVisible ? 1 : 0,
            x: dotVisible ? 0 : -32,
            filter: dotVisible ? "blur(0px)" : "blur(2px)",
          }}
          transition={SPRING}
          aria-hidden
        >
          {live && dotVisible && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--color-accent)" }}
              animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.span>

        {/* beat 2: file-capture card */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          initial={false}
          animate={{
            opacity: captureVisible ? 1 : 0,
            x: captureVisible ? 0 : beat < 2 ? -24 : 24,
            filter: captureVisible ? "blur(0px)" : "blur(2px)",
          }}
          transition={SPRING}
          aria-hidden
        >
          <CaptureCard />
        </motion.div>

        {/* beat 3: Dropbox folder + sync dot */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          initial={false}
          animate={{
            opacity: folderVisible ? 1 : 0,
            x: folderVisible ? 0 : beat < 3 ? -20 : 20,
            filter: folderVisible ? "blur(0px)" : "blur(2px)",
          }}
          transition={SPRING}
          aria-hidden
        >
          <DropboxFolder />
        </motion.div>

        {/* beat 4: the resolved row - link pill beside the Download button */}
        <motion.div
          className="absolute left-0 top-1/2 flex w-full -translate-y-1/2 flex-wrap items-center gap-4"
          initial={false}
          animate={{
            opacity: pillVisible ? 1 : 0,
            y: pillVisible ? "-50%" : "-40%",
            filter: pillVisible ? "blur(0px)" : "blur(2px)",
          }}
          transition={SPRING}
          style={{ pointerEvents: pillVisible ? "auto" : "none" }}
        >
          <a
            href={downloadHref}
            className="inline-flex shrink-0 items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-7 py-3.5 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
          >
            {downloadLabel}
          </a>

          <LinkPill ticked={ticked} copied={copied} onCopy={onCopy} />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function LinkPill({
  ticked,
  copied,
  onCopy,
}: {
  ticked: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-[var(--radius-pill)] py-2.5 pl-5 pr-2.5"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline-strong)",
      }}
    >
      <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-90">
        {SHARE}
      </span>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-button)] text-[var(--color-on-dark)] transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-out)] active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
        style={{
          background: ticked ? "var(--color-accent)" : "var(--color-on-dark-glass-strong)",
          border: "1px solid var(--color-on-dark-hairline)",
        }}
      >
        {ticked ? (
          <motion.svg
            key="tick"
            width="16"
            height="16"
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
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden style={{ opacity: 0.7 }}>
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M2 9V2.5C2 2 2.4 1.5 3 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

function CaptureCard() {
  return (
    <div
      className="flex items-center gap-4 rounded-[var(--radius-window)] px-5 py-4"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
        minWidth: 260,
      }}
    >
      <span
        className="h-[13px] w-[13px] shrink-0 rounded-full"
        style={{ background: "var(--color-accent)" }}
      />
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[10, 18, 8, 22, 14, 20, 9, 16].map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-[var(--color-on-dark)] opacity-50"
            style={{ height: h }}
          />
        ))}
      </span>
      <span className="ml-1 font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-70">
        recording.mp4
      </span>
    </div>
  );
}

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

function DropboxFolder() {
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
      <span className="font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-on-dark)] opacity-80">
        {PATH}
      </span>
      <span
        className="ml-1 h-[8px] w-[8px] rounded-full"
        style={{ background: "var(--color-accent)" }}
        aria-hidden
      />
    </div>
  );
}
