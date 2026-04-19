import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/ChaptersStacked.tsx";

const THEMES = [
  { bg: "#FDFAF7", text: "#1C1C1C", muted: "rgba(28,28,28,0.45)", accent: "#B8322C" },
  { bg: "#1C1C1C", text: "#F5F0E8", muted: "rgba(245,240,232,0.5)", accent: "#D45A54" },
  { bg: "#FDFAF7", text: "#1C1C1C", muted: "rgba(28,28,28,0.45)", accent: "#B8322C" },
  { bg: "#1C1C1C", text: "#F5F0E8", muted: "rgba(245,240,232,0.5)", accent: "#D45A54" },
];

export function ChaptersStacked() {
  const { features } = copy;

  return (
    <section
      id="books"
      data-component="ChaptersStacked"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-text,font-serif,font-sans"
      style={{ position: "relative" }}
    >
      {features.items.map((item, i) => {
        const t = THEMES[i % THEMES.length];
        return (
          <div
            key={i}
            style={{
              position: "sticky",
              top: 0,
              height: "100dvh",
              backgroundColor: t.bg,
              zIndex: i + 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Ghost number — decorative background element */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: "-0.04em",
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "min(52vw, 680px)",
                fontWeight: 400,
                color: t.accent,
                opacity: 0.05,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {item.number}
            </div>

            {/* Top bar */}
            <div
              style={{
                padding: "clamp(24px, 4vh, 40px) clamp(24px, 5vw, 80px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.muted,
                }}
              >
                {features.eyebrow}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.muted,
                }}
              >
                {item.number} / 0{features.items.length}
              </span>
            </div>

            {/* Main content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                padding: "0 clamp(24px, 5vw, 80px)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(72px, 11vw, 160px)",
                    fontWeight: 400,
                    color: t.accent,
                    lineHeight: 0.85,
                    letterSpacing: "-0.03em",
                    marginBottom: "clamp(20px, 4vh, 44px)",
                  }}
                >
                  {item.number}
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "clamp(32px, 5vw, 72px)",
                    fontWeight: 400,
                    color: t.text,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    maxWidth: "18ch",
                    marginBottom: "clamp(16px, 3vh, 28px)",
                    margin: "0 0 clamp(16px, 3vh, 28px)",
                  }}
                >
                  {item.title}
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "clamp(16px, 1.4vw, 19px)",
                    lineHeight: 1.7,
                    color: t.muted,
                    maxWidth: "52ch",
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>

            {/* Bottom progress */}
            <div
              style={{
                padding: "clamp(24px, 4vh, 40px) clamp(24px, 5vw, 80px)",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {features.items.map((_, j) => (
                <div
                  key={j}
                  style={{
                    height: "2px",
                    width: j <= i ? "32px" : "16px",
                    backgroundColor: j <= i ? t.accent : t.muted,
                    borderRadius: "1px",
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
