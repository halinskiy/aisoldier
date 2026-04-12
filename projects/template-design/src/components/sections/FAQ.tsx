"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { SectionHeader } from "@kit/components/section/SectionHeader";
import { EASE_OUT } from "@kit/lib/motion";

import copy from "@content/copy.json";
import faqJson from "@content/faq.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/FAQ.tsx";

type FAQEntry = (typeof faqJson)[number];

/**
 * Placeholder copy the designer left in Figma for items without a real answer.
 * Used for 6 of 7 items (all except #2 "How are you compensated?").
 * Flagged in HANDOFF.md as 🟡 #16 — client to provide real answers.
 */
const ANSWER_PLACEHOLDER =
  "We help expert investors optimize their portfolios not by chasing trends, but by building structure. Every engagement starts with a comprehensive analysis of your assets and risk tolerance.";

/**
 * Section 10 — FAQ accordion.
 *
 * Note on motion: this section uses **interaction** animation (expand/collapse)
 * which is NOT covered by the "motion deferred" ADR. That ADR only defers
 * scroll-linked reveals and entry animations. Interactions ship live.
 *
 * Narrow editorial answer column:
 *   On ≥lg the question row is full-container-width but the answer column is
 *   capped at 501px. This is a deliberate editorial pacing choice from the
 *   Figma — full-bleed for the click target, narrow column for the read.
 *   DO NOT "improve" by making the answer column full-width on desktop.
 *   On mobile it expands naturally.
 */
export function FAQ() {
  const { faq } = copy;
  const items = faqJson as FAQEntry[];

  return (
    <section
      id="faq"
      data-component="FAQ"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,font-serif"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="stacked"
          eyebrow={faq.eyebrow}
          headline={faq.headline}
          dataSource={DATA_SOURCE}
        />

        <FAQAccordion items={items} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FAQAccordion({ items }: { items: FAQEntry[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <ul
      data-component="FAQAccordion"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-text,color-text-muted,font-serif"
      data-motion="blur-reveal"
      className="mt-16 border-b border-[var(--color-border)] lg:mt-20"
    >
      {items.map((item) => (
        <FAQItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </ul>
  );
}

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answer = item.answer ?? ANSWER_PLACEHOLDER;
  const isReal = item.status === "approved";

  return (
    <li
      data-component="FAQItem"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-text,color-text-muted,font-serif"
      data-faq-id={item.id}
      data-faq-open={isOpen ? "true" : "false"}
      className="border-t border-[var(--color-border)]"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-[var(--color-accent)] md:py-8 lg:py-10"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <h3
          className="font-serif font-normal text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-accent)]"
          style={{
            fontSize: "clamp(20px, 2.2vw, 26px)",
            lineHeight: "1.2",
            letterSpacing: "-0.018em",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {item.question}
        </h3>
        <ChevronToggle isOpen={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={`faq-panel-${item.id}`}
            data-component="FAQAnswer"
            data-source={DATA_SOURCE}
            data-tokens="color-text-muted,font-sans"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="max-w-none pb-6 lg:max-w-[560px] lg:pb-10">
              <p className="text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
                {answer}
              </p>
              {!isReal && (
                <p className="mt-3 text-[12px] uppercase tracking-[0.062em] text-[var(--color-text-faint)]">
                  Placeholder answer — client to confirm
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function ChevronToggle({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)] transition-[transform,border-color,background-color,color] duration-300"
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        borderColor: isOpen ? "var(--color-accent)" : undefined,
        color: isOpen ? "var(--color-accent)" : undefined,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <path
          d="M3 5 L7 9 L11 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
