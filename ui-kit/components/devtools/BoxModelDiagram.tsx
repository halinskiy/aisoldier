import { useState } from "react";

type Sides = { top: number; right: number; bottom: number; left: number };
type BoxData = {
  margin: Sides;
  padding: Sides;
  border: Sides;
  content: { width: number; height: number };
};

function kit(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (a: number) => `rgba(${r},${g},${b},${a})`;
}

export function BoxModelDiagram({ data, accent = "#FF3B3B" }: { data: BoxData; accent?: string }) {
  const rgba = kit(accent);
  return (
    <div style={{ width: "100%", fontFamily: "ui-monospace, monospace", userSelect: "none", fontSize: 11 }}>
      <Layer label="margin" bg={rgba(0.08)} border={rgba(0.2)} sides={data.margin} accent={accent}>
        <Layer label="border" bg={rgba(0.10)} border={rgba(0.25)} sides={data.border} accent={accent}>
          <Layer label="padding" bg={rgba(0.16)} border={rgba(0.3)} sides={data.padding} accent={accent}>
            <div style={{
              background: rgba(0.25),
              borderRadius: 3,
              padding: "10px 0",
              textAlign: "center",
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              border: `1px dashed ${rgba(0.4)}`,
            }}>
              {data.content.width} × {data.content.height}
            </div>
          </Layer>
        </Layer>
      </Layer>
    </div>
  );
}

function Layer({ label, bg, border, sides, accent, children }: {
  label: string; bg: string; border: string; sides: Sides; accent: string; children: React.ReactNode;
}) {
  const rgba = kit(accent);
  return (
    <div style={{ position: "relative", background: bg, border: `1px solid ${border}`, borderRadius: 4, padding: 4 }}>
      <span style={{
        position: "absolute", top: 2, left: 6, fontSize: 8,
        color: rgba(0.5), textTransform: "uppercase", letterSpacing: "0.5px", pointerEvents: "none",
      }}>{label}</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "14px 4px 4px" }}>
        <Val v={sides.top} accent={accent} />
        <div style={{ display: "flex", alignItems: "center", gap: 4, width: "100%" }}>
          <Val v={sides.left} accent={accent} />
          <div style={{ flex: 1 }}>{children}</div>
          <Val v={sides.right} accent={accent} />
        </div>
        <Val v={sides.bottom} accent={accent} />
      </div>
    </div>
  );
}

function Val({ v, accent }: { v: number; accent: string }) {
  const [copied, setCopied] = useState(false);
  const rgba = kit(accent);
  const copy = () => {
    navigator.clipboard.writeText(`${v}px`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };
  return (
    <span
      onClick={copy}
      title={`${v}px`}
      style={{
        minWidth: 28, textAlign: "center", fontSize: 11,
        color: v === 0 ? "rgba(244,244,244,0.2)" : "#f4f4f4",
        cursor: "pointer", padding: "2px 6px", borderRadius: 3,
        background: copied ? rgba(0.3) : "transparent",
        transition: "background 150ms", fontWeight: v === 0 ? 400 : 600,
      }}
    >
      {copied ? "✓" : v}
    </span>
  );
}
