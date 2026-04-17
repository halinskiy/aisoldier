"use client";

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import { BlurReveal } from "@kit/components/motion/BlurReveal";
import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Hero.tsx";

/*
 * Scroll state machine (scrollYProgress 0 → 1 over 500vh):
 *
 *   0.00 – 0.05  front cover closed, camera settles
 *   0.05 – 0.30  cover opens  (coverAngle 0 → -120°)
 *   0.30 – 0.55  pages visible (coverAngle holds at -120°)
 *   0.55 – 0.80  cover closes (coverAngle -120° → 0°)
 *   0.80 – 1.00  book rotates Y 180° to show back cover
 *
 * Two MotionValues are passed to BookScene so R3F reads them in useFrame
 * without triggering React re-renders.
 */

const BookScene = dynamic(
  () => import("@/components/3d/BookScene").then((m) => m.BookScene),
  { ssr: false }
);

const OPEN_ANGLE = -Math.PI * 0.67; // -120° in radians

export function Hero() {
  const { hero } = copy;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Text column: compress + fade as user scrolls past mid-point
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.85], [1, 0]);

  // MotionValues for BookScene (read every frame in R3F useFrame)
  const coverAngle = useMotionValue(0);
  const bookRotY = useMotionValue(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (p) => {
      // Cover open phase: 0.05 → 0.30
      if (p <= 0.05) {
        coverAngle.set(0);
      } else if (p <= 0.30) {
        const t = (p - 0.05) / 0.25;
        coverAngle.set(t * OPEN_ANGLE);
      } else if (p <= 0.55) {
        coverAngle.set(OPEN_ANGLE);
      } else if (p <= 0.80) {
        // Cover closes
        const t = (p - 0.55) / 0.25;
        coverAngle.set(OPEN_ANGLE * (1 - t));
      } else {
        coverAngle.set(0);
      }

      // Book Y rotation (back cover reveal): 0.80 → 1.0
      if (p <= 0.80) {
        bookRotY.set(0);
      } else {
        const t = (p - 0.80) / 0.20;
        bookRotY.set(t * Math.PI);
      }
    });
    return () => unsub();
  }, [scrollYProgress, coverAngle, bookRotY]);

  return (
    <section
      id="book-hero"
      ref={containerRef}
      data-component="Hero"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-bg,color-text,color-text-muted,font-serif,ease-out"
      className="relative"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 items-center gap-8 px-6 md:px-10 lg:grid-cols-[58%_42%]">
          {/* 3D Book */}
          <div className="relative h-[52vh] w-full min-h-[340px] lg:h-[82vh] lg:min-h-[520px]">
            <BookScene coverAngle={coverAngle} bookRotY={bookRotY} />
          </div>

          {/* Text column */}
          <motion.div
            style={{ scale: textScale, opacity: textOpacity }}
            className="flex flex-col gap-5 lg:gap-6"
          >
            <BlurReveal delay={0.05}>
              <EyebrowLabel>{hero.eyebrow}</EyebrowLabel>
            </BlurReveal>

            <BlurReveal delay={0.1}>
              <h1
                className="font-serif font-medium text-[var(--color-text)]"
                style={{
                  fontSize: "clamp(44px, 6vw, 96px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                {hero.headline}
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.16}>
              <h2
                className="font-serif italic text-[var(--color-text-muted)]"
                style={{
                  fontSize: "clamp(20px, 2.2vw, 30px)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                }}
              >
                {hero.subheadline}
              </h2>
            </BlurReveal>

            <BlurReveal delay={0.22}>
              <p className="max-w-[440px] text-[16px] leading-[1.65] text-[var(--color-text-muted)]">
                {hero.body}
              </p>
            </BlurReveal>

            <BlurReveal delay={0.28}>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Button
                  href={hero.cta_primary.href}
                  variant="primary"
                  size="lg"
                >
                  {hero.cta_primary.label}
                </Button>
                <Button
                  href={hero.cta_secondary.href}
                  variant="secondary"
                  size="lg"
                >
                  {hero.cta_secondary.label}
                </Button>
              </div>
            </BlurReveal>

            <BlurReveal delay={0.36}>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
                <span>{hero.book_genre}</span>
                <MetaDot />
                <span>{hero.book_pub_date}</span>
                <MetaDot />
                <span>Edinburgh</span>
              </div>
            </BlurReveal>
          </motion.div>
        </div>

        {/* Scroll hint — fades out after first scroll */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]"
          aria-hidden
        >
          <span>Scroll to open</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
            <rect
              x="1" y="1" width="14" height="20" rx="7"
              stroke="currentColor" strokeWidth="1.5"
            />
            <motion.rect
              x="6.5" y="4" width="3" height="5" rx="1.5"
              fill="currentColor"
              animate={{ y: [4, 9, 4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function MetaDot() {
  return (
    <span
      aria-hidden
      className="inline-block h-[3px] w-[3px] rounded-full bg-[var(--color-text-subtle)]"
    />
  );
}
