"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
} from "react";

import { BoxModelDiagram } from "./BoxModelDiagram";
import { IX2Recipe } from "./IX2Recipe";
import { PropertyRow } from "./PropertyRow";
import {
  extractBoxModel,
  extractWebflowStyles,
  type StyleSection,
} from "./extractWebflowStyles";
import { buildColorVarMap } from "./resolveColorVariables";
import { suggestClassName } from "./suggestClassName";
import type { InspectorTarget } from "./useInspectorHotkey";

/* ------------------------------------------------------------------ */
/*  Inspector accent — dynamic, changeable via Settings tab            */
/* ------------------------------------------------------------------ */
// Outline/overlay accent — red by default so it's always visible on any bg.
// User can change via Settings tab.
const DEFAULT_ACCENT = "#FF3B3B";

/** Parse hex to {r,g,b}, generate rgba strings at various opacities. */
function accentKit(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;
  return {
    solid: hex,
    a06: rgba(0.06), a10: rgba(0.1), a12: rgba(0.12),
    a15: rgba(0.15), a20: rgba(0.2), a22: rgba(0.22),
    a25: rgba(0.25), a28: rgba(0.28), a50: rgba(0.5),
  };
}

// Module-level defaults (used by sub-components that import the const)
let A = DEFAULT_ACCENT;
let A10 = accentKit(A).a10;
let A20 = accentKit(A).a20;
let A50 = accentKit(A).a50;
let A06 = accentKit(A).a06;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const panelStyle: CSSProperties = {
  position: "fixed",
  zIndex: 2147483647,
  background: "#1e1e1e",
  color: "#f4f4f4",
  border: "1px solid #393939",
  borderRadius: 14,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: 12,
  lineHeight: 1.5,
  boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
  width: 420,
  height: "calc(100vh - 160px)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  animation: "inspectorIn 200ms cubic-bezier(0.16,1,0.3,1) both",
};

const headerStyle: CSSProperties = {
  padding: "16px 20px 20px",
  borderBottom: "1px solid #2a2a2a",
  flexShrink: 0,
  cursor: "grab",
  userSelect: "none",
};

const tabBarStyle: CSSProperties = {
  display: "flex",
  gap: 0,
  padding: "0 20px",
  borderBottom: "1px solid #2a2a2a",
  flexShrink: 0,
};

const tabStyle = (active: boolean): CSSProperties => ({
  padding: "10px 16px",
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  color: active ? "#f4f4f4" : "rgba(244,244,244,0.45)",
  background: "none",
  border: "none",
  borderBottom: active ? `2px solid ${A}` : "2px solid transparent",
  cursor: "pointer",
  fontFamily: "inherit",
});

const bodyStyle: CSSProperties = {
  flex: "1 1 0",
  minHeight: 0,
  overflowY: "auto",
  padding: "12px 20px 20px",
  scrollbarWidth: "thin",
  scrollbarColor: "#393939 transparent",
};

const closeStyle: CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "transparent",
  border: "1px solid #393939",
  color: "#f4f4f4",
  width: 28,
  height: 28,
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionHeaderStyle: CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  color: "rgba(244,244,244,0.35)",
  marginTop: 16,
  marginBottom: 6,
  paddingBottom: 4,
  cursor: "pointer",
  userSelect: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #2a2a2a",
};

const chipStyle: CSSProperties = {
  display: "inline-block",
  border: `1px solid ${A20}`,
  borderRadius: 9999,
  padding: "3px 10px",
  marginRight: 5,
  marginTop: 5,
  fontSize: 10,
  background: A10,
  color: A,
};

/** Document-coordinate rect for overlays (absolute, scrolls with page). */
function toDocRect(rect: DOMRect): { top: number; left: number; width: number; height: number } {
  const sy = typeof window !== "undefined" ? window.scrollY : 0;
  const sx = typeof window !== "undefined" ? window.scrollX : 0;
  return { top: rect.top + sy, left: rect.left + sx, width: rect.width, height: rect.height };
}

