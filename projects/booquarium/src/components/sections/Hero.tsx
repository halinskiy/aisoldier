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
              <Button href={`${BASE}${hero.cta_primary.href}`} variant="primary" size="lg" trailingDot={false}>
                {hero.cta_primary.label}
              </Button>
              <Button
                href={hero.cta_secondary.href}
                variant="accent"
                size="lg"
                className="!text-white"
                trailingIcon={<span aria-hidden style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "white", flexShrink: 0 }} />}
              >
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

function ComicBadge({ href }: { href: string }) {
  return (
    <motion.a
      href="https://www.etsy.com/uk/shop/TheBookVeil?ref=shop_profile&listing_id=4311692197"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book cover template — 30% off on Etsy"
      initial={{ scale: 0, rotate: 8 }}
      animate={{ scale: 1, rotate: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22, delay: 1.1 }}
      whileHover={{ scale: 1.07, rotate: 1, transition: { type: "spring", stiffness: 360, damping: 20 } }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: "absolute",
        bottom: "clamp(14px, 4%, 28px)",
        left: "clamp(14px, 4%, 28px)",
        zIndex: 10,
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
        width: "clamp(110px, 11vw, 136px)",
        height: "clamp(110px, 11vw, 136px)",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "#FDF4F3",
        border: "1.5px dashed rgba(184,50,44,0.55)",
        boxShadow: "0 3px 18px rgba(184,50,44,0.13), 0 1px 4px rgba(0,0,0,0.07)",
        padding: "12px",
      }}
    >
      <span style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(184,50,44,0.6)",
        lineHeight: 1,
      }}>cover template</span>
      <span style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "30px",
        fontWeight: 800,
        color: "#B8322C",
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>30%</span>
      <span style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "#B8322C",
        lineHeight: 1,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}>off</span>
      <span style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "10px",
        fontWeight: 400,
        color: "rgba(184,50,44,0.45)",
        lineHeight: 1,
        marginTop: "1px",
      }}>on Etsy</span>
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
