"use client";

import { useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";

import { BlurReveal } from "@kit/components/motion/BlurReveal";
import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Hero.tsx";

const BookScene = dynamic(
  () => import("@/components/3d/BookScene").then((m) => m.BookScene),
  { ssr: false }
);

export function Hero() {
  const { hero } = copy;

  const coverAngle = useMotionValue(0);
  const bookRotY = useMotionValue(0);
  const spinning = useMotionValue(1);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const rotY = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    rotY.current += dx * 0.008;
    bookRotY.set(rotY.current);
  }, [bookRotY]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <section
      id="book-hero"
      data-component="Hero"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-bg,color-text,color-text-muted,font-serif,ease-out"
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      <div className="mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 items-start gap-12 px-6 md:px-8 lg:px-10 lg:grid-cols-2 lg:gap-16" style={{ paddingTop: "104px" }}>
        {/* 3D Book */}
        <div
          className="relative h-[48dvh] w-full min-h-[300px] lg:h-[78dvh] lg:min-h-[480px] select-none overflow-hidden rounded-[12px]"
          style={{
            cursor: "grab",
            backgroundColor: "rgba(0,0,0,0.04)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <BookScene coverAngle={coverAngle} bookRotY={bookRotY} spinning={spinning} />
        </div>

        {/* Text column — centred vertically against the book height */}
        <div className="flex flex-col gap-5 lg:gap-6 lg:self-center">
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
              <Button href={hero.cta_primary.href} variant="primary" size="lg">
                {hero.cta_primary.label}
              </Button>
              <Button href={hero.cta_secondary.href} variant="secondary" size="lg" trailingDot={false}>
                {hero.cta_secondary.label}
              </Button>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.36}>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
              <span>{hero.book_genre}</span>
              <MetaDot />
              <span>{hero.book_pub_date}</span>
              <MetaDot />
              <span>Edinburgh</span>
            </div>
          </BlurReveal>
        </div>
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