function outlineStyle(dr: ReturnType<typeof toDocRect>, accent: string): CSSProperties {
  const ak2 = accentKit(accent);
  return {
    position: "absolute",
    zIndex: 2147483646,
    top: dr.top,
    left: dr.left,
    width: dr.width,
    height: dr.height,
    border: `2px solid ${ak2.solid}`,
    borderRadius: 4,
    pointerEvents: "none",
    boxShadow: `0 0 0 9999px ${ak2.a06}`,
  };
}

/* keyframes injected once */
const ANIM_INJECTED = { current: false };
function injectKeyframes() {
  if (ANIM_INJECTED.current || typeof document === "undefined") return;
  ANIM_INJECTED.current = true;
  const style = document.createElement("style");
  style.textContent = `@keyframes inspectorIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
type Tab = "style" | "box" | "meta" | "settings";
type Props = { target: InspectorTarget; onClose: () => void };

export function InspectorPanel({ target, onClose }: Props) {
  useEffect(() => injectKeyframes(), []);
  const [tab, setTab] = useState<Tab>("style");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [accent, setAccentRaw] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aisoldier-inspector-accent") || DEFAULT_ACCENT;
    }
    return DEFAULT_ACCENT;
  });
  const setAccent = useCallback((hex: string) => {
    setAccentRaw(hex);
    if (typeof window !== "undefined") {
      localStorage.setItem("aisoldier-inspector-accent", hex);
    }
  }, []);
  const [minimized, setMinimized] = useState(false);
  const resizeRef = useRef<null>(null);

  // Update module-level constants when accent changes (sub-components read these)
  const ak = useMemo(() => {
    const kit = accentKit(accent);
    A = kit.solid; A10 = kit.a10; A20 = kit.a20; A50 = kit.a50; A06 = kit.a06;
    return kit;
  }, [accent]);
  const { rect, element, component, source, tokens, tagName, motionData } = target;

  const colorMap = useMemo(() => buildColorVarMap(), []);
  const styles = useMemo(() => extractWebflowStyles(element, colorMap), [element, colorMap]);
  const boxModel = useMemo(() => extractBoxModel(element), [element]);
  const suggestedClass = useMemo(
    () => suggestClassName(tagName, component !== "Unknown" ? component : null, element.textContent?.slice(0, 60) ?? ""),
    [tagName, component, element],
  );

  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1440;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 900;

  /* Drag */
  const initLeft = Math.min(Math.max(rect.left, 12), viewportW - 420);
  const initTop = Math.min(rect.bottom + 12, viewportH - 520);
  const [pos, setPos] = useState({ x: initLeft, y: initTop });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  useEffect(() => { setPos({ x: initLeft, y: initTop }); }, [element]); // eslint-disable-line

  const onHeaderDown = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({ x: dragRef.current.originX + ev.clientX - dragRef.current.startX, y: dragRef.current.originY + ev.clientY - dragRef.current.startY });
    };
    const onUp = () => { dragRef.current = null; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [pos]);

  const breakpoint = viewportW >= 992 ? `Desktop (${viewportW}px)` : viewportW >= 768 ? `Tablet (${viewportW}px)` : viewportW >= 480 ? `Mobile L (${viewportW}px)` : `Mobile (${viewportW}px)`;

  const copyAll = () => {
    const sections = [styles.layout, styles.spacing, styles.size, styles.position, styles.typography, styles.backgrounds, styles.borders, styles.effects];
    const lines: string[] = [];
    for (const s of sections) {
      if (!s.hasNonDefault) continue;
      lines.push(`/* ${s.label} */`);
      for (const i of s.items) lines.push(`${i.property}: ${i.value};`);
      lines.push("");
    }
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1200);
  };

  return (
    <>
      {/* Overlay wrapper — absolute positioned at document root, scrolls with page */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, overflow: "visible", pointerEvents: "none", zIndex: 2147483644 }}>
        <div style={outlineStyle(toDocRect(rect), accent)} />
        <SpacingOverlay docRect={toDocRect(rect)} spacing={boxModel.margin} opacity={0.12} mode="margin" accent={accent} />
        <SpacingOverlay docRect={toDocRect(rect)} spacing={boxModel.padding} opacity={0.22} mode="padding" accent={accent} />
        <ChildGapOverlays element={element} accent={accent} />
      </div>

      {/* Minimized state — small draggable dark pill. Click = expand, drag = move. */}
      {minimized && (
        <MinimizedPill
          pos={pos}
          onExpand={() => setMinimized(false)}
          onDrag={(newPos) => setPos(newPos)}
        />
      )}

      {/* Full panel */}
      {!minimized && (
      <div
        style={{ ...panelStyle, left: pos.x, top: pos.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close + Minimize buttons */}
        <button type="button" style={closeStyle} onClick={onClose} aria-label="Close">×</button>
        <button
          type="button"
          onClick={() => setMinimized(true)}
          aria-label="Minimize"
          style={{ ...closeStyle, right: 42, fontSize: 16, lineHeight: "22px" }}
        >
          −
        </button>

        {/* Header — drag handle */}
        <div style={headerStyle} onMouseDown={onHeaderDown}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 72 }}>
            <div>
              <span style={{ color: "rgba(244,244,244,0.45)", fontSize: 12 }}>{tagName}</span>
              <span style={{ color: "rgba(244,244,244,0.25)", margin: "0 6px" }}>·</span>
              <span style={{ color: ak.solid, fontSize: 12, fontWeight: 600 }}>{suggestedClass}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(244,244,244,0.4)", marginTop: 6, display: "flex", gap: 10, alignItems: "center" }}>
            <span>{Math.round(rect.width)} × {Math.round(rect.height)}</span>
            <span style={{ color: "rgba(244,244,244,0.25)" }}>·</span>
            <span>{breakpoint}</span>
            <button
              type="button"
              onClick={copyAll}
              style={{
                marginLeft: "auto",
                background: copyFeedback ? A20 : "rgba(255,255,255,0.06)",
                border: `1px solid ${copyFeedback ? A50 : "#393939"}`,
                color: copyFeedback ? A : "#f4f4f4",
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 150ms",
              }}
            >
              {copyFeedback ? "✓ Copied" : "Copy All CSS"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={tabBarStyle}>
          {(["style", "box", "meta", "settings"] as Tab[]).map((t) => (
            <button key={t} type="button" style={{...tabStyle(tab === t), borderBottomColor: tab === t ? ak.solid : "transparent"}} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {tab === "style" && <StyleTab styles={styles} />}
          {tab === "box" && <BoxTab data={boxModel} styles={styles} accent={accent} />}
          {tab === "meta" && <MetaTab component={component} source={source} tokens={tokens} suggestedClass={suggestedClass} motionAttr={motionData.motionAttribute} transition={motionData.transitionValue} accent={accent} />}
          {tab === "settings" && <SettingsTab accent={accent} onAccentChange={setAccent} />}
        </div>

        {/* Footer */}
        <div style={{ padding: "8px 20px", borderTop: "1px solid #2a2a2a", fontSize: 10, color: "rgba(244,244,244,0.25)", textAlign: "center", flexShrink: 0 }}>
          Esc · Cmd+click · Drag header · Resize from edge
        </div>

      </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */
function StyleTab({ styles }: { styles: ReturnType<typeof extractWebflowStyles> }) {
  const defaultExpanded = new Set(["Typography", "Spacing"]);
  const sections = [styles.typography, styles.spacing, styles.layout, styles.size, styles.position, styles.backgrounds, styles.borders, styles.effects].filter((s) => s.hasNonDefault);
  return (
    <>
      {sections.map((s) => <CollapsibleSection key={s.label} section={s} defaultOpen={defaultExpanded.has(s.label)} />)}
      {sections.length === 0 && <div style={{ color: "rgba(244,244,244,0.25)", padding: "20px 0", fontSize: 11, textAlign: "center" }}>No non-default styles detected</div>}
    </>
  );
}

function BoxTab({ data, styles, accent }: { data: ReturnType<typeof extractBoxModel>; styles: ReturnType<typeof extractWebflowStyles>; accent: string }) {
  return (
    <>
      <BoxModelDiagram data={data} accent={accent} />
      {styles.spacing.hasNonDefault && (
        <div style={{ marginTop: 16 }}>
          <div style={sectionHeaderStyle}>Spacing values</div>
          {styles.spacing.items.map((i) => <PropertyRow key={i.property} item={i} />)}
        </div>
      )}
    </>
  );
}

function MetaTab({ component, source, tokens, suggestedClass, motionAttr, transition, accent }: { component: string; source: string; tokens: string[]; suggestedClass: string; motionAttr: string | null; transition: string | null; accent: string }) {
  const whiteChip: CSSProperties = {
    display: "inline-block",
    border: "1px solid rgba(244,244,244,0.15)",
    borderRadius: 9999,
    padding: "3px 10px",
    marginRight: 5,
    marginTop: 5,
    fontSize: 10,
    background: "rgba(244,244,244,0.06)",
    color: "#f4f4f4",
  };
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "rgba(244,244,244,0.4)", fontSize: 10, marginBottom: 3 }}>Suggested class</div>
        <div style={{ color: "#f4f4f4", fontSize: 13, cursor: "pointer", fontWeight: 600 }} onClick={() => navigator.clipboard.writeText(suggestedClass).catch(() => {})} title="Click to copy">{suggestedClass}</div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{component}</div>
      {source && <button type="button" onClick={() => window.open(`cursor://file/${source}`, "_blank")} style={{ all: "unset", display: "block", color: "rgba(244,244,244,0.7)", fontSize: 11, cursor: "pointer", marginBottom: 14, wordBreak: "break-all" }}>{source}</button>}
      {tokens.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: "rgba(244,244,244,0.4)", fontSize: 10, marginBottom: 6 }}>tokens</div>
          <div>{tokens.map((t) => <span key={t} style={whiteChip}>{t}</span>)}</div>
        </div>
      )}
      <IX2Recipe motionAttr={motionAttr} transition={transition} accent={accent} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/**
 * Minimized pill — black, draggable. Click opens, drag moves without opening.
 * Tracks whether the pointer moved > 4px to distinguish click from drag.
 */
