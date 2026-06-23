"use client";

import { BlurReveal } from "../motion/BlurReveal";

export type EditorialQuoteProps = {
  quote: string;
  attribution?: string;
  attributionDetail?: string;
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/EditorialQuote.tsx";

export function EditorialQuote({
  quote,
  attribution,
  attributionDetail,
  className = "",
  dataSource,
}: EditorialQuoteProps) {
  return (
    <div
      data-component="EditorialQuote"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
    >
      <BlurReveal delay={0.06}>
        {/* Decorative quote mark */}
        <span
          aria-hidden
          style={{
            display: "block",
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "clamp(56px, 8vw, 100px)",
            lineHeight: 0.7,
            color: "var(--color-accent)",
            marginBottom: "clamp(20px, 3vh, 32px)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          "
        </span>
      </BlurReveal>

      <BlurReveal delay={0.12}>
        <blockquote
          style={{
            margin: 0,
            fontFamily: "var(--font-serif), Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(26px, 3.8vw, 54px)",
            lineHeight: 1.35,
            letterSpacing: "-0.015em",
            color: "var(--color-text)",
            fontWeight: 400,
          }}
        >
          {quote}
        </blockquote>
      </BlurReveal>

      {attribution && (
        <BlurReveal delay={0.2}>
          <figcaption
            style={{
              marginTop: "clamp(20px, 3vh, 36px)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "32px",
                height: "1px",
                backgroundColor: "var(--color-accent)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-subtle)",
              }}
            >
              {attribution}
              {attributionDetail && (
                <span style={{ color: "var(--color-accent)", marginLeft: "8px" }}>
                  {attributionDetail}
                </span>
              )}
            </span>
          </figcaption>
        </BlurReveal>
      )}
    </div>
  );
}
