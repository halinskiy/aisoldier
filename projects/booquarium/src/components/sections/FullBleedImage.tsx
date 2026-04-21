"use client";

import Image from "next/image";
import { BlurReveal } from "@kit/components/motion/BlurReveal";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { Button } from "@kit/components/ui/Button";
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
      data-tokens="color-accent,font-serif,color-bg"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* ── Content grid ── */}
      <div
        className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2 lg:gap-24 lg:px-10"
        style={{
          minHeight: "100dvh",
          paddingTop: "clamp(80px, 12vh, 140px)",
          paddingBottom: "clamp(80px, 12vh, 140px)",
        }}
      >
        {/* ── Book mockup image ── */}
        <BlurReveal delay={0.05} className="flex items-center justify-center lg:justify-start">
          <div style={{ position: "relative", width: "clamp(300px, 40vw, 560px)", aspectRatio: "2575/1403" }}>
            <Image
              src={`${BASE}/covers/book_mockup2.png`}
              alt="The Cartographer's Daughter — book mockup"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </BlurReveal>

        {/* ── Text column ── */}
        <div className="flex flex-col gap-6">
          <BlurReveal delay={0.12}>
            <EyebrowLabel>{hero.book_pub_date}</EyebrowLabel>
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
              className="font-serif italic text-[var(--color-text-muted)]"
              style={{ fontSize: "clamp(18px, 1.8vw, 22px)", lineHeight: 1.3 }}
            >
              {hero.headline}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.30}>
            <p
              className="max-w-[480px] leading-[1.8] text-[var(--color-text-muted)]"
              style={{ fontSize: "16px" }}
            >
              {hero.body}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.36}>
            <Button href={nav.cta.href} variant="accent" size="lg" trailingDot={false}>
              {hero.cta_secondary.label}
            </Button>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
