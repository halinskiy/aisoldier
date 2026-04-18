"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "../../lib/cn";
import { EASE_OUT } from "../../lib/motion";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type StickyFeatureItemData = {
  number: string;
  title: string;
  body: string;
  /** Optional ReactNode rendered in the sticky visual panel when this item is active. */
  visual?: ReactNode;
};

export type StickyFeatureListProps = {
  items: StickyFeatureItemData[];
  /** Optional header rendered above the sticky layout (e.g. SectionHeader output). */
  header?: ReactNode;
  /** Default sticky visual (rendered when no item-specific visual is provided). */
  defaultVisual?: ReactNode;
  /** Override styles on the sticky card container. */
  cardStyle?: React.CSSProperties;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT =
  "ui-kit/components/section/StickyFeatureList.tsx";

/* -------------------------------------------------------------------------- */
/*  Context — lets <StickyFeatureItem> announce itself to the parent.          */
/* -------------------------------------------------------------------------- */

type Ctx = {
  register: (index: number) => void;
  activeIndex: number;
};

const StickyFeatureCtx = createContext<Ctx | null>(null);

/* -------------------------------------------------------------------------- */
/*  StickyFeatureList — the pinned-visual + scrolling-list wrapper.            */
/* -------------------------------------------------------------------------- */

/**
 * Pinned-left-visual + scrolling-right-list pattern (Apple / Linear / Stripe).
 *
 * The left column is `position: sticky`; the right column is a long flow of
 * `StickyFeatureItem`s. Each item reports its own intersection-state, and the
 * list tracks the most-visible item index. The sticky visual cross-fades via
 * `<AnimatePresence mode="wait">`.
 *
 * Responsive: collapses to a single stacked column below `lg`.
 */
export function StickyFeatureList({
  items,
  header,
  defaultVisual,
  cardStyle,
  className,
  dataSource,
}: StickyFeatureListProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const register = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, []);

  const activeItem = items[activeIndex] ?? items[0];
  const visual = activeItem?.visual ?? defaultVisual;

  return (
    <section
      data-component="StickyFeatureList"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-border,color-text,color-text-muted,color-accent,font-serif,ease-out"
      className={cn("relative w-full", className)}
    >
      {header && <div className="mb-14 lg:mb-20">{header}</div>}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Sticky visual panel */}
        <div className="relative">
          <div className="lg:sticky" style={{ top: "119px" }}>
            <div
              className="relative w-full overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)]"
              style={{
                aspectRatio: "4/5",
                ...cardStyle,
                backgroundImage:
                  "radial-gradient(circle, rgba(33,33,33,0.1) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                  className="absolute inset-0"
                >
                  {visual ?? (
                    <DefaultChapterVisual
                      number={activeItem?.number ?? "01"}
                      title={activeItem?.title ?? ""}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <ul className="mt-6 flex items-center gap-2" aria-hidden>
              {items.map((_, i) => (
                <li
                  key={i}
                  className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor:
                      i === activeIndex
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Scroll list */}
        <StickyFeatureCtx.Provider value={{ register, activeIndex }}>
          <ol className="flex w-full min-w-0 flex-col">
            {items.map((item, i) => (
              <StickyFeatureItem
                key={item.number + i}
                index={i}
                {...item}
                isLast={i === items.length - 1}
              />
            ))}
          </ol>
        </StickyFeatureCtx.Provider>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  StickyFeatureItem — one row in the scrolling list.                         */
/* -------------------------------------------------------------------------- */

function StickyFeatureItem({
  index,
  number,
  title,
  body,
  isLast,
}: StickyFeatureItemData & { index: number; isLast: boolean }) {
  const ctx = useContext(StickyFeatureCtx);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!ctx) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ctx.register(index);
          }
        }
      },
      {
        // Activate the item when roughly the middle of the viewport hits it
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ctx, index]);

  const active = ctx?.activeIndex === index;

  return (
    <li
      ref={ref}
      data-component="StickyFeatureItem"
      data-source="ui-kit/components/section/StickyFeatureList.tsx"
      data-tokens="color-text,color-text-muted,color-accent,color-border,font-serif"
      data-active={active ? "true" : "false"}
      className={cn(
        "relative flex flex-col gap-3 py-10 pl-8 transition-[border-color,opacity] duration-500",
        !isLast && "border-b border-[var(--color-border)]",
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Accent active-bar on the left */}
      <span
        aria-hidden
        className="absolute left-0 top-10 block h-10 w-[3px] rounded-full transition-colors duration-500"
        style={{
          backgroundColor: active
            ? "var(--color-accent)"
            : "transparent",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <span
        className={cn(
          "font-sans text-[12px] font-medium uppercase leading-[1.2] tracking-[0.062em] transition-colors duration-500",
        )}
        style={{
          color: active
            ? "var(--color-accent)"
            : "var(--color-text-subtle)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        Chapter {number}
      </span>

      <h3
        className="font-serif font-medium text-[var(--color-text)] transition-opacity duration-500"
        style={{
          fontSize: "clamp(24px, 2.6vw, 36px)",
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
          opacity: active ? 1 : 0.72,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {title}
      </h3>

      <p
        className="text-[16px] leading-[1.6] transition-opacity duration-500"
        style={{
          color: "var(--color-text-muted)",
          opacity: active ? 1 : 0.75,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {body}
      </p>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Default sticky visual — a minimal book-spine / chapter-card illustration.  */
/* -------------------------------------------------------------------------- */

function DefaultChapterVisual({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8">
      {/* Top: eyebrow row */}
      <div className="flex items-center justify-between font-sans text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
        <span>Inside</span>
        <span>{number}</span>
      </div>

      {/* Middle: chapter number in oversized serif */}
      <div className="flex items-center justify-center">
        <span
          className="font-serif font-medium"
          style={{
            color: "var(--color-accent)",
            fontSize: "clamp(128px, 18vw, 240px)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {number}
        </span>
      </div>

      {/* Book-spine hint — stacked vertical lines on the right edge */}
      <div className="pointer-events-none absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-[6px]" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="block h-[2px] w-[60px] rounded-full bg-[var(--color-border-strong)]"
            style={{ opacity: 0.4 + (i % 4) * 0.15 }}
          />
        ))}
      </div>

      {/* Bottom: title */}
      <p
        className="max-w-[360px] font-serif italic text-[var(--color-text-muted)]"
        style={{ fontSize: "20px", lineHeight: 1.3 }}
      >
        {title}
      </p>
    </div>
  );
}
