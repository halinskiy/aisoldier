"use client";

import { BlurReveal } from "../motion/BlurReveal";

export type ContactColumn = {
  label: string;
  description: string;
  email: string;
};

export type ContactStripProps = {
  columns: ContactColumn[];
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/ContactStrip.tsx";

export function ContactStrip({ columns, className = "", dataSource }: ContactStripProps) {
  return (
    <div
      data-component="ContactStrip"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
                fontSize: "clamp(15px, 1.4vw, 17px)",
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
  );
}
