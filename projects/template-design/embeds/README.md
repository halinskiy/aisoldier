# Webflow Embed Snippets

Vanilla JS + inline CSS that reproduce the React reference build's motion
behaviour inside a Webflow project. Each file is self-contained — paste it
into an HTML Embed element at the bottom of the page (or in the page's
custom code footer).

## Files

| File | Attribute | Purpose |
|---|---|---|
| `blur-reveal.js` | `data-motion="blur-reveal"` / `data-motion="line-draw"` | Scroll-triggered reveal + connector line draw. Includes the CSS transitions. One paste covers every section that has `data-motion` attributes. |
| `magnetic-button.js` | `data-magnetic="true"` | Pointer-tracking translate for primary CTAs. In the React build this is the kit `Button magnetic` prop — in Webflow you add the attribute on the button. Rendered only on desktop pointer devices (respects `prefers-reduced-motion`). |
| `count-up-stats.js` | `data-count-up` | Animates the numeric prefix of stats row numbers ("500+", "$3.2B+", "18 years", "400+") from 0 to the target on scroll-in. |

## Order

Paste them in this order if you're using a single Embed block:

1. `blur-reveal.js` — the `<script>` + `<style>` together. This is the only one with style.
2. `magnetic-button.js`
3. `count-up-stats.js`

All three respect `prefers-reduced-motion: reduce` and gracefully degrade.

## What's NOT in this folder

- **Lenis smooth-scroll** — Webflow has its own smooth-scroll option. Enable Interactions 2.0 "smooth scroll" and you're done, or install the Lenis embed from https://lenis.darkroom.engineering/ if you want the same feel as the React build.
- **SplitText (per-word reveal)** — in the React build this is a word-by-word reveal on About paragraphs. In Webflow use the native "text split" interaction if your plan supports it, or leave the paragraphs as simple `blur-reveal` targets.
- **Hero scroll-pin** — the React build is deliberately static on the hero (no scroll-pin implemented — see `DECISIONS.md` "Motion pass consolidated"). If you want Hero compression, use Webflow IX2 "sticky + scroll-in-view" with a scale transform.
- **FAQ accordion** — Webflow has a native accordion element. Replace the React FAQ with it. Match the `border-t` between items, `44×44` chevron ghost circle, `560px` answer column, and the same `cubic-bezier(0.16, 1, 0.3, 1)` easing.

## Contract tests

Each snippet in the React build has a CDP assertion that verifies behaviour
at runtime. When rebuilding in Webflow, you can verify the same things:

- `blur-reveal` — open devtools, scroll to any section, confirm the element's
  `data-motion-state` attribute flips from `initial` → `visible` and the
  opacity transitions smoothly.
- `count-up-stats` — watch the stat numbers interpolate from 0 to target
  when they scroll in.
- `magnetic-button` — hover the primary CTA, confirm the button drifts
  toward the cursor and snaps back on mouseleave.

Motion discipline matches the React build: `cubic-bezier(0.16, 1, 0.3, 1)`
easing on every transition, no elastic / bounce, no overshoot.
