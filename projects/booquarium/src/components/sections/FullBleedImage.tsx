"use client";

import Image from "next/image";
import { BlurReveal } from "@kit/components/motion/BlurReveal";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/FullBleedImage.tsx";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
        backgroundColor: "#0d0b0a",
        backgroundImage:
          "radial-gradient(ellipse 160% 100% at 30% 60%, rgba(184,50,44,0.07) 0%, transparent 55%), " +
          "radial-gradient(ellipse 80% 80% at 80% 20%, rgba(255,245,235,0.03) 0%, transparent 50%)",
      }}
    >
      {/* Subtle noise grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      <div
        className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 md:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10"
        style={{ minHeight: "100dvh", paddingTop: "clamp(80px, 12vh, 140px)", paddingBottom: "clamp(80px, 12vh, 140px)" }}
      >
        {/* Book mockup */}
        <BlurReveal delay={0.05} className="flex items-center justify-center lg:justify-end">
          <div
            style={{
              position: "relative",
              width: "clamp(200px, 28vw, 380px)",
              aspectRatio: "0.66",
              borderRadius: "3px 10px 10px 3px",
              overflow: "hidden",
              boxShadow:
                "-18px 24px 80px rgba(0,0,0,0.75), -6px 8px 24px rgba(0,0,0,0.5), 2px 0 6px rgba(0,0,0,0.4)",
              transform: "perspective(1200px) rotateY(8deg)",
              flexShrink: 0,
            }}
          >
            <Image
              src={`${BASE}/covers/spread.jpg`}
              alt="The Cartographer's Daughter — cover"
              fill
              sizes="(max-width: 768px) 60vw, 28vw"
              style={{ objectFit: "cover", objectPosition: "right center" }}
            />
            {/* Spine shadow on left edge */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "40px",
                height: "100%",
                background: "linear-gradient(to right, rgba(0,0,0,0.55), transparent)",
                pointerEvents: "none",
              }}
            />
          </div>
        </BlurReveal>

        {/* Text column */}
        <div className="flex flex-col gap-6">
          <BlurReveal delay={0.1}>
            <span
              className="font-sans font-semibold uppercase tracking-[0.1em]"
              style={{ fontSize: "13px", color: "var(--color-accent)" }}
            >
              Available Now
            </span>
          </BlurReveal>

          <BlurReveal delay={0.16}>
            <h2
              className="font-serif font-medium text-white"
              style={{
                fontSize: "clamp(36px, 4vw, 68px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
              }}
            >
              {hero.subheadline}
            </h2>
          </BlurReveal>

          <BlurReveal delay={0.22}>
            <p
              className="font-serif italic"
              style={{ fontSize: "clamp(18px, 1.8vw, 22px)", lineHeight: 1.3, color: "rgba(255,255,255,0.5)" }}
            >
              {hero.headline}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.28}>
            <p
              className="max-w-[480px] leading-[1.75]"
              style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)" }}
            >
              {hero.body}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.34}>
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
