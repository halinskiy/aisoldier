"use client";

import { motion, useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

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

  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomCoverUrl(url);
  }, []);

  const coverAngle = useMotionValue(0);
  const bookRotY = useMotionValue(0);
  const spinning = useMotionValue(1);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const rotY = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
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
          <BookScene coverAngle={coverAngle} bookRotY={bookRotY} spinning={spinning} customCoverUrl={customCoverUrl ?? undefined} />
          <ComicBadge href={copy.nav.cta.href} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: "none" }}
          />
          <button
            type="button"
            data-no-drag
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: "clamp(14px, 4%, 28px)",
              right: "clamp(14px, 4%, 28px)",
              zIndex: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(0,0,0,0.14)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#1a1a1a",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="7" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5 3L5.8 1.5H8.2L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Тест Обложки
          </button>
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
              <Button href={`${BASE}${hero.cta_primary.href}`} variant="primary" size="lg" trailingDot={false}>
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

// 8-point star; gooey SVG filter rounds all the tips
const BURST8 =
  "100,12 128,52 170,38 160,78 196,100 160,122 170,162 128,148 " +
  "100,188 72,148 30,162 40,122 4,100 40,78 30,38 72,52";

function ComicBadge({ href }: { href: string }) {
  return (
    <motion.a
      href="https://www.etsy.com/uk/shop/TheBookVeil?ref=shop_profile&listing_id=4311692197"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book cover template — 30% off"
      initial={{ scale: 0, rotate: -14 }}
      animate={{ scale: 1, rotate: -7 }}
      transition={{ type: "spring", stiffness: 340, damping: 18, delay: 1.1 }}
      whileHover={{ scale: 1.1, rotate: -3, transition: { type: "spring", stiffness: 400, damping: 18 } }}
      whileTap={{ scale: 0.93 }}
      style={{
        position: "absolute",
        bottom: "clamp(14px, 4%, 28px)",
        left: "clamp(14px, 4%, 28px)",
        zIndex: 10,
        textDecoration: "none",
        display: "block",
        width: "clamp(130px, 14vw, 158px)",
        height: "clamp(130px, 14vw, 158px)",
        cursor: "pointer",
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.2))",
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible" aria-hidden>
        <defs>
          <filter id="goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </defs>
        <g filter="url(#goo)">
          <polygon points={BURST8} fill="#FFD700" />
          <polygon points={BURST8} fill="none" stroke="#E8B800" strokeWidth="8" />
        </g>
        <text x="100" y="82" textAnchor="middle" fill="#1A1A1A"
          fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="50" letterSpacing="-2">
          30%
        </text>
        <text x="100" y="116" textAnchor="middle" fill="#B8322C"
          fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="33" letterSpacing="1">
          OFF!
        </text>
        <text x="100" y="142" textAnchor="middle" fill="#1A1A1A"
          fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="18">
          book cover
        </text>
      </svg>
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
