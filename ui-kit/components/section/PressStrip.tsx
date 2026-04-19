import { BlurReveal } from "../motion/BlurReveal";

export type PressItem = {
  publication: string;
  title: string;
  type: string;
  href: string;
};

export type PressStripProps = {
  eyebrow?: string;
  headline?: string;
  items: PressItem[];
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/PressStrip.tsx";

const TYPE_COLORS: Record<string, string> = {
  Interview: "#B8322C",
  Essay: "#2C5F8A",
  Podcast: "#2A7A4E",
  Profile: "#7A4E2A",
};

export function PressStrip({
  eyebrow,
  headline,
  items,
  className = "",
  dataSource,
}: PressStripProps) {
  return (
    <section
      data-component="PressStrip"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
      style={{ padding: "clamp(64px, 10vh, 112px) clamp(24px, 6vw, 80px)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        {(eyebrow || headline) && (
          <BlurReveal delay={0.0}>
            <div style={{ marginBottom: "clamp(40px, 6vh, 64px)" }}>
              {eyebrow && (
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    marginBottom: "12px",
                  }}
                >
                  {eyebrow}
                </p>
              )}
              {headline && (
                <h2
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(28px, 3vw, 44px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  {headline}
                </h2>
              )}
            </div>
          </BlurReveal>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "0",
            borderTop: "1px solid var(--color-border)",
            borderLeft: "1px solid var(--color-border)",
          }}
        >
          {items.map((item, i) => (
            <BlurReveal key={i} delay={0.04 + i * 0.04}>
              <a
                href={item.href}
                style={{
                  display: "block",
                  padding: "clamp(24px, 3vh, 32px) clamp(20px, 3vw, 32px)",
                  borderRight: "1px solid var(--color-border)",
                  borderBottom: "1px solid var(--color-border)",
                  textDecoration: "none",
                  transition: "background-color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-surface)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {/* Type badge */}
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: TYPE_COLORS[item.type] ?? "var(--color-text-subtle)",
                    marginBottom: "10px",
                  }}
                >
                  {item.type}
                </span>

                {/* Publication */}
                <div
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--color-text)",
                    marginBottom: "8px",
                  }}
                >
                  {item.publication}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(15px, 1.4vw, 17px)",
                    lineHeight: 1.45,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {item.title}
                </div>

                {/* Read link */}
                <div
                  style={{
                    marginTop: "16px",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Read
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
