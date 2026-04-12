import { useState, type CSSProperties } from "react";

import type { StyleValue } from "./extractWebflowStyles";

// Copy feedback uses a neutral accent — the parent panel controls the dynamic accent
const COPY_BG = "rgba(244,244,244,0.12)";

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 8px",
  margin: "1px 0",
  gap: 10,
  fontSize: 11,
  lineHeight: 1.4,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  borderRadius: 6,
  cursor: "pointer",
  transition: "background 120ms",
};

const labelStyle: CSSProperties = {
  color: "rgba(244,244,244,0.45)",
  flexShrink: 0,
  minWidth: 80,
  fontSize: 11,
};

const valueStyle: CSSProperties = {
  color: "#f4f4f4",
  fontSize: 12,
  textAlign: "right",
  wordBreak: "break-all",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const swatchStyle = (color: string): CSSProperties => ({
  display: "inline-block",
  width: 14,
  height: 14,
  borderRadius: 4,
  backgroundColor: color,
  border: "1px solid rgba(255,255,255,0.15)",
  flexShrink: 0,
});

export function PropertyRow({ item }: { item: StyleValue }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(item.value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  return (
    <div>
      <div
        style={{
          ...rowStyle,
          background: copied ? COPY_BG : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        }}
        onClick={copy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={`Click to copy: ${item.value}`}
      >
        <span style={labelStyle}>{item.label}</span>
        <span style={valueStyle}>
          {item.isColor && <span style={swatchStyle(item.value)} />}
          <span>{copied ? "✓" : item.value}</span>
        </span>
      </div>
      {item.varName && (
        <div style={{ fontSize: 10, color: "rgba(244,244,244,0.45)", paddingLeft: 8, marginTop: -2, marginBottom: 2 }}>
          → {item.varName}
        </div>
      )}
    </div>
  );
}
