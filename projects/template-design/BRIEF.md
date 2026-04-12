# template-design — Brief

**Date:** 2026-04-11
**Status:** spec-complete, ready to scaffold Next.js
**Figma:** https://www.figma.com/design/hdriqKesBCNlAVapaGQXO6/Template-Design?node-id=0-1

## Goal
A serif-editorial wealth-management landing that converts HNW/UHNW and family-office prospects into scheduled discovery calls, while visibly signalling fiduciary integrity.

## Audience (from research/AUDIENCE.md)
- **Who:** HNW/UHNW individual investors, family office principals, institutional allocators
- **Pain:** fatigue with opaque fee structures and generic bank marketing
- **Emotion we trigger:** calm, informed, respected
- **Register:** editorial, confident, transparent. Short declarative sentences. Plex Serif + Plex Sans.

## Competitors / references (from Figma annotations)
- `humbldesign.io` — tone/structure reference
- `forfuture.webflow.io` — copy source (some placeholder text is lifted from here)
- `puchix-studio.webflow.io` — motion reference, designer noted "Анимация появления секций"

Full competitor audit pending in `research/COMPETITORS.md`.

## Trends considered
Base catalog: `~/Aisoldier/research/awwwards-2024-2026-patterns.md`. Dominant patterns used:
- **Editorial serif headings + small-caps eyebrows** — core aesthetic
- **Single warm accent (orange-red)** — matches designer's Style Guide
- **Bento / feature grids** — Section 4, 6
- **Scroll-pinned hero compression** — Section 1
- **Split-text word reveal** — Section 2
- **3-col testimonial grid with trailing orphan** — Section 8

## Accent chosen
**`#FF512A`** — warm orange-red. Source: Figma Style Guide `Accent` variable.
Rationale: modern-finance (Ramp / Mercury territory) vs incumbent blue. Signals challenger identity without losing trust.

## Pattern shortlist (from ui-kit/PATTERNS.md + fresh inference)
1. **NavSticky** — transparent → backdrop-blur on scroll (Section 0)
2. **HeroPinned** — scroll-compressed hero with tight serif display (Section 1)
3. **SplitTextReveal** — word stagger for about paragraphs (Section 2)
4. **StatsRow** — 4-col number block with count-up (Sections 3, 8)
5. **ImageCardGrid** — 2×3 image cards with overlay captions (Sections 4, 6)
6. **ServiceListRow** — full-width rows (Section 5)
7. **TestimonialCard** — quote + stars + author (Section 8)
8. **ProcessSteps** — numbered circles with connector lines (Section 9)
9. **FAQAccordion** — single-open layout-animated list (Section 10)
10. **ContactSection** — dark 2-col with form (Section 11)
11. **FooterEditorial** — dark multi-area footer (Section 12)

## Sections planned (desktop 1440 baseline)
1. **NavSticky** — 89px
2. **Hero** — 733px
3. **About (Hero 2)** — 602px
4. **Our Approach** — 724px
5. **Services showcase** (inferred) — 1314px
6. **Services list** — 1089px
7. **Case Studies** — 1876px
8. **Mid-page banner** (inferred) — 661px
9. **Testimonials + Stats** — 2493px
10. **Our Process** — 773px
11. **FAQ** — 1313px
12. **Contact form** (inferred) — 748px
13. **FooterEditorial** — 496px

Total desktop height: ~12,912px (matches Figma)

## Success criteria
- Pixel-perfect to Figma at 1440 baseline
- Fully responsive 480 → 1920+ without gaps or overlaps
- All 17 designer gaps from `FIGMA_SPEC.md` resolved in code
- Inspector overlay works — Cmd+click surfaces component name, source path, tokens
- Webflow handoff package includes `HANDOFF.md` + all custom-embed snippets
- Lighthouse performance ≥90, accessibility ≥95
