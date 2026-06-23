"use client";

import { useEffect, useState } from "react";

import { InspectorPanel } from "./InspectorPanel";
import { useInspectorHotkey } from "./useInspectorHotkey";

/**
 * Aisoldier Inspector — dev-mode Cmd+click overlay.
 *
 * Import once in the root layout:
 *   {process.env.NODE_ENV === "development" && <Inspector />}
 *
 * Features:
 *   - Hold Cmd/Ctrl → hover highlights elements with a tinted outline
 *   - Cmd+click → opens the full InspectorPanel with Style/Box/Meta/Settings tabs
 *   - Esc → close
 */
export function Inspector() {
  const { target, metaHeld, clear } = useInspectorHotkey();
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);

  // Track hovered element when Cmd is held
  useEffect(() => {
    if (!metaHeld) {
      setHoverRect(null);
      return;
    }

    const onMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el && el !== document.documentElement && el !== document.body) {
        setHoverRect(el.getBoundingClientRect());
      } else {
        setHoverRect(null);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [metaHeld]);

  return (
    <>
      {/* Cmd-held tooltip */}
      {metaHeld && !target && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2147483647,
            background: "rgba(30, 30, 30, 0.95)",
            color: "#f4f4f4",
            padding: "6px 12px",
            borderRadius: 9999,
            border: "1px solid #393939",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 11,
            pointerEvents: "none",
          }}
        >
          Click any element to inspect
        </div>
      )}

      {/* Hover highlight when Cmd is held — red tint, always visible on light and dark */}
      {metaHeld && !target && hoverRect && (
        <div
          style={{
            position: "fixed",
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
            background: "rgba(255, 59, 59, 0.07)",
            border: "1.5px solid rgba(255, 59, 59, 0.4)",
            borderRadius: 3,
            pointerEvents: "none",
            zIndex: 2147483645,
            transition: "all 60ms ease-out",
          }}
        />
      )}

      {target && <InspectorPanel target={target} onClose={clear} />}
    </>
  );
}
