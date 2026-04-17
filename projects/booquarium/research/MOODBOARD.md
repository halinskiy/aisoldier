# booquarium — Moodboard & Accent

**Date:** 2026-04-17
**Product context:** Template sold on Etsy. Buyers are authors. The accent must look stunning in the preview thumbnail — first impression is a 600×400 image in an Etsy grid next to beige competitors.

## Emotional ambition
Three words: **literary, tactile, quietly confident.**

The page should feel like holding a well-made hardcover — uncoated paper, foil-stamped spine, deckle edge. Premium but not luxury-brand-cold. Warm but not Hallmark-warm. Proud but not shouty.

## Accent candidates

### Option A — Ink Crimson
- **Hex:** `#B8322C`
- **Hover:** `#9E2923`
- **Subtle:** `rgba(184, 50, 44, 0.08)`
- **Rationale:** The color of a foil-stamped Penguin Classics spine. Signals *book* before any word is read. High contrast on cream and on ink-black, legible on both themes. Distinct from Etsy's beige field — instantly breaks the scroll in the marketplace thumbnail grid. Reads as genre-agnostic: works for literary, thriller, romance, non-fiction. Against IBM Plex Serif it feels like letterpress ink on uncoated paper.
- **Mood reference:** foil-stamped, letterpress, authoritative
- **Risks:** Too aggressive for romance buyers if overused. Mitigation: restrict to accents (links, underlines, primary CTA, chapter numerals) — never fill a full hero block.
- **Preview-thumbnail test:** stands out in an Etsy grid against the field of beiges and rose-golds. Likely winner here.

### Option B — Deckle Ochre
- **Hex:** `#C2884A`
- **Hover:** `#A97433`
- **Subtle:** `rgba(194, 136, 74, 0.10)`
- **Rationale:** The color of deckle-edge uncoated paper, aged linen, old library card catalog. Warm, literary, slightly nostalgic — evokes McNally Jackson, Strand, independent bookstore. Pairs with IBM Plex Serif for a manuscript feel. Works on cream (low contrast, handle with care) and on ink-black (stunning, reads as gold leaf).
- **Mood reference:** linen, archival, bookish
- **Risks:** Lower contrast on light theme — may fail WCAG AA on body text (use only for accents, never body). In the Etsy thumbnail it risks blending with competitors' beiges.
- **Preview-thumbnail test:** works only if we ship dark-theme preview as the hero Etsy image.

### Option C — Manuscript Indigo
- **Hex:** `#1E3A5F`
- **Hover:** `#152843`
- **Subtle:** `rgba(30, 58, 95, 0.08)`
- **Rationale:** The color of fountain-pen ink on cotton paper. Serious, literary, trustworthy. Closer to non-fiction / memoir / business-book registers than fiction. Excellent contrast on cream. Evokes Moleskine, Blackwing, Field Notes — tools authors actually use.
- **Mood reference:** ink, archival, studious
- **Risks:** Reads as corporate if paired with any SaaS cliché — we must keep layout editorial, not LinkedIn-professional. Can feel cold on dark theme; avoid dark-default if we pick this.
- **Preview-thumbnail test:** distinct from Etsy beige field, but less urgent/clickable than Crimson.

## Recommended default
**Option A — Ink Crimson (`#B8322C`).** Strongest thumbnail differentiation in Etsy grid, widest genre applicability, most energy to carry a 3D book hero. If the buyer writes memoir or business, we document Option C as a documented swap in the template's style guide.

## Chosen
- **Hex:** `{{pending user confirmation}}`
- **Why:**

## Visual references
- https://granta.com — editorial serif + restrained accent + small caps
- https://www.penguinclassics.com — foil-stamp crimson on cream (Option A north star)
- https://mcnallyjackson.com — bookstore warmth, uncoated textures
- https://www.fsgbooks.com — FSG — publisher typography benchmark
- https://lithub.com — dense blurb wall in editorial register
- https://landonorris.com — proof a single saturated accent on mono carries a whole 3D-driven site
- https://igloo.inc — 3D hero + readable editorial copy coexistence
- https://www.are.na — dot-grid + editorial minimalism + single accent

## Typographic accents (deviation from IBM Plex)
None. Doctrine holds. IBM Plex Serif (headings, book spine lettering, pull-quotes, chapter numerals) + IBM Plex Sans (nav, labels, body, captions, buttons, meta). **IBM Plex Mono is permitted sparingly** — only for colophon block footer and progress indicators, where it reinforces the "bookcraft / print metadata" feel. Flag any Mono usage in HANDOFF.md.

## Photography / illustration direction
- **No stock photography. Ever.** No laptop-on-desk, no coffee-cup-on-book, no woman-typing-in-cardigan.
- **Textures yes:** uncoated paper, linen, deckle edges, foil-stamp detail, typewriter key macro. Supplied as buyer-swappable image slots.
- **Author portrait slot:** single high-contrast B&W portrait, optional. Treated as a plate, not a hero — 1:1 aspect, bordered, small-caps caption beneath.
- **The 3D book is the illustration.** It replaces every decorative image the Etsy field wastes hero real estate on.
- **Dot-grid background** from doctrine rule 9 — use as "paper" on light theme, "ink" on dark.
