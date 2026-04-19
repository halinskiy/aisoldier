"use client";

import { useMotionValue } from "framer-motion";
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

          {/* Upload button — top-right */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />
          <button
            type="button"
            data-no-drag
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: "absolute",
              top: "clamp(10px, 3%, 18px)",
              right: "clamp(10px, 3%, 18px)",
              zIndex: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
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
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
              <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="7" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5 3L5.8 1.5H8.2L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Тест Обложки
          </button>

          {/* Marquee strip — bottom of book container */}
          <EtsyMarquee />
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

const ETSY_HREF = "https://www.etsy.com/uk/shop/TheBookVeil?ref=shop_profile&listing_id=4311692197";
const TICKER_ITEM = "30% OFF · book cover template · ";
const TICKER_REPEAT = 6;

function EtsyMarquee() {
  return (
    <a
      href={ETSY_HREF}
      target="_blank"
      rel="noopener noreferrer"
      data-no-drag
      aria-label="Book cover template — 30% off on Etsy"
      style={{
        position: "absolute",
        bottom: "32px",
        left: 0,
        right: 0,
        zIndex: 10,
        display: "flex",
        overflow: "hidden",
        height: "28px",
        alignItems: "center",
        backgroundColor: "rgba(184,50,44,0.92)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <style>{`
        @keyframes etsy-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .etsy-ticker-inner {
          display: flex;
          white-space: nowrap;
          animation: etsy-ticker 40s linear infinite;
          will-change: transform;
        }
        .etsy-ticker-inner:hover { animation-play-state: paused; }
      `}</style>
      <div className="etsy-ticker-inner">
        {Array.from({ length: TICKER_REPEAT * 2 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "white",
              padding: "0 4px",
            }}
          >
            {TICKER_ITEM}
          </span>
        ))}
      </div>
    </a>
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
