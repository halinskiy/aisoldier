import type { Metadata } from "next";
import copy from "@content/copy.json";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "The Cartographer's Daughter — Elena Voss",
  description: "A daughter inherits her father's maps and discovers the one place he refused to chart. Literary fiction by Elena Voss.",
};

export default function BookPage() {
  const { book_page, hero, praise } = copy;

  return (
    <main className="bg-[#fafaf8] font-sans" style={{ minHeight: "100vh" }}>

      {/* Back nav */}
      <div style={{ padding: "32px clamp(24px, 6vw, 80px) 0" }}>
        <a
          href={`${BASE}/`}
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-text-subtle)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          ← Elena Voss
        </a>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "clamp(48px, 8vh, 96px) clamp(24px, 6vw, 80px)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "start",
          }}
          className="lg:grid-cols-[320px_1fr]"
        >
          {/* Cover placeholder */}
          <div
            style={{
              aspectRatio: "2/3",
              backgroundColor: "#0d1b2a",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px",
              boxShadow: "8px 12px 40px rgba(0,0,0,0.25), 2px 4px 8px rgba(0,0,0,0.15)",
              maxWidth: "320px",
            }}
          >
            <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C", marginBottom: "20px" }} />
            <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: "24px", textAlign: "center" }}>A Novel</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "22px", color: "#F8F3E9", textAlign: "center", lineHeight: 1.3, marginBottom: "8px", fontWeight: 400 }}>The Cartographer's</h2>
            <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "22px", color: "#F8F3E9", textAlign: "center", lineHeight: 1.3, marginBottom: "32px", fontWeight: 400 }}>Daughter</h2>
            <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C", marginBottom: "20px" }} />
            <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", letterSpacing: "0.08em", color: "rgba(248,243,233,0.65)", textTransform: "uppercase", textAlign: "center" }}>Elena Voss</p>
          </div>

          {/* Info column */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "16px",
              }}
            >
              Literary Fiction · 2026
            </p>

            <h1
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(32px, 5vw, 60px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--color-text)",
                marginBottom: "24px",
              }}
            >
              The Cartographer's<br />Daughter
            </h1>

            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.8vw, 21px)",
                lineHeight: 1.6,
                color: "var(--color-text-muted)",
                marginBottom: "32px",
                maxWidth: "560px",
              }}
            >
              {book_page.tagline}
            </p>

            {/* Retailers */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}>
              {book_page.retailers.map((r, i) => (
                <a
                  key={i}
                  href={r.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "40px",
                    padding: "0 18px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--color-text)",
                    textDecoration: "none",
                    transition: "border-color 150ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-text)";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {r.label}
                </a>
              ))}
            </div>

            {/* Starred reviews row */}
            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "24px",
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {praise.blurbs.slice(0, 3).map((b, i) => (
                <div key={i} style={{ maxWidth: "340px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "var(--color-text-muted)",
                      marginBottom: "6px",
                    }}
                  >
                    "{b.quote}"
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    — {b.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        <div style={{ padding: "clamp(56px, 8vh, 96px) clamp(24px, 6vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(32px, 5vw, 80px)" }} className="lg:grid-cols-[240px_1fr]">
            <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-subtle)", paddingTop: "4px" }}>
              About the Book
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(17px, 1.8vw, 20px)",
                lineHeight: 1.8,
                color: "var(--color-text)",
                maxWidth: "720px",
              }}
            >
              {book_page.synopsis}
            </p>
          </div>
        </div>
      </div>

      {/* Author's Note */}
      <div style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface, #f5f4f0)" }}>
        <div style={{ padding: "clamp(56px, 8vh, 96px) clamp(24px, 6vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(32px, 5vw, 80px)" }} className="lg:grid-cols-[240px_1fr]">
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--color-text)", margin: 0 }}>
              {book_page.author_note.headline}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(16px, 1.6vw, 19px)",
                lineHeight: 1.85,
                color: "var(--color-text-muted)",
                maxWidth: "680px",
              }}
            >
              {book_page.author_note.body}
            </p>
          </div>
        </div>
      </div>

      {/* Reading Group Guide */}
      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        <div style={{ padding: "clamp(56px, 8vh, 96px) clamp(24px, 6vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(36px, 5vh, 56px)" }}>
            <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "12px" }}>
              Reading Group
            </p>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--color-text)", margin: "0 0 16px" }}>
              {book_page.reading_guide.headline}
            </h2>
            <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "15px", lineHeight: 1.65, color: "var(--color-text-muted)", maxWidth: "600px" }}>
              {book_page.reading_guide.intro}
            </p>
          </div>

          <ol style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--color-border)" }}>
            {book_page.reading_guide.questions.map((q, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr",
                  gap: "24px",
                  padding: "clamp(20px, 3vh, 28px) 0",
                  borderBottom: "1px solid var(--color-border)",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(20px, 2vw, 28px)",
                    fontWeight: 500,
                    color: "var(--color-accent)",
                    opacity: 0.6,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(16px, 1.6vw, 19px)",
                    lineHeight: 1.65,
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  {q}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ borderTop: "1px solid var(--color-border)", padding: "clamp(40px, 6vh, 64px) clamp(24px, 6vw, 80px)", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "15px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
          Read the opening chapter before you decide.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <a
            href={`${BASE}/chapter-one`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "48px",
              padding: "0 28px",
              backgroundColor: "var(--color-text)",
              color: "var(--color-bg)",
              borderRadius: "999px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Read Chapter One
          </a>
          <a
            href={`${BASE}/`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "48px",
              padding: "0 28px",
              border: "1px solid var(--color-border)",
              borderRadius: "999px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--color-text)",
              textDecoration: "none",
              transition: "border-color 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            ← Back to Elena Voss
          </a>
        </div>
      </div>

    </main>
  );
}
