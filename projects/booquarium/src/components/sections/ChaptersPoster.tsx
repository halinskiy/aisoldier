"use client";

import { BlurReveal } from "@kit/components/motion/BlurReveal";
import { SectionHeader } from "@kit/components/section/SectionHeader";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/ChaptersPoster.tsx";

export function ChaptersPoster() {
  const { features } = copy;

  return (
    <section
      id="books-poster"
      data-component="ChaptersPoster"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-text,color-text-muted,color-border,color-bg,font-serif,font-sans"
      className="relative w-full bg-[var(--color-bg)]"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <SectionHeader
          eyebrow={features.eyebrow}
          headline={features.headline}
          align="split"
          dataSource={DATA_SOURCE}
          className="mb-14 lg:mb-20"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            borderTop: "1px solid var(--color-border)",
            borderLeft: "1px solid var(--color-border)",
          }}
          className="grid-cols-1 sm:grid-cols-2"
        >
          {features.items.map((item, i) => (
            <BlurReveal key={i} delay={0.05 + i * 0.09} className="h-full">
              <div
                style={{
                  borderRight: "1px solid var(--color-border)",
                  borderBottom: "1px solid var(--color-border)",
                  padding: "clamp(40px, 6vh, 72px) clamp(32px, 4vw, 56px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "clamp(320px, 40vh, 500px)",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(80px, 12vw, 160px)",
                    fontWeight: 400,
                    color: "var(--color-accent)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.03em",
                    display: "block",
                  }}
                >
                  {item.number}
                </span>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "clamp(22px, 2.6vw, 40px)",
                      fontWeight: 400,
                      color: "var(--color-text)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                      marginBottom: "clamp(12px, 2vh, 20px)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "clamp(16px, 1.2vw, 18px)",
                      lineHeight: 1.65,
                      color: "var(--color-text-muted)",
                      maxWidth: "44ch",
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
