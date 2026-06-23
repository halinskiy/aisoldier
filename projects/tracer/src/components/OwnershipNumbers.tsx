"use client";

import { useRef, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";
import { useScrubProgress } from "@ui-kit/hooks/useScrubProgress";

/* -------------------------------------------------------------------------- */
/*  OwnershipNumbers (V3) - A5 scroll-scrubbed proof strip                      */
/* -------------------------------------------------------------------------- */
/**
 * Three ownership facts as SCRUBBED objects, not a bullet list (SECTION_CONTRACT
 * _V3 S5b / A5): the file-size counts up, the upload bar fills, "0 servers"
 * clip-reveals, and "MIT" fades in, all bound to this strip's own scroll
 * progress. A fact you scrub into being reads designed; a fact list reads AI.
 *
 * Engine instance: 150vh runway + sticky 100vh stage + useScrubProgress(ref)
 * -> one `p` (J5). All mappings are compositor props (count is a number fed
 * through useMotionValueEvent into local state for display text only - no
 * setState in a scroll HANDLER, just a value subscription, J3-safe).
 *
 * Facts (verbatim from the product truth, nothing invented):
 *   ~12MB app size, 0 video on NoCorny servers, MIT licensed.
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): final values shown,
 * bar full, no runway, no pin. CLS 0.
 *
 * Project-local; Tracer-specific composition.
 */
export function OwnershipNumbers() {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });

  // STATIC FALLBACK: hook-free, final values.
  if (!enhance) {
    return (
      <div className="grid grid-cols-1 gap-px lg:grid-cols-3">
        <NumberCell value="~12MB" label="The whole app" barScaleX={1} />
        <ClipCell value="0 servers" label="Video on our infrastructure" clip="none" />
        <FadeCell value="MIT" label="Licensed, every line" opacity={1} y="0px" />
      </div>
    );
  }

  return <OwnershipNumbersScrubbed />;
}

/* -------------------------------------------------------------------------- */
/*  OwnershipNumbersScrubbed - mounted only when enhanced; owns the engine      */
/* -------------------------------------------------------------------------- */

function OwnershipNumbersScrubbed() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrubProgress(ref); // ONE spring (J5). ref is ALWAYS attached.

  // Beats finish by ~p0.78 then hold, so the strip rests composed before the
  // runway ends (no empty tail before the truth rows enter).
  const count = useTransform(p, [0.05, 0.5], [0, 12]);
  const barScaleX = useTransform(p, [0.05, 0.5], [0, 1]);
  const serversClip = useTransform(
    p,
    [0.34, 0.62],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const mitOpacity = useTransform(p, [0.55, 0.78], [0, 1]);
  const mitY = useTransform(p, [0.55, 0.78], ["14px", "0px"]);

  const [shown, setShown] = useState(0);
  useMotionValueEvent(count, "change", (v) => setShown(Math.round(v)));

  return (
    <div ref={ref} style={{ height: "120vh" }}>
      <div
        className="flex items-center overflow-hidden"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        <div className="grid w-full grid-cols-1 gap-px lg:grid-cols-3">
          {/* ~12MB with a filling upload bar */}
          <Cell>
            <span
              className="font-[family-name:var(--font-display)] font-semibold tabular-nums text-[var(--color-on-dark)]"
              style={{ fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)" }}
            >
              ~{shown}MB
            </span>
            <CellLabel>The whole app</CellLabel>
            <div
              className="mt-6 h-[6px] w-full overflow-hidden rounded-[var(--radius-pill)]"
              style={{ background: "var(--color-on-dark-hairline)" }}
            >
              <motion.div
                className="h-full origin-left rounded-[var(--radius-pill)]"
                style={{ background: "var(--color-accent)", scaleX: barScaleX, willChange: "transform" }}
              />
            </div>
          </Cell>

          {/* "0 servers" clip-revealed */}
          <Cell>
            <motion.span
              className="block whitespace-nowrap font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
              style={{ fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)", clipPath: serversClip, willChange: "clip-path" }}
            >
              0 servers
            </motion.span>
            <CellLabel>Video on our infrastructure</CellLabel>
          </Cell>

          {/* "MIT" faded in */}
          <Cell>
            <motion.span
              className="block font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
              style={{ fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)", opacity: mitOpacity, y: mitY, willChange: "transform, opacity" }}
            >
              MIT
            </motion.span>
            <CellLabel>Licensed, every line</CellLabel>
          </Cell>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col px-2 py-8 lg:px-8">{children}</div>
  );
}

function CellLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-3 font-[family-name:var(--font-sans)] text-[18px] text-[var(--color-on-dark)] opacity-50">
      {children}
    </span>
  );
}

/* Static-fallback primitives. */
function NumberCell({ value, label, barScaleX }: { value: string; label: string; barScaleX: number }) {
  return (
    <Cell>
      <span
        className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
        style={{ fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)" }}
      >
        {value}
      </span>
      <CellLabel>{label}</CellLabel>
      <div
        className="mt-6 h-[6px] w-full overflow-hidden rounded-[var(--radius-pill)]"
        style={{ background: "var(--color-on-dark-hairline)" }}
      >
        <div
          className="h-full origin-left rounded-[var(--radius-pill)]"
          style={{ background: "var(--color-accent)", transform: `scaleX(${barScaleX})` }}
        />
      </div>
    </Cell>
  );
}

function ClipCell({ value, label }: { value: string; label: string; clip: string }) {
  return (
    <Cell>
      <span
        className="block whitespace-nowrap font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
        style={{ fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)" }}
      >
        {value}
      </span>
      <CellLabel>{label}</CellLabel>
    </Cell>
  );
}

function FadeCell({ value, label }: { value: string; label: string; opacity: number; y: string }) {
  return (
    <Cell>
      <span
        className="block font-[family-name:var(--font-display)] font-semibold text-[var(--color-on-dark)]"
        style={{ fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)" }}
      >
        {value}
      </span>
      <CellLabel>{label}</CellLabel>
    </Cell>
  );
}
