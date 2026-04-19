"use client";

import { motion, useMotionValue } from "framer-motion";
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

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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

  const onPointerLeave = useCallback(() => {
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
      <div
        className="mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 items-start gap-12 px-6 md:px-8 lg:px-10 lg:grid-cols-2 lg:gap-16"
        style={{ paddingTop: "104px" }}
      >
        {/* 3D Book */}
        <div
          className="relative h-[48dvh] w-full min-h-[300px] lg:h-[78dvh] lg:min-h-[480px] select-none overflow-hidden rounded-[12px]"
          style={{ cursor: "grab", backgroundColor: "rgba(0,0,0,0.04)" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
        >
          <BookScene coverAngle={coverAngle} bookRotY={bookRotY} spinning={spinning} />
          <ComicBadge href={copy.nav.cta.href} />
        </div>

        {/* Text column — explicit lg height matches book so justify-center midpoints align */}
        <div className="flex flex-col gap-5 lg:h-[78dvh] lg:min-h-[480px] lg:justify-center lg:gap-6">
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
              <Button href={`${BASE}${hero.cta_primary.href}`} variant="primary" size="lg">
                {hero.cta_primary.label}
              </Button>
              <Button href={hero.cta_secondary.href} variant="secondary" size="lg" trailingDot={false}>
                {hero.cta_secondary.label}
              </Button>
            </div>
          </BlurReveal>

          <BlurReveal delay={0.36}>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-medium uppercase tracking-[0.062em] text-[var(--color-text-subtle)]">
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

// 16-point starburst — outer r=95, inner r=62, viewBox 200×200
const BURST =
  "100,5 123.7,42.7 167.2,32.8 157.3,76.3 195,100 157.3,123.7 " +
  "167.2,167.2 123.7,157.3 100,195 76.3,157.3 32.8,167.2 42.7,123.7 " +
  "5,100 42.7,76.3 32.8,32.8 76.3,42.7";

function ComicBadge({ href }: { href: string }) {
  return (
    <motion.a
      href="https://www.etsy.com/uk/shop/TheBookVeil?ref=shop_profile&listing_id=4311692197"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy book cover template — 30% off"
      initial={{ scale: 0, rotate: -18 }}
      animate={{ scale: 1, rotate: -8 }}
      transition={{ type: "spring", stiffness: 360, damping: 16, delay: 1.1 }}
      whileHover={{ scale: 1.13, rotate: -4, transition: { type: "spring", stiffness: 400, damping: 18 } }}
      whileTap={{ scale: 0.93 }}
      style={{
        position: "absolute",
        bottom: "clamp(14px, 4%, 28px)",
        right: "clamp(14px, 4%, 28px)",
        zIndex: 10,
        textDecoration: "none",
        display: "block",
        width: "clamp(140px, 15vw, 176px)",
        height: "clamp(140px, 15vw, 176px)",
        cursor: "pointer",
        filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.22))",
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible" aria-hidden>
        {/* Burst fill */}
        <polygon points={BURST} fill="#FFD700" />
        {/* Inner burst border for comic depth */}
        <polygon points={BURST} fill="none" stroke="#E5A800" strokeWidth="3" />

        {/* "30%" */}
        <text
          x="100" y="82"
          textAnchor="middle"
          fill="#1A1A1A"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="52"
          letterSpacing="-2"
        >
          30%
        </text>

        {/* "OFF!" */}
        <text
          x="100" y="116"
          textAnchor="middle"
          fill="#B8322C"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="34"
          letterSpacing="1"
        >
          OFF!
        </text>

        {/* "book cover" */}
        <text
          x="100" y="142"
          textAnchor="middle"
          fill="#1A1A1A"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="20"
        >
          book cover
        </text>
      </svg>

      {/* Continuous subtle pulse ring */}
      <style>{`
        @keyframes comic-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        .comic-badge-inner { animation: comic-pulse 2.8s ease-in-out infinite; transform-origin: center; }
      `}</style>
    </motion.a>
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
