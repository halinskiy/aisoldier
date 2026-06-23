"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";

import { useEnhancementEnabled } from "@ui-kit/components/motion/useEnhancementEnabled";
import { useScrubProgress } from "@ui-kit/hooks/useScrubProgress";

/* -------------------------------------------------------------------------- */
/*  CTAConvergence (V3) - the scroll CLIMAX, composed rest                       */
/* -------------------------------------------------------------------------- */
/**
 * The narrative climax, SCRUBBED on a 150vh runway (SECTION_CONTRACT_V3 S7a /
 * DIRECTION_V3 A6): the record -> Dropbox -> link chain converges one last time
 * and the page comes to REST on the full composed payoff.
 *
 * POLISH (2026-06-23): the headline now lives INSIDE the sticky stage and the
 * whole group is vertically CENTERED. All beat transforms finish by p~0.85; from
 * p0.85 -> 1 the composed cluster (headline + resolved link pill + Download +
 * note) HOLDS static and centered, exactly the way the Hero rests on its share
 * card. Previously the headline sat above the pin and the centered content
 * scrolled off the top before p=1, ending the page on a black void. The link
 * pill is now full-width inside a tall card (max-w-[640px]) so the SHARE string
 * is NEVER truncated and the clip-reveal finishes at inset(0 0 0 0).
 *
 * Engine instance: 150vh runway + sticky 100vh stage + useScrubProgress(ref)
 * -> one `p` (J5). Beats, compositor props only:
 *   beat 1  p 0.04-0.22  the dot arrives (pulsing live), confident 24px.
 *   beat 2  p 0.20-0.46  dot blooms into the file-capture card (blur seam).
 *   beat 3  p 0.44-0.66  card morphs to the Dropbox folder + red sync dot.
 *   beat 4  p 0.64-0.85  folder clip-reveals into the live link card, FULL
 *                        width, finishing at inset(0) by 0.85.
 *   rest    p 0.85-1.00  everything static and centered (the payoff at rest).
 *
 * No per-beat text label inside the stage (the convergence IS the sentence).
 *
 * Static mode (reduced-motion / ?motion=0 / SSR / narrow): runway collapses, pin
 * drops, the composed rest is rendered (headline + resolved link card + Download
 * + note). CLS 0. Geist Mono ONLY for the link string.
 *
 * Project-local custom embed (HANDOFF.md).
 */

const SHARE = "tracer.nocorny.com/v/k7r2-mx9p";

