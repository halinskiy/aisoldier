import { useState, type CSSProperties } from "react";

type Props = { motionAttr: string | null; transition: string | null; accent?: string };
type RecipeLine = { label: string; value: string };

function kit(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    solid: hex,
    a10: `rgba(${r},${g},${b},0.1)`,
    a20: `rgba(${r},${g},${b},0.2)`,
    a50: `rgba(${r},${g},${b},0.5)`,
  };
}

export function IX2Recipe({ motionAttr, transition, accent = "#FF3B3B" }: Props) {
  const [copiedAll, setCopiedAll] = useState(false);
  const ak = kit(accent);
  if (!motionAttr && !transition) return null;
  const recipes = buildRecipe(motionAttr, transition);
  if (recipes.length === 0) return null;

  const copyAll = () => {
    const text = recipes.map((r) => `${r.label}: ${r.value}`).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1000);
  };

  const cardStyle: CSSProperties = {
    background: ak.a10,
    border: `1px solid ${ak.a20}`,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    lineHeight: 1.6,
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: ak.solid, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          IX2 Recipe
        </span>
        <button
          type="button"
          onClick={copyAll}
          style={{
            background: copiedAll ? ak.a20 : "rgba(255,255,255,0.06)",
            border: `1px solid ${copiedAll ? ak.solid : "#393939"}`,
            color: copiedAll ? ak.solid : "#f4f4f4",
            padding: "3px 10px",
            borderRadius: 5,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 150ms",
          }}
        >
          {copiedAll ? "✓ Copied" : "Copy All"}
        </button>
      </div>
      {recipes.map((line, i) => (
        <div
          key={i}
          style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "3px 0", cursor: "pointer", borderRadius: 4 }}
          onClick={() => navigator.clipboard.writeText(line.value).catch(() => {})}
          title="Click to copy"
        >
          <span style={{ color: "rgba(244,244,244,0.4)" }}>{line.label}</span>
          <span style={{ color: "#f4f4f4", textAlign: "right" }}>{line.value}</span>
        </div>
      ))}
    </div>
  );
}

function buildRecipe(motion: string | null, transition: string | null): RecipeLine[] {
  if (!motion) {
    if (transition && transition !== "none" && !transition.startsWith("all 0s")) return [{ label: "Transition", value: transition }];
    return [];
  }
  switch (motion) {
    case "blur-reveal": return [
      { label: "Trigger", value: "Scroll Into View" },
      { label: "Initial", value: "opacity: 0, blur: 8px, translateY: 24px" },
      { label: "Final", value: "opacity: 1, blur: 0, translateY: 0" },
      { label: "Easing", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
      { label: "Duration", value: "600ms" },
    ];
    case "line-draw": return [
      { label: "Trigger", value: "Scroll Into View" },
      { label: "Initial", value: "scaleX: 0, origin: left" },
      { label: "Final", value: "scaleX: 1" },
      { label: "Easing", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
      { label: "Duration", value: "1200ms" },
    ];
    case "split-text-reveal": return [
      { label: "Trigger", value: "Scroll Into View" },
      { label: "Method", value: "Split text by word, stagger children" },
      { label: "Per word", value: "opacity: 0→1, translateY: 12→0, blur: 6→0" },
      { label: "Stagger", value: "40ms between words" },
      { label: "Easing", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
      { label: "Duration", value: "600ms per word" },
    ];
    case "count-up": return [
      { label: "Trigger", value: "Scroll Into View" },
      { label: "Method", value: "Custom code, animate number 0 to target" },
      { label: "Duration", value: "1600ms" },
      { label: "Easing", value: "ease-out (cubic)" },
      { label: "Note", value: "Use embeds/count-up-stats.js" },
    ];
    default: return [{ label: "Motion", value: motion }];
  }
}
