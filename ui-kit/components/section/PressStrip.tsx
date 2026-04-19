"use client";

import { BlurReveal } from "../motion/BlurReveal";

export type PressItem = {
  publication: string;
  title: string;
  type: string;
  href: string;
};

export type PressStripProps = {
  items: PressItem[];
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/PressStrip.tsx";

const TYPE_COLORS: Record<string, string> = {
  Interview: "#B8322C",
  Essay:     "#2C5F8A",
  Podcast:   "#2A7A4E",
  Profile:   "#7A4E2A",
};

export function PressStrip({ items, className = "", dataSource }: PressStripProps) {
  return (
    <div
      data-component="PressStrip"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
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
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,0,0,0.03)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <span
              style={{
                display: "block",
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
            <div
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text)",
                marginBottom: "8px",
              }}
            >
              {item.publication}
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.4vw, 17px)",
                lineHeight: 1.45,
                color: "var(--color-text-muted)",
                marginBottom: "16px",
              }}
            >
              {item.title}
            </div>
            <span
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
              }}
            >
              Read →
            </span>
          </a>
        </BlurReveal>
      ))}
    </div>
  );
}
