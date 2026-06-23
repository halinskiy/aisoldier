"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  FAQTwoCol                                                                 */
/* -------------------------------------------------------------------------- */
/**
 * Full-width two-column FAQ accordion (the V2 grid fix that retires the v1
 * centered-narrow single column). Questions split across two columns inside a
 * grid; hairline vertical divider between the columns and horizontal dividers
 * between rows. The open-state marker is the record-red dot: a closed row shows
 * a hollow ring to the left of the question; opening morphs the ring to a filled
 * accent dot under a blur seam, and the answer height-expands. ONE item open at
 * a time (single-open), mirroring the page's one-focal-point principle.
 *
 * State is lifted so single-open spans BOTH columns. Each trigger is a real
 * <button> with aria-expanded for accessibility; the panel uses Framer
 * AnimatePresence for the height + blur seam. Reduced-motion: instant open/close,
 * no morph. All text >= 16px.
 *
 * Project-local; promote on second use (HANDOFF.md).
 */

export type FAQItem = { question: string; answer: string };

const SMOOTH = { duration: 0.24, ease: [0.2, 0.8, 0.2, 1] as const };

export function FAQTwoCol({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const prefersReduced = useReducedMotion();

  // Sequential split: column A = first ceil(n/2), column B = the rest.
  const mid = Math.ceil(items.length / 2);
  const colA = items.slice(0, mid).map((it, i) => ({ ...it, id: i }));
  const colB = items.slice(mid).map((it, i) => ({ ...it, id: i + mid }));

  const renderColumn = (col: { question: string; answer: string; id: number }[]) => (
    <ul className="flex flex-col">
      {col.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id} className="border-t border-[var(--color-border)] first:border-t-0">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-start gap-4 py-6 text-left transition-colors duration-150 [transition-timing-function:var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              {/* ring -> filled record-red dot open marker */}
              <span
                className="mt-[5px] h-[14px] w-[14px] shrink-0 rounded-full transition-[background-color,border-color,filter] duration-200 [transition-timing-function:var(--ease-out)]"
                style={{
                  background: open ? "var(--color-accent)" : "transparent",
                  border: open
                    ? "1px solid var(--color-accent)"
                    : "1.5px solid var(--color-border-strong)",
                }}
                aria-hidden
              />
              <span className="flex-1 font-[family-name:var(--font-display)] text-[18px] font-semibold leading-[1.4] text-[var(--color-text)]">
                {item.question}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="answer"
                  initial={prefersReduced ? false : { height: 0, opacity: 0, filter: "blur(1px)" }}
                  animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                  exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0, filter: "blur(1px)" }}
                  transition={SMOOTH}
                  className="overflow-hidden"
                >
                  <p className="max-w-[52ch] pb-7 pl-[30px] pr-4 font-[family-name:var(--font-sans)] text-[16px] leading-[1.65] text-[var(--color-text-muted)]">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="lg:pr-12">{renderColumn(colA)}</div>
      {/* hairline divider between the columns on desktop */}
      <div className="lg:border-l lg:border-[var(--color-border)] lg:pl-12">
        {renderColumn(colB)}
      </div>
    </div>
  );
}
