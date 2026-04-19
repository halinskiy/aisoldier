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
  eyebrow?: string;
  headline?: string;
  events: EventItem[];
  className?: string;
  dataSource?: string;
};

const DATA_SOURCE_DEFAULT = "ui-kit/components/section/EventCards.tsx";

export function EventCards({
  eyebrow,
  headline,
  events,
  className = "",
  dataSource,
}: EventCardsProps) {
  return (
    <section
      data-component="EventCards"
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
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {events.map((event, i) => (
            <BlurReveal key={i} delay={0.05 + i * 0.04}>
              <a
                href={event.href}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  alignItems: "center",
                  gap: "clamp(20px, 4vw, 48px)",
                  padding: "clamp(20px, 3vh, 28px) 0",
                  borderBottom: "1px solid var(--color-border)",
                  textDecoration: "none",
                  transition: "background-color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {/* Date block */}
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: "clamp(28px, 3vw, 40px)",
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
                      fontSize: "11px",
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

                {/* Event info */}
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
                      gap: "10px",
                    }}
                  >
                    <span>{event.city}</span>
                    <span aria-hidden style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--color-text-subtle)", display: "inline-block", flexShrink: 0 }} />
                    <span>{event.type}</span>
                  </div>
                </div>

                {/* Arrow */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden style={{ flexShrink: 0, color: "var(--color-text-subtle)" }}>
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
