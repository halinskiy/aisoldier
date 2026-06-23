"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";

/* -------------------------------------------------------------------------- */
/*  TravelingDot + TruthRail                                                  */
/* -------------------------------------------------------------------------- */
/**
 * The ownership "seal": a single record-red dot enters at the top of a vertical
 * rail and travels DOWN it on scroll-into-view, lighting each row's leading dot
 * (hollow ring -> filled accent) as it passes, then dissolves. Plays ONCE, rests
 * with every row dot lit. The dot motif as the thing that "signs off" each
 * guarantee.
 *
 * Each row reveals (blur + rise) timed to the dot's arrival. Gated by
 * useEnhancementEnabled; static mode (reduced-motion / ?motion=0 / SSR) renders
 * every row visible with its dot lit, no travel. CLS 0.
 *
 * Project-local; kit promotion deferred until a second traveling-rail use
 * (HANDOFF.md).
 */

export type TruthRow = { label: string; detail: string };

const STEP_MS = 520; // time the dot spends reaching each successive row

export function TruthRail({ rows }: { rows: TruthRow[] }) {
  const enhance = useEnhancementEnabled({ minWidth: 768 });
  const prefersReduced = useReducedMotion();
  const live = enhance && !prefersReduced;

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [started, setStarted] = useState(false);
  // -1 = not started; >=0 = the highest row index the dot has reached (lit).
  const [reached, setReached] = useState(live ? -1 : rows.length - 1);
  const [dotY, setDotY] = useState<number | null>(null);
  const [dotGone, setDotGone] = useState(!live);

  // Trigger once when the rail scrolls into view.
  useEffect(() => {
    if (!live) {
      setReached(rows.length - 1);
      setDotGone(true);
      return;
    }
    const el = containerRef.current;
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
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live, rows.length]);

  // Walk the dot down the rows once started.
  useEffect(() => {
    if (!started || !live) return;
    let i = 0;
    const positionAt = (idx: number) => {
      const row = rowRefs.current[idx];
      const container = containerRef.current;
      if (!row || !container) return;
      const top = row.offsetTop + row.offsetHeight / 2;
      setDotY(top);
    };
    // start the dot at the first row
    positionAt(0);
    setReached(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const advance = () => {
      i += 1;
      if (i < rows.length) {
        positionAt(i);
        setReached(i);
        timers.push(setTimeout(advance, STEP_MS));
      } else {
        // dissolve after lighting the last row
        timers.push(
          setTimeout(() => setDotGone(true), 260),
        );
      }
    };
    timers.push(setTimeout(advance, STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [started, live, rows.length]);

  return (
    <div ref={containerRef} className="relative">
      {/* the rail line */}
      <span
        className="pointer-events-none absolute left-[6px] top-0 h-full w-px"
        style={{ background: "var(--color-on-dark-hairline)" }}
        aria-hidden
      />
      {/* the traveling dot */}
      {live && !dotGone && dotY !== null && (
        <motion.span
          className="pointer-events-none absolute left-[6px] z-[2] h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--color-accent)" }}
          initial={false}
          animate={{ top: dotY, opacity: dotGone ? 0 : 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.9 }}
          aria-hidden
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--color-accent)" }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.span>
      )}

      <div className="flex flex-col">
        {rows.map((row, i) => {
          const lit = reached >= i;
          return (
            <motion.div
              key={row.label}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="grid grid-cols-1 gap-2 border-t border-white/10 py-7 first:border-t-0 md:grid-cols-12 md:gap-6"
              initial={live ? { opacity: 0, y: 14, filter: "blur(2px)" } : false}
              animate={
                live && lit ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
              }
              transition={{ duration: 0.5, ease: [0.34, 1.42, 0.5, 1] }}
              style={!live ? { opacity: 1 } : undefined}
            >
              {/* label column with the leading row dot */}
              <div className="flex items-start gap-4 md:col-span-6">
                <span
                  className="mt-[6px] h-[14px] w-[14px] shrink-0 rounded-full transition-colors duration-300 [transition-timing-function:var(--ease-out)]"
                  style={{
                    background: lit ? "var(--color-accent)" : "transparent",
                    border: lit
                      ? "1px solid var(--color-accent)"
                      : "1.5px solid var(--color-on-dark-hairline-strong)",
                  }}
                  aria-hidden
                />
                <span
                  className="font-[family-name:var(--font-display)] font-semibold text-white/90"
                  style={{ fontSize: "var(--text-body-lg)", lineHeight: 1.3 }}
                >
                  {row.label}
                </span>
              </div>
              {/* detail column */}
              <p className="font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-white/50 md:col-span-6">
                {row.detail}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
