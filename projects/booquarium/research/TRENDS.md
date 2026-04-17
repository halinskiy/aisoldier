# booquarium — Fresh Trends Scan

**Date:** 2026-04-17
**Source windows:** Awwwards SOTD/SOTM Feb-April 2026, Codrops demos Q1 2026, React Three Fiber examples gallery, Are.na "publication / editorial" channels.
**Expires:** 2026-05-17. Redo before resuming.

Base reference: `../../../research/awwwards-2024-2026-patterns.md`. This file is the **delta** for the publishing / author / editorial niche.

## Newly-dominant patterns (Q1 2026)

1. **Object-on-pedestal hero (3D).** A single hero object (shoe, perfume bottle, phone, device) sits centered with scroll-linked rotation and material detail. Nike, Apple Vision, Rains, most recent R3F SOTDs. **Direct port:** the book IS the object. Pedestal becomes a paper-textured surface with dot-grid wash and single light from upper-left (11 o'clock).
2. **Page-turn / fold as section transition.** Instead of scroll-fade between sections, sections fold like a book page (CSS 3D `rotateY` + perspective, or R3F curved plane). Seen on editorial sites from mid-2025: readymag showcases, It's Nice That, Are.na's redesign. For booquarium this is on-brief — the whole site feels like the book.
3. **Dense small-caps editorial labels over serif display.** 11px uppercase `tracking-[0.16em]` labels like `Chapter 01 — Premise` above 8-10vw serif headings. Intensified in Q1 2026 — now the default on literary and magazine rebrands (Harper's redesign, Granta, Lit Hub).
4. **Scroll-linked chapter progress.** A thin horizontal or vertical progress bar with chapter markers. Medium, Substack reader view, Paul Graham essays clone shipped Feb 2026 on Codrops.
5. **Typographic "blurb wall" replacing testimonial carousels.** Instead of rotating cards, a dense grid of pull-quotes typeset like a review section inside a paperback. Publication name in small caps, reviewer italicized, quote in serif.

## Patterns fading

1. **Beige-everywhere minimalism.** Reached saturation. The "quiet luxury" beige SaaS look is now actively uncool in editorial. Replaced by high-contrast mono + one saturated accent.
2. **Flat book mockup on desk photography.** Still ubiquitous on Etsy, never seen on Awwwards-tier 2025-2026. We are on the right side of this trend gap.
3. **Parallax depth layers on hero.** Overused 2022-2024. Now feels dated unless combined with genuine 3D.
4. **Rotating author portrait carousel.** Dead.

## Niche-specific patterns (publishing / editorial)

- **The colophon block.** Small print-inspired block at the bottom: "Set in IBM Plex Serif. Printed on recycled dot-grid. Built in Brooklyn, read in Tokyo." Signals bookcraft — every literary publisher site now has one.
- **Chapter-number navigation.** Nav items labeled `01 About`, `02 Books`, `03 Praise`, `04 Events`, `05 Contact`. Tiny move, huge effect.
- **Pull-quote as section break.** Full-bleed single sentence in large serif italic between sections, centered, accent-color em dash. Borrowed from print interior design.
- **Pre-order countdown as editorial element.** A small, bordered card showing "Hardcover · October 14 · 23 days" rather than a garish countdown widget.
- **"Read the first chapter" as primary CTA,** outranking "Buy now". 2026 reader-acquisition wisdom (Substack / Kit blog posts).

## Award winners to study (Feb–Apr 2026 window)

- **Lando Norris (landonorris.com)** — SOTY 2025, still reference-grade. Lime-on-black, R3F helmet. Direct proof that a single high-contrast accent on mono carries a whole site.
- **Messenger 2025 redesign** — near-perfect Awwwards score; interaction as play. The way their "floating bubble" behaves is directly applicable to how our 3D book should feel magnetic and tactile.
- **Igloo Inc (igloo.inc)** — SOTY 2024 but still benchmark for "3D hero that doesn't kill legibility". Our north star for balancing a WebGL canvas with readable editorial copy.
- **Bruno Simon portfolio (bruno-simon.com)** — Jan 2026 SOTM. Too playful to copy wholesale, but the physics-feel of his interactions is what we want the book to feel like: weighty, responsive, mouse-aware.
- **Granta.com 2025 redesign** — the cleanest current example of editorial serif + dense small caps + single accent in publishing.
- **Lithub.com** — dense blurb-wall pattern done well.

## Stuff to steal for this project

- **Object-on-pedestal hero with scroll-linked rotation and cover close-up**, using R3F curved-page geometry from the Wawa Sensei / shreejai pattern. Book rotates subtly on mouse-move (magnetic), opens on scroll past 30%, flips pages by 60%, closes and snaps to back-cover by 90%.
- **Chapter-numbered nav** (`01 Books`, `02 About`, etc.).
- **Pull-quote section breaks** in serif italic with accent em dash.
- **Blurb wall** (not carousel) for praise / reviews — paperback-interior feel.
- **Colophon footer block** with setting credits, print-adjacent language.
- **Pre-order countdown as a bordered editorial card**, not a widget.
- **Scroll-linked chapter progress bar** in the sticky nav.
- **"Read Chapter 1" as primary CTA**, buy links secondary.

## Stuff to NOT copy even though it's trending

- **Scroll-hijack multi-scene storytelling** — kills accessibility, breaks on Webflow handoff, violates doctrine rule on handoff-friendliness. Our 3D book must stay inside one section, not take over the page.
- **Bouncy / elastic page-turn easings** — violates doctrine rule 5 (no overshoot). Use `cubic-bezier(0.16, 1, 0.3, 1)` even for the page flip.
- **Multi-color cover gradients / rainbow accents** — violates doctrine rule 1 (single accent only). Even if romance covers are pastel-plural, our UI chrome stays mono + one accent.
- **Bruno Simon-style physics playground** — wrong register for a literary product.
- **Glossy material shaders on the book** — reads as commercial / corporate. We want paper, cloth, matte, uncoated.
- **Chromatic aberration / RGB split** — too brutalist for a literary audience.
- **Cursor hijacking (hidden OS cursor)** — hurts Etsy buyer trust; they'll think it's broken.

## Sources
- https://www.awwwards.com/websites/sites_of_the_month/ — current window
- https://tympanus.net/codrops/ — Q1 2026 demos
- https://wawasensei.dev/tuto/3d-book-slider-landing-page-threejs-and-react — 3D book geometry reference
- https://github.com/shreejai/book-slider-3d — R3F + Next implementation
- https://github.com/namannehra/flipping-pages + react-pageflip — CSS 3D fallback if R3F is too heavy for a Webflow handoff
- https://granta.com, https://lithub.com, https://harpers.org/issues/ — editorial serif reference
