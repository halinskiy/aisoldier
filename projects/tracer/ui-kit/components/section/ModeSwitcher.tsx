"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { EASE_OUT } from "../../lib/motion";

/**
 * ModeSwitcher — an interactive "one input, many outputs" demo. A single static
 * scene sits above a row of real <button> tabs; clicking a tab updates the
 * output panel live to show that tab's result. The visitor DRIVES it, so they
 * understand the product by doing, not by reading captions.
 *
 * Built for utility / dev-tool landings where the value is "one capture, N kinds
 * of data" (or one query, N answers; one upload, N formats). Render any scene
 * you like via `scene`; pass the per-tab outputs via `tabs`.
 *
 * Accessibility (load-bearing):
 *  - Real WAI-ARIA tablist: role="tablist", each tab role="tab", aria-selected,
 *    roving tabindex, ArrowLeft/Right/Up/Down/Home/End keyboard nav.
 *  - Output is role="tabpanel" labelled by the active tab.
 *  - Initialises to the FIRST tab (or `defaultIndex`) so the panel is NEVER blank
 *    under ?motion=0 / reduced-motion / no-JS-yet. Click switching still works
 *    with motion off (just without the cross-fade animation).
 *
 * Motion: output cross-fades on the doctrine pneumatic ease (no bounce). Honours
 * `prefers-reduced-motion` AND the `?motion=0` QA flag (read inline, like
 * BlurReveal), swapping the panel instantly in either case.
 *
 * Theming: chrome is token-driven. On a dark panel pass `tone="dark"` so tabs +
 * borders use the on-dark ramp; on light use the default. The single accent
 * (`--color-accent`) marks the active tab. Promoted from quirky-landing 2026-06-01.
 */

export type ModeSwitcherTab = {
  /** stable id, also used for aria wiring */
  id: string;
  /** short tab label, e.g. "OCR" */
  label: string;
  /** the output body for this tab (any node: a swatch, a code pill, a value) */
  output: React.ReactNode;
  /** optional one-line caption shown muted under the output */
  caption?: string;
};

type ModeSwitcherProps = {
  tabs: ModeSwitcherTab[];
  /** the shared scene shown above the tabs (e.g. a capture frame). Static. */
  scene: React.ReactNode;
  /** which tab resolves on first render. Default 0 (never blank). */
  defaultIndex?: number;
  /** dark panel (on-dark ramp) vs light. Default "light". */
  tone?: "light" | "dark";
  /** accessible label for the tablist */
  tablistLabel?: string;
  /** min panel height to keep the layout stable across outputs (CLS-neutral) */
  minPanelHeight?: number;
  className?: string;
  dataSource?: string;
};

export function ModeSwitcher({
  tabs,
  scene,
  defaultIndex = 0,
  tone = "light",
  tablistLabel = "Choose a mode",
  minPanelHeight = 148,
  className,
  dataSource = "ui-kit/components/section/ModeSwitcher.tsx",
}: ModeSwitcherProps) {
  const reduce = useReducedMotion();
  const [staticMode, setStaticMode] = useState(false);
  const [active, setActive] = useState(defaultIndex);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlStatic =
      new URLSearchParams(window.location.search).get("motion") === "0";
    if (reduce || urlStatic) setStaticMode(true);
  }, [reduce]);

  const tab = tabs[active];
  const dark = tone === "dark";

  function focusTab(i: number) {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusTab(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusTab(active - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  }

  const tabBase =
    "rounded-full border px-4 py-2 text-[16px] font-semibold leading-none transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const body = (
    <>
      {scene}

      <div
        role="tablist"
        aria-label={tablistLabel}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="mt-5 flex flex-wrap gap-2"
      >
        {tabs.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={tabBase}
              style={
                selected
                  ? {
                      borderColor: "var(--color-accent)",
                      background: "var(--color-accent)",
                      color: "var(--color-accent-contrast, #fff)",
                    }
                  : dark
                    ? {
                        borderColor: "rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.05)",
                        color: "var(--color-on-dark, #fff)",
                      }
                    : {
                        borderColor: "var(--color-border, #e5e5e5)",
                        background: "transparent",
                        color: "var(--color-text, #161616)",
                      }
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${tab.id}`}
        className="mt-4 rounded-[12px] border p-5"
        style={{
          minHeight: minPanelHeight,
          borderColor: dark
            ? "rgba(255,255,255,0.1)"
            : "var(--color-border, #e5e5e5)",
          background: dark ? "rgba(255,255,255,0.03)" : "transparent",
        }}
      >
        {staticMode ? (
          <PanelBody tab={tab} dark={dark} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: [...EASE_OUT] }}
            >
              <PanelBody tab={tab} dark={dark} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );

  return (
    <div
      data-component="ModeSwitcher"
      data-source={dataSource}
      data-tokens="accent,border,text,on-dark,radius-window"
      className={className}
    >
      {body}
    </div>
  );
}

function PanelBody({ tab, dark }: { tab: ModeSwitcherTab; dark: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3">
      {tab.output}
      {tab.caption && (
        <p
          className="mt-auto text-[16px]"
          style={{ color: dark ? "rgba(255,255,255,0.6)" : "var(--color-text-muted, #6c6660)" }}
        >
          {tab.caption}
        </p>
      )}
    </div>
  );
}
