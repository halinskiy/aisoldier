"use client";

import Image from "next/image";
import { BlurReveal } from "@kit/components/motion/BlurReveal";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/FullBleedImage.tsx";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* ── book dimensions ── */
const W = 260;   // cover width
const H = 380;   // cover height
const S = 42;    // spine width (visible left face)
const P = 28;    // pages edge width (visible right face)

export function FullBleedImage() {
  const { hero, nav } = copy;

  return (
    <section
      id="full-bleed"
      data-component="FullBleedImage"
      data-source={DATA_SOURCE}
      data-tokens="color-accent,font-serif"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#faf5ee",
      }}
    >
      {/* ── Background patterns (cartographic theme) ── */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Radial map grid */}
          <pattern id="map-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(60,35,15,0.07)" strokeWidth="0.5" />
          </pattern>
          {/* Diagonal hatch */}
          <pattern id="hatch" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M-4,4 l8,-8 M0,32 l32,-32 M28,36 l8,-8" stroke="rgba(184,50,44,0.09)" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Base grid */}
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        {/* Diagonal accent hatch */}
        <rect width="100%" height="100%" fill="url(#hatch)" />

        {/* Concentric rings — compass rose centre, left-centre */}
        {[80, 160, 240, 320, 420, 540].map((r, i) => (
          <circle
            key={r}
            cx="22%" cy="55%"
            r={r}
            fill="none"
            stroke="rgba(60,35,15,0.1)"
            strokeWidth="0.6"
            strokeDasharray={i % 2 === 0 ? "4 8" : "none"}
          />
        ))}

        {/* Compass rose cross-hairs */}
        <line x1="22%" y1="0" x2="22%" y2="100%" stroke="rgba(60,35,15,0.07)" strokeWidth="0.5" />
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="rgba(60,35,15,0.07)" strokeWidth="0.5" />

        {/* 45° diagonal lines through compass centre */}
        <line x1="calc(22% - 600px)" y1="calc(55% - 600px)" x2="calc(22% + 600px)" y2="calc(55% + 600px)"
          stroke="rgba(60,35,15,0.05)" strokeWidth="0.5" />
        <line x1="calc(22% + 600px)" y1="calc(55% - 600px)" x2="calc(22% - 600px)" y2="calc(55% + 600px)"
          stroke="rgba(60,35,15,0.05)" strokeWidth="0.5" />

        {/* Small tick marks on largest ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const r = 540;
          const x1 = `calc(22% + ${Math.cos(angle) * r}px)`;
          const y1 = `calc(55% + ${Math.sin(angle) * r}px)`;
          const x2 = `calc(22% + ${Math.cos(angle) * (r - 14)}px)`;
          const y2 = `calc(55% + ${Math.sin(angle) * (r - 14)}px)`;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(60,35,15,0.13)" strokeWidth="0.8" />;
        })}

        {/* Warm red glow accent */}
        <radialGradient id="glow" cx="22%" cy="55%" r="40%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(184,50,44,0.12)" />
          <stop offset="100%" stopColor="rgba(184,50,44,0)" />
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#glow)" />

        {/* Faint text label — cartographic coordinates */}
        <text
          x="calc(22% - 42px)" y="calc(55% - 560px)"
          fill="rgba(60,35,15,0.2)" fontSize="10" fontFamily="monospace" letterSpacing="0.12em"
          textAnchor="middle"
        >
          55°57′N  3°11′W
        </text>
      </svg>

      {/* ── Content grid ── */}
      <div
        className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2 lg:gap-24 lg:px-10"
        style={{
          minHeight: "100dvh",
          paddingTop: "clamp(80px, 12vh, 140px)",
          paddingBottom: "clamp(80px, 12vh, 140px)",
        }}
      >
        {/* ── CSS 3D Book mockup ── */}
        <BlurReveal delay={0.05} className="flex items-center justify-center lg:justify-end">
          {/*
            Fold approach: front face sits at z=0. Spine and pages-edge
            are folded from the left/right edges using transform-origin.
            The whole book is rotated so spine + front + pages-edge are visible.
          */}
          <div style={{ perspective: "1200px", paddingLeft: S, paddingTop: 8 }}>
            <div
              style={{
                position: "relative",
                width: W,
                height: H,
                transformStyle: "preserve-3d",
                transform: "rotateX(6deg) rotateY(-28deg)",
                filter: "drop-shadow(-20px 28px 52px rgba(80,20,10,0.22)) drop-shadow(-4px 6px 12px rgba(0,0,0,0.14))",
              }}
            >
              {/* ── Front cover ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "1px 5px 5px 1px",
                  overflow: "hidden",
                  boxShadow: "inset -3px 0 8px rgba(0,0,0,0.12)",
                }}
              >
                <Image
                  src={`${BASE}/covers/spread.jpg`}
                  alt="The Cartographer's Daughter"
                  fill
                  sizes="320px"
                  style={{ objectFit: "cover", objectPosition: "right center" }}
                />
                {/* Subtle inner spine shadow */}
                <div style={{
                  position: "absolute", inset: 0, left: 0, width: 28,
                  background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
                  pointerEvents: "none",
                }} />
              </div>

              {/* ── Spine (left face) — folded from left edge ── */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: -S,
                  width: S,
                  height: H,
                  transformOrigin: "right center",
                  transform: "rotateY(-90deg)",
                  background: "linear-gradient(to right, #4a0d0a, #6b1410 40%, #7a1812)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <span style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontFamily: "Georgia, serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  color: "rgba(255,230,200,0.65)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}>
                  The Cartographer's Daughter · Elena Voss
                </span>
              </div>

              {/* ── Pages edge (right face) — folded from right edge ── */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: W,
                  width: P,
                  height: H,
                  transformOrigin: "left center",
                  transform: "rotateY(90deg)",
                  backgroundColor: "#ede5d8",
                  backgroundImage: [
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(190,175,155,0.5) 3px, rgba(190,175,155,0.5) 4px)",
                    "linear-gradient(to right, #d8cfc2, #ede5d8 30%)",
                  ].join(", "),
                }}
              />

              {/* ── Top face — folded from top edge ── */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  left: 0,
                  width: W,
                  height: 8,
                  transformOrigin: "bottom center",
                  transform: "rotateX(90deg)",
                  backgroundColor: "#e2d8c8",
                  backgroundImage: "linear-gradient(to bottom, #cfc5b2, #e2d8c8)",
                }}
              />
            </div>
          </div>
        </BlurReveal>

        {/* ── Text column ── */}
        <div className="flex flex-col gap-6">
          <BlurReveal delay={0.12}>
            <span
              className="font-sans font-semibold uppercase tracking-[0.1em]"
              style={{ fontSize: "13px", color: "var(--color-accent)" }}
            >
              Available Now
            </span>
          </BlurReveal>

          <BlurReveal delay={0.18}>
            <h2
              className="font-serif font-medium text-[var(--color-text)]"
              style={{
                fontSize: "clamp(36px, 4vw, 64px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
              }}
            >
              {hero.subheadline}
            </h2>
          </BlurReveal>

          <BlurReveal delay={0.24}>
            <p
              className="font-serif italic"
              style={{ fontSize: "clamp(18px, 1.8vw, 22px)", lineHeight: 1.3, color: "var(--color-text-muted)" }}
            >
              {hero.headline}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.30}>
            <p
              className="max-w-[480px] leading-[1.8]"
              style={{ fontSize: "16px", color: "var(--color-text-muted)" }}
            >
              {hero.body}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.36}>
            <a
              href={nav.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center rounded-full font-sans font-medium text-white transition-[background-color,transform] duration-150 active:scale-[0.98]"
              style={{
                height: "48px",
                padding: "0 28px",
                fontSize: "16px",
                backgroundColor: "var(--color-accent)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                alignSelf: "flex-start",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-accent-hover)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-accent)")}
            >
              Pre-order now
            </a>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
