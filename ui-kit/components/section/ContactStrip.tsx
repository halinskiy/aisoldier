import { BlurReveal } from "../motion/BlurReveal";

export type ContactColumn = {
  label: string;
  description: string;
  email: string;
};

export type ContactStripProps = {
  eyebrow?: string;
  headline?: string;
  columns: ContactColumn[];
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/ContactStrip.tsx";

export function ContactStrip({
  eyebrow,
  headline,
  columns,
  className = "",
  dataSource,
}: ContactStripProps) {
  return (
    <section
      id="contact"
      data-component="ContactStrip"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
      style={{ padding: "clamp(64px, 10vh, 112px) clamp(24px, 6vw, 80px)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        {(eyebrow || headline) && (
          <BlurReveal delay={0.0}>
            <div style={{ marginBottom: "clamp(48px, 7vh, 72px)" }}>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0",
            borderTop: "1px solid var(--color-border)",
            borderLeft: "1px solid var(--color-border)",
          }}
        >
          {columns.map((col, i) => (
            <BlurReveal key={i} delay={0.06 + i * 0.06}>
              <div
                style={{
                  padding: "clamp(28px, 4vh, 40px) clamp(24px, 3vw, 36px)",
                  borderRight: "1px solid var(--color-border)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-subtle)",
                    marginBottom: "12px",
                    margin: "0 0 12px",
                  }}
                >
                  {col.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "var(--color-text-muted)",
                    margin: "0 0 20px",
                  }}
                >
                  {col.description}
                </p>
                <a
                  href={`mailto:${col.email}`}
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(15px, 1.4vw, 18px)",
                    fontWeight: 500,
                    color: "var(--color-text)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--color-accent)",
                    paddingBottom: "2px",
                    transition: "color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--color-accent)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--color-text)")}
                >
                  {col.email}
                </a>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
