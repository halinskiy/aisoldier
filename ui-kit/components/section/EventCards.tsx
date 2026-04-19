"use client";

import { BlurReveal } from "../motion/BlurReveal";

export type EventItem = {
  date_day: string;
  date_month: string;
  date_year: string;
  venue: string;
  city: string;
  type: string;
  href: string;
};

export type EventCardsProps = {
  events: EventItem[];
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/EventCards.tsx";

export function EventCards({ events, className = "", dataSource }: EventCardsProps) {
  return (
    <div
      data-component="EventCards"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      {events.map((event, i) => (
        <BlurReveal key={i} delay={0.05 + i * 0.04}>
          <a
            href={event.href}
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 20px",
              alignItems: "center",
              gap: "clamp(20px, 4vw, 48px)",
              padding: "clamp(20px, 3vh, 28px) 0",
              borderBottom: "1px solid var(--color-border)",
              textDecoration: "none",
            }}
          >
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(26px, 3vw, 38px)",
                  fontWeight: 500,
                  lineHeight: 1,
                  color: "var(--color-accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                {event.date_day}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-subtle)",
                  marginTop: "2px",
                }}
              >
                {event.date_month} {event.date_year}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(16px, 1.8vw, 22px)",
                  fontWeight: 500,
                  color: "var(--color-text)",
                  marginBottom: "4px",
                }}
              >
                {event.venue}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "13px",
                  color: "var(--color-text-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {event.city}
                <span aria-hidden style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "currentColor", display: "inline-block", flexShrink: 0 }} />
                {event.type}
              </div>
            </div>

            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden style={{ color: "var(--color-text-subtle)", flexShrink: 0 }}>
              <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </BlurReveal>
      ))}
    </div>
  );
}