function MinimizedPill({
  pos,
  onExpand,
  onDrag,
}: {
  pos: { x: number; y: number };
  onExpand: () => void;
  onDrag: (p: { x: number; y: number }) => void;
}) {
  const didDrag = useRef(false);
  const startRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const onDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    didDrag.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true;
      onDrag({ x: startRef.current.ox + dx, y: startRef.current.oy + dy });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!didDrag.current) onExpand();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 2147483647,
        left: pos.x,
        top: pos.y,
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "#1e1e1e",
        border: "1px solid #393939",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
      onMouseDown={onDown}
      title="Click to expand · Drag to move"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f4f4f4" strokeWidth="1.6" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    </div>
  );
}

function SettingsTab({ accent, onAccentChange }: { accent: string; onAccentChange: (hex: string) => void }) {
  const presets = [
    { hex: "#FF3B3B", label: "Red" },
    { hex: "#ffffff", label: "White" },
    { hex: "#A855F7", label: "Purple" },
    { hex: "#0f62fe", label: "Blue" },
    { hex: "#FF512A", label: "Orange" },
    { hex: "#10b981", label: "Green" },
    { hex: "#f43f5e", label: "Rose" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ ...sectionHeaderStyle, marginTop: 4 }}>Accent color</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <input
            type="color"
            value={accent}
            onChange={(e) => onAccentChange(e.target.value)}
            style={{ width: 36, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent", padding: 0 }}
          />
          <span style={{ fontSize: 13, fontFamily: "ui-monospace, monospace", color: "#f4f4f4" }}>{accent}</span>
        </div>
      </div>
      <div>
        <div style={{ color: "rgba(244,244,244,0.35)", fontSize: 10, marginBottom: 8 }}>Presets</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {presets.map((p) => (
            <button
              key={p.hex}
              type="button"
              onClick={() => onAccentChange(p.hex)}
              title={p.label}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: p.hex, border: accent === p.hex ? "2px solid #fff" : "2px solid transparent",
                cursor: "pointer", transition: "border-color 150ms",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ color: "rgba(244,244,244,0.25)", fontSize: 10, marginTop: 8 }}>
        Changes the Inspector overlay color, outline, and panel accents. Doesn't affect the page design.
      </div>
    </div>
  );
}

function CollapsibleSection({ section, defaultOpen }: { section: StyleSection; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div style={sectionHeaderStyle} onClick={() => setOpen((o) => !o)}>
        <span>{section.label}</span>
        <span style={{ fontSize: 9, color: "rgba(244,244,244,0.25)" }}>{open ? "▼" : "▶"}</span>
      </div>
      {open && section.items.map((i) => <PropertyRow key={i.property} item={i} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  On-page overlays — single purple, with px labels per side          */
/* ------------------------------------------------------------------ */
type DocRect = { top: number; left: number; width: number; height: number };
type OverlayProps = {
  docRect: DocRect;
  spacing: { top: number; right: number; bottom: number; left: number };
  opacity: number;
  mode: "margin" | "padding";
  accent: string;
};

function SpacingOverlay({ docRect: r, spacing, opacity, mode, accent }: OverlayProps) {
  const ak2 = accentKit(accent);
  const color = `rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},${opacity})`;
  const base: CSSProperties = { position: "absolute", pointerEvents: "none", background: color };

  const labelEl = (val: number, area: DocRect) => {
    if (val <= 0) return null;
    return (
      <div style={{
        position: "absolute", pointerEvents: "none",
        top: area.top + area.height / 2 - 8, left: area.left + area.width / 2 - 12,
        fontSize: 9, fontFamily: "ui-monospace, monospace", fontWeight: 600,
        color: "#fff", background: ak2.a50, borderRadius: 3, padding: "1px 5px",
        lineHeight: 1.3, whiteSpace: "nowrap",
      }}>
        {val}
      </div>
    );
  };

  const rBottom = r.top + r.height;
  const rRight = r.left + r.width;

  if (mode === "margin") {
    const areas = {
      top: { top: r.top - spacing.top, left: r.left - spacing.left, width: r.width + spacing.left + spacing.right, height: spacing.top },
      bottom: { top: rBottom, left: r.left - spacing.left, width: r.width + spacing.left + spacing.right, height: spacing.bottom },
      left: { top: r.top, left: r.left - spacing.left, width: spacing.left, height: r.height },
      right: { top: r.top, left: rRight, width: spacing.right, height: r.height },
    };
    return (
      <>
        {spacing.top > 0 && <><div style={{ ...base, ...areas.top }} />{labelEl(spacing.top, areas.top)}</>}
        {spacing.bottom > 0 && <><div style={{ ...base, ...areas.bottom }} />{labelEl(spacing.bottom, areas.bottom)}</>}
        {spacing.left > 0 && <><div style={{ ...base, ...areas.left }} />{labelEl(spacing.left, areas.left)}</>}
        {spacing.right > 0 && <><div style={{ ...base, ...areas.right }} />{labelEl(spacing.right, areas.right)}</>}
      </>
    );
  }

  // padding
  const areas = {
    top: { top: r.top, left: r.left, width: r.width, height: spacing.top },
    bottom: { top: rBottom - spacing.bottom, left: r.left, width: r.width, height: spacing.bottom },
    left: { top: r.top + spacing.top, left: r.left, width: spacing.left, height: r.height - spacing.top - spacing.bottom },
    right: { top: r.top + spacing.top, left: rRight - spacing.right, width: spacing.right, height: r.height - spacing.top - spacing.bottom },
  };
  return (
    <>
      {spacing.top > 0 && <><div style={{ ...base, ...areas.top }} />{labelEl(spacing.top, areas.top)}</>}
      {spacing.bottom > 0 && <><div style={{ ...base, ...areas.bottom }} />{labelEl(spacing.bottom, areas.bottom)}</>}
      {spacing.left > 0 && <><div style={{ ...base, ...areas.left }} />{labelEl(spacing.left, areas.left)}</>}
      {spacing.right > 0 && <><div style={{ ...base, ...areas.right }} />{labelEl(spacing.right, areas.right)}</>}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Child gap overlays — shows spacing BETWEEN direct children         */
/* ------------------------------------------------------------------ */

/**
 * When you Cmd+click a container (section, div with children), this
 * component renders a purple strip between every pair of adjacent
 * visible children, labelled with the gap in px. This gives a full
 * spacing map of the container in one click.
 *
 * Works for both vertical (column) and horizontal (row) layouts.
 * Skips children that are hidden (display:none, zero-size, or aria-hidden
 * utility divs like grid spacers).
 */
/**
 * Recursively shows gaps between visible children (up to 3 levels deep).
 * This reveals spacing between eyebrow→headline, headline→body, body→CTA,
 * CTA→avatar-stack, etc. — the full spacing map of the container.
 */
function ChildGapOverlays({ element, accent }: { element: HTMLElement; accent: string }) {
  const akGap = accentKit(accent);
  const sy = typeof window !== "undefined" ? window.scrollY : 0;
  const sx = typeof window !== "undefined" ? window.scrollX : 0;
  const all: ReactElement[] = [];

  function walk(el: HTMLElement, depth: number, prefix: string) {
    if (depth > 3) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const visible = kids.filter((c) => {
      const r = c.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return false;
      const cs = getComputedStyle(c);
      return cs.display !== "none" && cs.visibility !== "hidden";
    });

    if (visible.length >= 2) {
      const pcs = getComputedStyle(el);
      const isRow = pcs.display.includes("flex") && (pcs.flexDirection === "row" || pcs.flexDirection === "row-reverse");
      const isGrid = pcs.display.includes("grid");

      for (let i = 0; i < visible.length - 1; i++) {
        const a = visible[i].getBoundingClientRect();
        const b = visible[i + 1].getBoundingClientRect();
        let gapPx: number;
        let sTop: number, sLeft: number, sW: number, sH: number;

        if (isRow || isGrid) {
          gapPx = Math.round(b.left - a.right);
          if (gapPx <= 2) continue;
          sTop = Math.min(a.top, b.top) + sy;
          sLeft = a.right + sx;
          sW = gapPx;
          sH = Math.max(a.height, b.height);
        } else {
          gapPx = Math.round(b.top - a.bottom);
          if (gapPx <= 2) continue;
          sTop = a.bottom + sy;
          sLeft = Math.min(a.left, b.left) + sx;
          sW = Math.max(a.width, b.width);
          sH = gapPx;
        }

        const k = `${prefix}-${depth}-${i}`;
        const opacity = depth === 0 ? 0.12 : depth === 1 ? 0.09 : 0.06;
        all.push(
          <div key={k}>
            <div style={{ position: "absolute", top: sTop, left: sLeft, width: sW, height: sH, background: `rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},${opacity})`, pointerEvents: "none" }} />
            <div style={{
              position: "absolute",
              top: sTop + sH / 2 - 8,
              left: sLeft + sW / 2 - 14,
              fontSize: 9, fontFamily: "ui-monospace, monospace", fontWeight: 600,
              color: "#fff", background: akGap.a50, borderRadius: 3,
              padding: "1px 5px", lineHeight: 1.3, whiteSpace: "nowrap", pointerEvents: "none",
            }}>{gapPx}</div>
          </div>,
        );
      }
    }

    // Recurse into children that are containers (have children themselves)
    for (let i = 0; i < visible.length; i++) {
      if (visible[i].children.length >= 2) {
        walk(visible[i], depth + 1, `${prefix}-${i}`);
      }
    }
  }

  walk(element, 0, "g");
  if (all.length === 0) return null;
  return <>{all}</>;
}
