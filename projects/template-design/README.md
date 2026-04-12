# Template-Design — Strategic Wealth Management Landing

A production-ready reference build of a serif-editorial wealth-management landing page, designed to be handed off to a Webflow developer for final rebuild. Source Figma: [`hdriqKesBCNlAVapaGQXO6`](https://www.figma.com/design/hdriqKesBCNlAVapaGQXO6/Template-Design?node-id=0-1).

The audience is HNW/UHNW individuals, family offices, and institutional allocators evaluating fiduciary wealth managers. The voice is editorial, confident, and transparent — "quiet money" rather than incumbent-bank marketing. The entire design is built around a single warm orange accent `#FF512A` on a cream paper background `#F8F7F1`, with IBM Plex Serif for headings and IBM Plex Sans for everything else.

## Status

| Metric | Result |
|---|---|
| Sections | **13 / 13** built |
| Designer gaps closed | **17 / 17** (all numerically verified via CDP contract tests) |
| Lighthouse Performance | **99** |
| Lighthouse Accessibility | **100** |
| Lighthouse Best Practices | **96** |
| Lighthouse SEO | **100** |
| Production bundle | 94.1 kB route, 196 kB First Load JS |
| Full-page height | 12861 px (Figma target 12912, -0.4%) |
| Kit components promoted | **12** |
| Sessions | **15** |

## Quick start

```bash
cd projects/template-design
npm install
npm run dev           # dev server on http://localhost:3456
```

Production:

```bash
npm run build         # static prerendered, ~5s
npm run start         # serve build on $PORT (default 3000)
```

Type-check:

```bash
npm run typecheck
```

## How to read the spec

Start here if you are the Webflow developer or a reviewer:

| File | What it is |
|---|---|
| `FIGMA_SPEC.md` | **~950-line scrupulous Figma inventory.** Every section's geometry, text content, and designer gap flagged with colour priority. Start here. |
| `HANDOFF.md` | **The Webflow developer's action list.** Per-section `✅ BUILT` notes, Webflow verdict (NATIVE IX2 / CUSTOM EMBED / SIMPLIFY), and the three compliance must-fixes that MUST be preserved on rebuild. |
| `DECISIONS.md` | **15 ADRs.** Every significant architectural choice with alternatives considered and rationale. Read this before changing anything — you will find the "why" here. |
| `CHANGELOG.md` | Session-by-session log. 15 sessions, each with what was built, what was fixed, and what's next. |
| `BRIEF.md` | One-page project summary — audience, accent, pattern shortlist, success criteria. |
| `COMPONENTS.md` | Which kit components were used, which local components exist, which were promoted, and why. |
| `DESIGN_SYSTEM.md` | Token snapshot for this project — delta from `ui-kit/TOKENS.md`. Fonts, sizes, colors, easing. |
| `ARCHITECTURE.md` | Folder layout, path aliases, build pipeline, dev-only Inspector wiring. |
| `content/*.json` | Extracted copy — `copy.json`, `testimonials.json`, `stats.json`, `faq.json`. The UI is pure composition; text is never hardcoded in TSX. |
| `embeds/` | Vanilla JS + CSS snippets the Webflow developer pastes into Webflow Embed elements to reproduce motion behaviour. Includes `blur-reveal.js`, `magnetic-button.js`, `count-up-stats.js`, and a paste-order `README.md`. |
| `research/` | Kickoff research: audience profile, competitor scan, trend catalog, moodboard. |

## Inspector — Cmd+click any element to see its source

Every component in the kit and every section in this project carries three data-attributes on its root element:

```html
<div
  data-component="SectionHeader"
  data-source="ui-kit/components/section/SectionHeader.tsx"
  data-tokens="text-h3,lh-h3,ls-h3,font-serif,color-text,color-text-muted"
>
```

In development, the Inspector overlay is mounted automatically (`process.env.NODE_ENV === "development"`). **Cmd+click** any element and a floating panel appears with the component name, source path (clickable — opens in your editor via `cursor://` protocol), computed size in pixels, and a list of design tokens used.

![Inspector panel showing EyebrowLabel](../../../tmp/aisoldier-shots/desktop-inspector.png)

This is how the Webflow developer maps a visual element in the running reference build back to its source file — no guesswork, no grep.

## Tech stack

- **Next.js 15** (App Router) + React 19 + TypeScript strict
- **Tailwind CSS v4** via `@tailwindcss/postcss` — no `tailwind.config.js`, all tokens live in `@theme` blocks in CSS
- **Framer Motion 12** — used sparingly for interactions (nav overlay, FAQ accordion, magnetic button, split text). Scroll-linked reveals use plain CSS + one IntersectionObserver.
- **Lenis 1.1** — smooth scroll, wired at root via `ReactLenis`
- **react-hook-form + zod** — Section 11 contact form validation (schema in `src/lib/contactSchema.ts`)
- **`@aisoldier/ui-kit`** — shared design system, installed as a `file:../../ui-kit` dependency. 12 components + utilities. See `ui-kit/INDEX.md`.
- **No icon library** — every icon is a hand-written inline SVG (wave glyph, chevrons, arrows, stars, socials).
- **No component library** — no shadcn/Radix/MUI/headless-ui. The kit is built from scratch in Tailwind against the project's own tokens.

## Motion contract

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` everywhere. Nothing bounces. Nothing overshoots.
- **Motion pass:** scroll-triggered reveals use CSS + a single `IntersectionObserver` that flips `data-motion-state` attributes. Per-element stagger via `data-motion-index` (60 ms step).
- **Interactions ship live:** mobile burger overlay, FAQ accordion open/close, Contact form state machine are all immediate — no scroll-reveal deferral.
- **Reduced motion:** `prefers-reduced-motion: reduce` skips every reveal, count-up, and magnetic effect via a belt-and-suspenders CSS `@media` override.
- **Escape hatch:** `http://localhost:3456/?motion=0` renders every element in its final state without animation — used for regression screenshots.

## Contributing / handoff

This is a 2-person studio project (designer + developer). Direction and content decisions go through the designer; engineering decisions are documented in `DECISIONS.md` before implementation. Style conventions live in the root `~/Aisoldier/CLAUDE.md` doctrine and are non-negotiable unless explicitly overridden.

**Handoff to Webflow:** deliver this repo's `HANDOFF.md` + `embeds/` folder. The Webflow developer's workflow: (1) build each section following the Webflow verdict in HANDOFF, (2) paste the relevant embed snippets into HTML Embed elements, (3) verify against the running reference build at `localhost:3456` using Cmd+click Inspector to map visual elements back to tokens.

**License:** internal / client-specific. No public distribution.

**Contact:** 3mpq studio. For questions about this build, reference the session number in `CHANGELOG.md` and the ADR number in `DECISIONS.md`.
