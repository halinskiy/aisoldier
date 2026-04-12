import { useEffect, useState } from "react";

export type InspectorTarget = {
  element: HTMLElement;
  component: string;
  source: string;
  tokens: string[];
  rect: DOMRect;
  /* v2 additions */
  tagName: string;
  parentDisplay: string;
  childCount: number;
  motionData: {
    motionAttribute: string | null;
    transitionValue: string;
  };
};

/**
 * Find the element to inspect. Strategy:
 *   1. If the clicked element itself has `data-component`, use it.
 *   2. Otherwise, use the clicked element directly — this lets the user
 *      inspect ANY element on the page (divs, spans, containers without
 *      data-component), which is essential for spacing inspection.
 *   3. Skip `<html>`, `<body>`, and text nodes.
 */
function findInspectable(start: EventTarget | null): HTMLElement | null {
  let el = start as HTMLElement | null;
  if (!el || el === document.documentElement || el === document.body) return null;
  // Walk up to find a data-component, but cap at 3 levels — if none found, use the original
  const original = el;
  for (let i = 0; i < 4; i++) {
    if (el && el.hasAttribute?.("data-component")) return el;
    if (!el?.parentElement || el.parentElement === document.body) break;
    el = el.parentElement;
  }
  // No data-component found nearby — return the original clicked element
  return original;
}

export function useInspectorHotkey() {
  const [target, setTarget] = useState<InspectorTarget | null>(null);
  const [metaHeld, setMetaHeld] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) setMetaHeld(true);
      if (e.key === "Escape") setTarget(null);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) setMetaHeld(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const el = findInspectable(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();

      const parentCs = el.parentElement
        ? getComputedStyle(el.parentElement)
        : null;
      const cs = getComputedStyle(el);

      setTarget({
        element: el,
        component: el.getAttribute("data-component") ?? "Unknown",
        source: el.getAttribute("data-source") ?? "",
        tokens: (el.getAttribute("data-tokens") ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        rect: el.getBoundingClientRect(),
        tagName: el.tagName.toLowerCase(),
        parentDisplay: parentCs?.display ?? "block",
        childCount: el.children.length,
        motionData: {
          motionAttribute: el.getAttribute("data-motion"),
          transitionValue: cs.transition,
        },
      });
    };
    const onScroll = () => {
      setTarget((t) =>
        t ? { ...t, rect: t.element.getBoundingClientRect() } : t,
      );
    };
    const onResize = onScroll;

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", () => setMetaHeld(false));
    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { target, metaHeld, clear: () => setTarget(null) };
}
