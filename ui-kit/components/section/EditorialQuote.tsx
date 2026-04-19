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
    <section
      data-component="EditorialQuote"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,font-serif"
      className={className}
      style={{ padding: "clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "840px" }}>
        <BlurReveal delay={0.05}>
          {/* Decorative open-quote */}
          <span
            aria-hidden
            style={{
              display: "block",
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(72px, 10vw, 120px)",
              lineHeight: 0.7,
              color: "var(--color-accent)",
              marginBottom: "clamp(16px, 2vh, 28px)",
              fontWeight: 500,
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
              fontSize: "clamp(22px, 3vw, 36px)",
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              color: "var(--color-text)",
              fontWeight: 400,
            }}
          >
            {quote}
          </blockquote>
        </BlurReveal>

        {attribution && (
          <BlurReveal delay={0.2}>
            <div
              style={{
                marginTop: "clamp(24px, 3vh, 40px)",
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
                  fontSize: "12px",
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
            </div>
          </BlurReveal>
        )}
      </div>
    </section>
  );
}
