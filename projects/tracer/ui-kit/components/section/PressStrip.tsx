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
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "0",
        borderTop: "1px solid var(--color-border)",
        borderLeft: "1px solid var(--color-border)",
      }}
    >
      {items.map((item, i) => (
        <BlurReveal key={i} delay={0.04 + i * 0.04} className="h-full">
          <a
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              height: "100%",
              boxSizing: "border-box",
              padding: "clamp(28px, 4vh, 40px) clamp(20px, 3vw, 40px)",
              borderRight: "1px solid var(--color-border)",
              borderBottom: "1px solid var(--color-border)",
              textDecoration: "none",
              transition: "opacity 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.72")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            <div
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text)",
              }}
            >
              {item.publication}
            </div>

            <div
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: 1.5,
                color: "var(--color-text-muted)",
                flexGrow: 1,
              }}
            >
              {item.title}
            </div>

            <span
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginTop: "8px",
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
