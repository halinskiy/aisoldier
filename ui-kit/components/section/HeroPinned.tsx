"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "../../lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type HeroPinnedProps = {
  /** The display headline. ReactNode so consumers can build multi-line layouts. */
  title: ReactNode;
  /** Intro paragraph beneath the title. */
  lede?: ReactNode;
  /** Small-caps eyebrow above the title. Plain string — rendered into a <span>. */
  eyebrow?: string;
  /** Optional media/content that sits below the headline inside the pinned frame. */
  children?: ReactNode;
  /** Outer scroll-track height in viewport units. Default 200 (= 2 screens of scroll travel). */
  heightVh?: number;
  /** Maximum title font-size on first render (before scroll compression). Default uses display-xl clamp. */
  titleSizeStart?: string;
  /** Minimum title font-size after scroll. Default falls back to display-md clamp. */
  titleSizeEnd?: string;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/HeroPinned.tsx";

/* -------------------------------------------------------------------------- */
/*  HeroPinned                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Scroll-pinned hero — the single most-copied pattern of 2024-2026.
 *
 * Composition:
 *   - Outer container is `heightVh * 100vh` tall (default 200vh).
 *   - Inner `sticky` child pins to the viewport.
 *   - Framer Motion's `useScroll` maps scroll progress to the title's
 *     fontSize, creating a compression effect as the user scrolls.
 *   - The lede fades in around 30% progress.
 *
 * Respects `prefers-reduced-motion`: renders statically at the start
 * sizes with no scroll-linked transforms.
 */
export function HeroPinned({
  title,
  lede,
  eyebrow,
  children,
  heightVh = 200,
  titleSizeStart = "clamp(64px, 9vw, 140px)",
  titleSizeEnd = "clamp(36px, 4.5vw, 64px)",
  className,
  dataSource,
}: HeroPinnedProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Map 0..0.6 of progress onto titleStart → titleEnd, then hold.
  const fontSize = useTransform(
    scrollYProgress,
    [0, 0.6],
    [titleSizeStart, titleSizeEnd],
  );
  const ledeOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const ledeY = useTransform(scrollYProgress, [0.2, 0.45], [16, 0]);

  return (
    <section
      ref={ref}
      data-component="HeroPinned"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="color-bg,color-text,color-text-muted,font-serif,ease-out"
      className={cn("relative w-full", className)}
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
          <div className="flex flex-col gap-8">
            {eyebrow && (
              <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
                {eyebrow}
              </span>
            )}

            {prefersReduced ? (
              <h1
                className="font-serif font-medium text-[var(--color-text)]"
                style={{
                  fontSize: titleSizeStart,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                }}
              >
                {title}
              </h1>
            ) : (
              <motion.h1
                className="font-serif font-medium text-[var(--color-text)]"
                style={{
                  fontSize,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                }}
              >
                {title}
              </motion.h1>
            )}

            {lede &&
              (prefersReduced ? (
                <p
                  className="max-w-[640px] font-sans text-[var(--color-text-muted)]"
                  style={{ fontSize: "18px", lineHeight: 1.55 }}
                >
                  {lede}
                </p>
              ) : (
                <motion.p
                  className="max-w-[640px] font-sans text-[var(--color-text-muted)]"
                  style={{
                    opacity: ledeOpacity,
                    y: ledeY,
                    fontSize: "18px",
                    lineHeight: 1.55,
                  }}
                >
                  {lede}
                </motion.p>
              ))}

            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
