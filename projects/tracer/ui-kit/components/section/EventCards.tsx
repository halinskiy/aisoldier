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
  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const row = e.currentTarget;
    const venue = row.querySelector<HTMLElement>("[data-venue]");
    const arrow = row.querySelector<HTMLElement>("[data-arrow]");
    if (venue) venue.style.color = "var(--color-accent)";
    if (arrow) { arrow.style.color = "var(--color-accent)"; arrow.style.transform = "translateX(5px)"; }
  };
  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const row = e.currentTarget;
    const venue = row.querySelector<HTMLElement>("[data-venue]");
    const arrow = row.querySelector<HTMLElement>("[data-arrow]");
    if (venue) venue.style.color = "var(--color-text)";
    if (arrow) { arrow.style.color = "var(--color-text-subtle)"; arrow.style.transform = "translateX(0)"; }
  };

  return (
    <div
      data-component="EventCards"
      data-source={dataSource ?? DATA_SOURCE_DEFAULT}
      data-tokens="accent,color-text,color-text-muted,color-border,font-serif,font-sans"
      className={className}
    >
      {events.map((event, i) => (
        <BlurReveal key={i} delay={0.04 + i * 0.05}>
          <a
            href={event.href}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              alignItems: "center",
              gap: "clamp(24px, 4vw, 56px)",
              padding: "clamp(24px, 3vh, 32px) 0",
              borderBottom: "1px solid var(--color-border)",
              textDecoration: "none",
            }}
          >
            {/* Date */}
            <div>
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
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-subtle)",
                  marginTop: "3px",
                }}
              >
                {event.date_month} {event.date_year}
              </div>
            </div>

            {/* Venue + meta */}
            <div>
              <div
                data-venue
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "clamp(18px, 2vw, 26px)",
                  fontWeight: 500,
                  color: "var(--color-text)",
                  letterSpacing: "-0.01em",
                  marginBottom: "6px",
                  transition: "color 150ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {event.venue}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "14px",
                  color: "var(--color-text-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{event.city}</span>
                <span aria-hidden style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "currentColor", display: "inline-block", flexShrink: 0 }} />
                <span>{event.type}</span>
              </div>
            </div>

            {/* Arrow */}
            <svg
              data-arrow
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
              style={{
                color: "var(--color-text-subtle)",
                flexShrink: 0,
                transition: "transform 200ms cubic-bezier(0.16,1,0.3,1), color 150ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </BlurReveal>
      ))}
    </div>
  );
}
