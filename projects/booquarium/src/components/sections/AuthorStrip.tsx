"use client";

import { BlurReveal } from "@kit/components/motion/BlurReveal";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/AuthorStrip.tsx";

export function AuthorStrip() {
  const { author_strip } = copy;

  return (
    <section
      id="author-strip"
      data-component="AuthorStrip"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-text,color-text-muted,font-serif"
      className="w-full border-b border-[var(--color-border)]"
      style={{ padding: "clamp(56px, 8vw, 112px) 0" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left: headline + subheadline */}
          <BlurReveal delay={0.05}>
            <div className="flex flex-col gap-4">
              <h2
                className="font-serif font-medium text-[var(--color-text)]"
                style={{ fontSize: "28px", lineHeight: 1.1, letterSpacing: "-0.015em" }}
              >
                {author_strip.headline}
              </h2>
              <p
                className="font-sans text-[var(--color-text-muted)]"
                style={{ fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-line" }}
              >
                {author_strip.subheadline}
              </p>
            </div>
          </BlurReveal>

          {/* Right: two paragraphs */}
          <div className="flex flex-col gap-5">
            <BlurReveal delay={0.1}>
              <p
                className="font-sans text-[var(--color-text-muted)]"
                style={{ fontSize: "clamp(16px, 1.25vw, 18px)", lineHeight: 1.65 }}
              >
                {author_strip.paragraph_1}
              </p>
            </BlurReveal>
            <BlurReveal delay={0.18}>
              <p
                className="font-sans text-[var(--color-text-muted)]"
                style={{ fontSize: "clamp(16px, 1.25vw, 18px)", lineHeight: 1.65 }}
              >
                {author_strip.paragraph_2}
              </p>
            </BlurReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
