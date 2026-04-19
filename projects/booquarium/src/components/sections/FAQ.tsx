"use client";

/**
 * @deprecated The accordion logic in this section has been promoted to the
 * kit at `@ui-kit/components/section/FAQAccordion` (FAQAccordion + FAQItem).
 * When this section is next touched, refactor to call:
 *
 *   <FAQAccordion items={faq.items.map(i => ({ question: i.q, answer: i.a }))} />
 *
 * and drop the local FAQItem below. Leaving this section intact for now —
 * any refactor should be scoped so the kit promotion and the booquarium
 * rewrite don't land in the same commit.
 */
import { useState } from "react";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/FAQ.tsx";

export function FAQ() {
  const { faq } = copy;

  return (
    <section
      id="faq"
      data-component="FAQ"
      data-source={DATA_SOURCE}
      data-tokens="color-surface,color-border,color-text,color-text-muted,font-serif,ease-out"
      className="relative w-full bg-[var(--color-surface)]"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: header */}
          <div className="flex flex-col gap-4">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
              {faq.eyebrow}
            </span>
            <h2
              className="font-serif font-medium text-[var(--color-text)]"
              style={{
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
              }}
            >
              {faq.headline}
            </h2>
          </div>

          {/* Right: accordion */}
          <div className="flex flex-col">
            {faq.items.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} isLast={i === faq.items.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-component="FAQItem"
      data-source={DATA_SOURCE}
      className={`border-t border-[var(--color-border)] ${isLast ? "border-b" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-opacity duration-150 hover:opacity-70"
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        aria-expanded={open}
      >
        <span
          className="font-serif font-medium text-[var(--color-text)]"
          style={{ fontSize: "clamp(17px, 1.4vw, 20px)", lineHeight: 1.3 }}
        >
          {q}
        </span>
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-transform duration-300"
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="overflow-hidden">
          <p
            className="pb-5 text-[16px] leading-[1.65] text-[var(--color-text-muted)]"
            style={{ maxWidth: "520px" }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
