"use client";

import { useRef, useEffect } from "react";
import { useScroll } from "framer-motion";

import { BlurReveal } from "@kit/components/motion/BlurReveal";
import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { useBookContext, OPEN_ANGLE } from "@/contexts/BookContext";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Hero.tsx";

export function Hero() {
  const { hero } = copy;
  const heroRef = useRef<HTMLElement>(null);
  const { setBookState } = useBookContext();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Init book state when Hero mounts
  useEffect(() => {
    setBookState({ x: -0.8, scale: 1.0, coverAngle: 0, bookRotY: 0, pageIndex: 0 });
  }, [setBookState]);

  // Scroll 0→0.6 opens cover; hold open beyond 0.6
  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      const angle = p < 0.6 ? (p / 0.6) * OPEN_ANGLE : OPEN_ANGLE;
      setBookState({ coverAngle: angle });
    });
  }, [scrollYProgress, setBookState]);

  return (
    <section
      ref={heroRef}
      id="book-hero"
      data-component="Hero"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-bg,color-text,color-text-muted,font-serif,ease-out"
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      {/* Sticky viewport — pinned while user scrolls through 200vh */}
      <div
        className="sticky top-0 flex h-[100dvh] w-full items-center overflow-hidden"
        style={{ paddingTop: "113px" }}
      >
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
          {/*
            Desktop: text in right half — book (from fixed BookCanvas) occupies left half.
            Mobile:  text is full width — BookCanvas is hidden on mobile.
          */}
          <div className="relative z-20 lg:ml-[50%] lg:pl-8">
            <div className="flex flex-col gap-5 lg:gap-6">
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
                  <Button href={hero.cta_secondary.href} variant="secondary" size="lg">
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