export function CTAConvergence({
  heading,
  downloadLabel,
  downloadHref,
  note,
}: {
  heading: string;
  downloadLabel: string;
  downloadHref: string;
  note: string;
}) {
  const enhance = useEnhancementEnabled({ minWidth: 1024 });

  // STATIC FALLBACK: hook-free, the composed rest state.
  if (!enhance) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-10 py-24 text-center">
        <Heading text={heading} />
        <div className="w-full max-w-[640px]">
          <LinkCard />
        </div>
        <RestActions
          downloadLabel={downloadLabel}
          downloadHref={downloadHref}
          note={note}
        />
      </div>
    );
  }

  return (
    <CTAScrubbed
      heading={heading}
      downloadLabel={downloadLabel}
      downloadHref={downloadHref}
      note={note}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  CTAScrubbed - mounted only when enhanced; owns the scroll engine            */
/* -------------------------------------------------------------------------- */

function CTAScrubbed({
  heading,
  downloadLabel,
  downloadHref,
  note,
}: {
  heading: string;
  downloadLabel: string;
  downloadHref: string;
  note: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrubProgress(ref); // ONE spring (J5). ref is ALWAYS attached.

  // The headline is the persistent anchor: it is present from the FIRST frame
  // of the pinned stage (no clip-reveal) so the CTA stage is never an empty void
  // while the convergence subject is still arriving. It fills the upper stage.

  // beat 1: the arriving dot (visible 0.04 - 0.22)
  const dotOpacity = useTransform(p, [0, 0.04, 0.18, 0.24], [0, 1, 1, 0]);
  const dotX = useTransform(p, [0, 0.18], ["-48px", "0px"]);
  const dotBlur = useTransform(p, [0.18, 0.24], ["blur(0px)", "blur(2px)"]);

  // beat 2: the capture card (0.20 - 0.46)
  const capOpacity = useTransform(p, [0.18, 0.26, 0.42, 0.48], [0, 1, 1, 0]);
  const capScale = useTransform(p, [0.2, 0.46], [0.94, 1]);
  const capBlur = useTransform(
    p,
    [0.26, 0.34, 0.38, 0.46],
    ["blur(0px)", "blur(2px)", "blur(0px)", "blur(2px)"],
  );

  // beat 3: the Dropbox folder (0.44 - 0.66)
  const folderOpacity = useTransform(p, [0.42, 0.5, 0.6, 0.66], [0, 1, 1, 0]);
  const folderScale = useTransform(p, [0.44, 0.66], [0.94, 1]);
  const folderBlur = useTransform(
    p,
    [0.5, 0.56, 0.6, 0.66],
    ["blur(0px)", "blur(2px)", "blur(0px)", "blur(2px)"],
  );

  // beat 4: the live link card clip-reveals (0.64 - 0.85), then RESTS.
  const linkOpacity = useTransform(p, [0.62, 0.68], [0, 1]);
  const linkClip = useTransform(
    p,
    [0.64, 0.85],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const linkY = useTransform(p, [0.64, 0.8], ["20px", "0px"]);

  // Download + note ride up into rest as the link resolves (0.78 - 0.92), then hold.
  const actionsOpacity = useTransform(p, [0.78, 0.9], [0, 1]);
  const actionsY = useTransform(p, [0.78, 0.92], ["18px", "0px"]);

  return (
    <div ref={ref} style={{ height: "150vh" }}>
      <div
        className="flex flex-col items-center justify-center overflow-hidden text-center"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {/* the composed group: headline + morph subject + actions, centered */}
        <div className="flex w-full max-w-[640px] flex-col items-center gap-10">
          {/* headline, inside the pin so it co-exists with the resolved pill.
              Always present (the anchor), never an empty stage while the subject
              is still arriving. */}
          <Heading text={heading} />

          {/* the convergence subject: one large focal point, beats cross-fade.
              A tall box centered so the subject reads substantial, never a
              speck floating over a void. */}
          <div className="relative flex h-[160px] w-full items-center justify-center">
            {/* beat 1: the arriving dot */}
            <motion.span
              className="absolute h-[24px] w-[24px] rounded-full"
              style={{ background: "var(--color-accent)", opacity: dotOpacity, x: dotX, filter: dotBlur, willChange: "transform, opacity, filter" }}
              aria-hidden
            >
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--color-accent)" }}
                animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.span>

            {/* beat 2: the capture card */}
            <motion.div
              className="absolute"
              style={{ opacity: capOpacity, scale: capScale, filter: capBlur, willChange: "transform, opacity, filter" }}
              aria-hidden
            >
              <CaptureCard />
            </motion.div>

            {/* beat 3: the Dropbox folder */}
            <motion.div
              className="absolute"
              style={{ opacity: folderOpacity, scale: folderScale, filter: folderBlur, willChange: "transform, opacity, filter" }}
              aria-hidden
            >
              <DropboxFolder />
            </motion.div>

            {/* beat 4: the live link card, clip-revealed to rest (full width) */}
            <motion.div
              className="absolute w-full px-2"
              style={{ opacity: linkOpacity, y: linkY, clipPath: linkClip, willChange: "clip-path, transform, opacity" }}
            >
              <LinkCard />
            </motion.div>
          </div>

          {/* Download + note: ride into the composed rest, then hold static */}
          <motion.div
            style={{ opacity: actionsOpacity, y: actionsY, willChange: "transform, opacity" }}
          >
            <RestActions
              downloadLabel={downloadLabel}
              downloadHref={downloadHref}
              note={note}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Heading({ text }: { text: string }) {
  return (
    <h2
      className="font-[family-name:var(--font-display)] font-semibold text-white/90"
      style={{
        fontSize: "var(--text-display-md)",
        lineHeight: "var(--lh-h2)",
        letterSpacing: "var(--ls-display)",
        maxWidth: "18ch",
      }}
    >
      {text}
    </h2>
  );
}

function RestActions({
  downloadLabel,
  downloadHref,
  note,
}: {
  downloadLabel: string;
  downloadHref: string;
  note: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <DownloadButton label={downloadLabel} href={downloadHref} />
      <p className="font-[family-name:var(--font-sans)] text-[16px] text-white/40">
        {note}
      </p>
    </div>
  );
}

function DownloadButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="inline-flex shrink-0 items-center rounded-[var(--radius-button)] bg-[var(--color-accent)] px-7 py-3.5 font-[family-name:var(--font-sans)] text-[16px] font-medium text-white transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-out)] hover:bg-[var(--color-accent-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ink-surface)]"
    >
      {label}
    </a>
  );
}

/* The resolved share-link as a full-width card (no truncation). */
function LinkCard() {
  return (
    <div
      className="w-full rounded-[var(--radius-window)] px-7 py-5"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline-strong)",
        boxShadow: "var(--shadow-dark-lg)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate text-left font-[family-name:var(--font-mono)] text-[20px] text-[var(--color-on-dark)] opacity-90">
          {SHARE}
        </span>
        <span
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--color-on-dark)]"
          style={{
            background: "var(--color-accent)",
            border: "1px solid var(--color-on-dark-hairline)",
          }}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7.5L5.5 10.5L11.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

function CaptureCard() {
  return (
    <div
      className="flex items-center gap-5 rounded-[var(--radius-window)] px-7 py-6"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
        minWidth: 420,
      }}
    >
      <span
        className="h-[15px] w-[15px] shrink-0 rounded-full"
        style={{ background: "var(--color-accent)" }}
      />
      <span className="flex items-end gap-[4px]" aria-hidden>
        {[12, 22, 10, 26, 16, 24, 11, 20].map((h, i) => (
          <span
            key={i}
            className="w-[4px] rounded-full bg-[var(--color-on-dark)] opacity-50"
            style={{ height: h }}
          />
        ))}
      </span>
      <span className="ml-1 font-[family-name:var(--font-mono)] text-[18px] text-[var(--color-on-dark)] opacity-70">
        recording.mp4
      </span>
    </div>
  );
}

function DropboxGlyph() {
  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 32 30"
      fill="none"
      aria-hidden
      className="shrink-0 text-[var(--color-on-dark)]"
      style={{ opacity: 0.6 }}
    >
      <path
        d="M8 0L0 5.2L8 10.4L16 5.2L8 0ZM24 0L16 5.2L24 10.4L32 5.2L24 0ZM0 15.6L8 20.8L16 15.6L8 10.4L0 15.6ZM24 10.4L16 15.6L24 20.8L32 15.6L24 10.4ZM8 22.5L16 27.7L24 22.5L16 17.3L8 22.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DropboxFolder() {
  return (
    <div
      className="flex items-center gap-5 rounded-[var(--radius-window)] px-7 py-6"
      style={{
        background: "var(--color-on-dark-glass)",
        border: "1px solid var(--color-on-dark-hairline)",
        boxShadow: "var(--shadow-dark-lg)",
        minWidth: 420,
      }}
    >
      <DropboxGlyph />
      <span className="font-[family-name:var(--font-mono)] text-[18px] text-[var(--color-on-dark)] opacity-80">
        ~/Dropbox/Tracer/
      </span>
      <span
        className="ml-auto h-[10px] w-[10px] rounded-full"
        style={{ background: "var(--color-accent)" }}
        aria-hidden
      />
    </div>
  );
}
