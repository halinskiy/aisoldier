# template-design — Webflow Handoff

**For:** the Webflow developer who will rebuild this landing.
**Project:** SEC-regulated wealth management landing, built from Figma `hdriqKesBCNlAVapaGQXO6`.
**Full spec:** `FIGMA_SPEC.md` (this file is the action list; the spec is the geometry).

---

## 🔴 MUST-FIX before any publish (legal / brand critical)

| # | What | Where | Fix |
|---|---|---|---|
| 1 | "All recommendations prioritize **our** interests" — literal SEC fiduciary violation | Footer legal small print | Change "our" → **"your"** |
| 2 | "12% average annual returns" stat — specific return claim without disclaimers | Section 8 stats row, last block | Replaced with **"400+ / Families served"** |
| 3 | "Webflow Template" eyebrow placeholder | Hero eyebrow pill | Replaced with **"Wealth Advisory"** |
| 4 | "Get Template" CTA placeholder | Hero primary button | Replaced with **"Schedule call"** |
| 5 | Typo "yours capital" | Hero carousel card | Replaced with **"your capital"** |
| 6 | Section 8 eyebrow says "Services" | Section 8 header | Fixed to **"Testimonials"** |
| 7 | "Made by Webflow" credit | Footer right legal | Replaced with **"Made by 3mpq studio"** |

All 7 are already applied in the React build. Webflow rebuild must preserve them.

---

## 🟠 Copy requiring client input

| What | Where | Status |
|---|---|---|
| 6 of 7 FAQ answers | Section 10 | Placeholder — needs client to write real answers. Only "How are you compensated?" has a real answer. |
| 10 testimonial roles (all "Co-Founder @ Company") | Section 8 | Placeholder — needs real roles |
| Section 7 mid-page banner line | Section 7 | Placeholder "Clarity over complexity. Always." — needs client approval |
| Hero journey indicator labels ("Our Solution" / "Increase Royalty") | Hero bottom | Keep or re-label — client choice |
| Header "More" dropdown contents | Nav | Not specified — likely contains Style Guide + secondary pages |
| Contact form fields (name / email / phone / message) | Section 11 | Default set; client may want to add/remove |

---

## How to use the Inspector

1. Clone the project locally: `cd ~/Aisoldier/projects/template-design && npm install && npm run dev`
2. Open `localhost:3000`
3. **Cmd+click** any element to see its component name, source file, and tokens
4. A floating dark panel appears with: `data-component` / `data-source` / `data-tokens`
5. Click the source path to open the file in your editor (`cursor://` or `vscode://` protocol)

Every section is a discrete component. Every component has these attributes on its root.

---

## Design tokens — reproduce in Webflow

```
--color-bg:           #F8F7F1   (warm paper cream)
--color-surface:      #EFEDE7   (warm light)
--color-surface-2:    #E8E5DC   (deeper surface, derived)
--color-border:       #E0DCD0   (derived)
--color-text:         #212121
--color-text-muted:   #5A5A5A
--color-accent:       #FF512A   (warm orange-red)
--color-accent-hover: #E63D17
--color-accent-subtle: rgba(255, 81, 42, 0.08)
```

**Fonts:** IBM Plex Serif (500, 700) for headings + IBM Plex Sans (400, 500, 600) for everything else. Load from Google Fonts.

**Type scale:** see `DESIGN_SYSTEM.md`. All sizes are `clamp()`-based — use Webflow's fluid-typography presets that match the min/max pairs. Key values: H0 clamp(40, 8vw, 96) / H1 clamp(36, 5.5vw, 64) / H2 clamp(28, 4vw, 48) / H3 clamp(24, 3vw, 40) / body 16 fixed.

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for all motion. Nothing bounces. Nothing overshoots. In Webflow, save this as a Custom easing preset and reuse it.

**Radii:** `12px` (cards, modals, large surfaces) / `8px` (buttons, inputs) / `9999px` (pills, badges, avatars). Nothing else.

**Borders:** every card, input, window, menu, and badge has a 1px border in `var(--color-border)`. This is the primary visual separator.

---

## Section-by-section notes

Format per section: **What / Kit component / Animation / Webflow verdict**. Verdict values: `NATIVE IX2` (Webflow can do it natively), `CUSTOM EMBED` (needs a small JS snippet), `SIMPLIFY` (use a static fallback).

### 0. Nav / Header — ✅ BUILT (session 2)
- **What:** Sticky header with logo `Template ~ Design`, 5 nav items (About / Services / Case Studies / Contact / More), dark pill CTA "Schedule call" with chevron
- **Component:** `@kit/components/nav/NavSticky` — promoted to the kit this session. Project section wrapper at `src/components/sections/Nav.tsx` injects copy.
- **Animation:**
  - Scroll `y > 40px` → background `rgba(248,247,241,0.85)`, `backdrop-filter: blur(16px)`, `border-bottom: 1px solid #E0DCD0`, `box-shadow: 0 1px 24px rgba(33,33,33,0.04)`
  - Transition `200ms cubic-bezier(0.16, 1, 0.3, 1)` on all four properties
  - Logo and nav link colour: `150ms ease-out` on hover → `var(--color-accent)` (nav links only; logo uses `opacity 0.75`)
  - Mobile overlay: fade-in backdrop 200ms + staggered `y: 16 → 0` list items 40ms apart, same easing
- **Webflow verdict:**
  - Desktop scroll state: **NATIVE IX2** — 40px trigger, change 4 properties, done.
  - Wave-glyph logo: **CUSTOM EMBED** — 1 inline SVG, paste into a Webflow Embed element (see `embeds/` when created).
  - Mobile burger overlay: **NATIVE IX2** — standard Webflow interaction.
- **Mobile:** burger (<768) opens a full-screen overlay — serif menu items at 32px, staggered entry, bottom CTA. Body scroll locked while open. **Not in Figma** — project-added per doctrine.
- **Known trade-off:** nav uses backdrop-filter, which fails gracefully to plain `bg-transparent` when unsupported; Webflow's sticky nav supports it natively.

### 1. Hero — ✅ BUILT (session 3)
- **What:** 2-column hero — left text column (eyebrow `Wealth Advisory`, H0 `Strategic / management`, body, 2 CTAs, avatar stack, social proof), right hero photograph. Below: 2-marker journey indicator on a divider line. Below that: a single expertise card (arrow-link).
- **Component:** `src/components/sections/Hero.tsx` composing `@kit/EyebrowLabel` + `@kit/Button` (primary + secondary) + `@kit/AvatarStack` + `next/image` + a local `JourneyIndicator` + a local `CarouselCard`.
- **Geometry (desktop ≥1280):**
  - Container max-width 1440, padding 32 (`px-8`)
  - Left text column capped at 501px
  - Gutter 199-200px (the `501fr 200fr 676fr` grid handles it)
  - Right column aspect-ratio 676/460 (≈1.47), border + `--radius-window`
- **Typography:**
  - H0 renders as two stacked `<span>` children, guaranteed 2-line wrap: "Strategic" / "management"
  - `font-size: var(--text-h0)` + `line-height: var(--lh-h0)` + `letter-spacing: var(--ls-h0)` — all from the Figma Style-Guide variables
  - Body 18px `text-muted`
- **Animation:** none in this first pass. Scroll-pinned compression + word-by-word reveals are **reserved for a later motion pass** — the static layout is verified first. When motion lands: blur-reveal stagger on entry, journey indicator line draws in, carousel card fades from below.
- **Webflow verdict:**
  - Static layout: **NATIVE IX2**
  - Avatar z-order: **CUSTOM EMBED** — the `row-reverse` trick is a 2-line snippet to document
  - Scroll-pinned compression (when/if added): **CUSTOM EMBED** (Webflow pin+scroll works but is less precise than Framer Motion)
- **Gaps fixed in code:**
  - 🔴 #4 — avatar z-order forced via `row-reverse` inside `AvatarStack`
  - 🔴 #5 — 1-card carousel next-arrow **dropped**, single card kept
  - 🟠 #12 — hero eyebrow "Webflow Template" → "Wealth Advisory"
  - 🟠 #13 — hero primary CTA "Get Template" → "Schedule call"
  - 🟠 #14 — typo "yours capital" → "your capital"
  - 🟠 journey marker 2 label positioned via `right: 0` inside a positioned marker, not via the Figma's `translateX(-87px)` hack. Uppercase per screenshot.
  - 🟠 inconsistent gutter (199 vs 231 across sections) — Hero grid explicitly uses 200fr
- **Open (copy / assets):**
  - Hero photograph is an **Unsplash placeholder** (`photo-1521737604893-d14cc237f11d`, Christina @ wocintechchat) — client must replace with licensed brand photography. `next.config.ts` whitelists `images.unsplash.com`.
  - All 4 trust-bar avatars are also Unsplash placeholders (verified URLs in `content/copy.json hero.avatars`). Replace with real client photography.
  - Journey indicator labels "Our Solution" / "Increase Royalty" are from Figma and may be rewritten by client.
- **Mobile:** text column stacks full-width, image moves below at full-bleed aspect. Journey indicator hidden <1024 (it's a desktop-only editorial flourish). Carousel card full-width on mobile.

### 2. About / Hero 2 — ✅ BUILT (session 4)
- **What:** 2-column paragraph block. Left — `ABOUT US` eyebrow pill + 4-line body. Right — single long body paragraph. Both 16px, no H2/H3 (section is deliberately flat — the "quiet money" register lives in the typography-only composition).
- **Component:** `src/components/sections/About.tsx`. Only kit import is `@kit/EyebrowLabel`. Reuses the exact `501fr 200fr 676fr` grid from Hero so gutters line up across sections.
- **Geometry (desktop ≥1024):**
  - Section padding `py-20` (80 top / 80 bottom) — symmetric, matches Figma
  - Left column capped at 501px
  - Right column capped at 676px
  - 200px gutter enforced by the grid — this is the canonical project gutter (closes 🟠 inconsistent-gutter gap one more time)
- **Typography:**
  - Eyebrow: `EyebrowLabel` 12px uppercase pill
  - Left body: 16px, `--color-text` (full-weight body — this is the intro)
  - Right body: 16px, `--color-text-muted` (slightly softer because it's a long read)
- **Animation:** none in this pass. Both `<p>` elements carry `data-motion="split-text-reveal"` so the motion pass (see `DECISIONS.md` — "Motion pass consolidated after static build complete") can find and wire them via `rg "data-motion" src/`.
- **Webflow verdict:**
  - Static layout: **NATIVE IX2** — plain grid
  - Word-by-word reveal when added: **CUSTOM EMBED** (GSAP SplitText or similar)
  - **SIMPLIFY fallback** if custom embeds aren't available: plain fade+blur on the whole paragraph on scroll-enter
- **Gap fixed:**
  - 🟠 inconsistent gutter (231px vs 199px between sections) — About uses the same 200fr grid column as Hero
- **Open for client rewrite:**
  - Right-column paragraph is lifted verbatim from `forfuture.webflow.io` (reference landing the designer left on canvas). Client must replace with real firm copy.
  - Left-column intro is also placeholder — the designer wrote it, not the firm.

### 3. Our Approach — ✅ BUILT (session 5)
- **What:** Split header (eyebrow "OUR APPROACH" + H3 "Your wealth is only as secure as your strategy" on the left / body + "Get Started" CTA on the right) + full-width `SectionDivider` + 5-column value-pillar cards (Discipline / Transparency / Long horizon / Tax-efficient / Client-first).
- **Component:** `src/components/sections/Approach.tsx`. Kit imports: `SectionHeader` (split) + `SectionDivider`. Local sub-component: `ApproachCards` (5-pillar hairline grid).
- **Geometry (desktop ≥1280):**
  - `py-[120px]` symmetric vertical padding (matches Figma 120 top / 120 bottom)
  - Header is the kit `SectionHeader align="split"` — reuses the 501fr 200fr 676fr grid
  - 16-20 (lg) gap between header and divider, 16-20 (lg) gap between divider and cards
  - Card grid is 1×5 at lg, 3×2 at md, 2×3 at sm, 1×5 at xs — with hairline dividers (1px) between cells via `gap-px` on a `bg-border` wrapper
  - Each card min-height 220px, padding `p-5` (mobile) / `p-6` (md+), responsive title 22/24px serif medium
- **Typography:**
  - H3 from `SectionHeader`: Plex Serif 400 at `var(--text-h3)` / `var(--lh-h3)` / `var(--ls-h3)`
  - Card title: Plex Serif 500, 22px mobile → 24px desktop, `tracking-[-0.021em]`
  - Card eyebrow number: 12px uppercase sans with accent dot — same treatment as `EyebrowLabel` but inline
  - Card body: 14px sans muted
- **Content note (🟡 flagged):** the 5 pillars are **studio-authored placeholders** (safe, SEC-neutral). Marked as such in `DECISIONS.md` and `CHANGELOG.md`. Client must confirm or rewrite before publish.
- **Animation:** deferred. Eyebrow + headline + body inside `SectionHeader` already carry `data-motion="blur-reveal"`. Each card carries `data-motion="blur-reveal"` + `data-motion-index={i}` so the motion pass can compute a stagger offset without hardcoded delays.
- **Webflow verdict:**
  - Split header layout: **NATIVE IX2** — plain grid
  - Hairline card grid: **NATIVE IX2** — Webflow supports CSS grid with gap; use `1px gap` on a bg-border wrapper exactly like this implementation
  - Stagger entry animation when added: **NATIVE IX2** — Webflow IX2 supports "staggered children" natively
- **Gap fixed:**
  - 🟠 #8 fractional card widths (275.20001) — `grid-cols-5` handles the split

### 4. Services showcase — ✅ BUILT (session 6, 🟠 MEDIUM confidence)
- **What:** Split header (eyebrow `SERVICES` + H3 "Ways we help" / body + "Get Started" CTA) + 2×3 `ImageCardGrid` of 6 full-bleed photo cards with editorial gradient overlays.
- **Component:** `src/components/sections/Services.tsx`. Kit imports: `SectionHeader`, `ImageCardGrid`, `ImageCard` (the grid renders cards internally).
- **Geometry:** `py-[120px]` symmetric. Header uses the canonical split grid. Grid: 2-col desktop, 2-col at sm 640+, 1-col below 640. Card aspect-ratio 676/456, border + `--radius-window`, `gap: 24px`.
- **Content 🟡 placeholder — CLIENT MUST CONFIRM:**
  - All 6 services (`Wealth Planning`, `Investment Management`, `Tax Strategy`, `Estate Planning`, `Retirement Planning`, `Business Exit Planning`) are **studio-authored standard wealth-mgmt offerings**, not extracted from the Figma. The Figma symbol metadata never drilled into the real content (rate limit) and the designer's compressed screenshot only showed colourful card thumbnails. Client must review and rewrite before publish.
  - All 6 photos are **Unsplash placeholders** (`photo-145416…` / `…460925…` / `…554224…` / `…486406…` / `…517245…` / `…507679…`) — warm editorial / no stock handshakes. Client must replace with licensed brand photography.
- **Known conflict (🟠 duplicate eyebrow):** the Figma has `Services` as the eyebrow on BOTH Section 4 (this section) AND Section 5 (Services list). The designer reused the label. Implementation preserves Figma verbatim; the client should rename one of them — recommended rename: Section 4 → `Services` (this becomes the showcase), Section 5 → `What we do` or `Capabilities` (the detailed list).
- **Animation:** deferred. `SectionHeader` children already carry `data-motion="blur-reveal"`. `ImageCardGrid` stamps `data-motion="blur-reveal"` + `data-motion-index={i}` on every card for the motion pass to compute a stagger.
- **Hover (already implemented):** image `scale(1.03)` over 600ms + gradient overlay deepen 200ms, both with `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Webflow verdict:**
  - Card layout: **NATIVE IX2**
  - Hover image scale: **NATIVE IX2** (Webflow Hover trigger + Scale transform)
  - Gradient overlay: **NATIVE** (regular CSS linear-gradient on a div)
  - Stagger entry (motion pass): **NATIVE IX2** with "staggered children"

### 5. Services list — ✅ BUILT (session 7)
- **What:** Split `SectionHeader` (eyebrow `SERVICES` + H3 "Explore our service offerings" / body + "Start conversation" CTA) + 4 full-width rows representing **engagement types** (HOW we work with you), NOT the same content as §4.
- **Component:** `src/components/sections/ServicesList.tsx` with a **local** `ServiceListRow` sub-component. Kit imports: `SectionHeader`. `ServiceListRow` is intentionally NOT promoted — pattern is single-use and a kit version would be premature.
- **Row layout:**
  - 3-col grid `[auto_1fr_auto]` → `lg:[120px_1fr_auto]`
  - Left: big serif number `01` – `04` (Plex Serif Regular, clamp 32-48px, `-0.042em` tracking), muted on default, shifts to `--color-accent` on row hover
  - Middle: serif H5 title (clamp 22-28px) + 16px muted body description
  - Right: 44×44 ghost circle with chevron-right. Hover: circle fills with `--color-accent`, icon turns white, whole circle translates 4px right
  - Row hover background: `--color-surface`
  - `border-t` between rows + `border-b` on list wrapper for closure
  - `py-6 md:py-8 lg:py-10`
- **Content 🟡 placeholder — CLIENT MUST CONFIRM:** all 4 engagement types are studio-authored. The Figma symbol rows never exposed content via metadata (opaque symbol), and §4 already uses up the obvious "services / disciplines" content. Reframing §5 as engagement types keeps real content variety between the two sections — but the client must confirm the firm actually offers these four tiers and rewrite as needed.
- **Animation:** deferred. Each row carries `data-motion="blur-reveal"` on its `<li>` so the motion pass can stagger reveal.
- **Webflow verdict:**
  - Row layout: **NATIVE IX2** — CSS grid, border-top, hover bg change
  - Chevron circle shift: **NATIVE IX2** — Webflow Hover trigger with Move transform on the circle
- **Designer gap still flagged (🟠 #10):** eyebrow `Services` is duplicated on both §4 and §5 verbatim, preserved in code, decision for rename belongs to the client.

### 6. Case Studies — ✅ BUILT (session 8)
- **What:** Split `SectionHeader` (eyebrow `CASE STUDIES` + H3 "Proven outcomes" / body + "Get Started" CTA) + 2×3 `ImageCardGrid` of 6 anonymised case-study cards.
- **Component:** `src/components/sections/CaseStudies.tsx`. **Composed entirely from kit primitives — no bespoke sub-component.** `content/copy.json caseStudies.cards` is passed straight through to `ImageCardGrid` without a single `.map()` or field re-project. Two kit component calls total.
- **Content 🟡 placeholder — CLIENT MUST CONFIRM:** 6 anonymised SEC-compliant sketches (Post-liquidity event / Multi-generational / Professional practice / Institutional / Cross-border / Concentrated position). Each uses an eyebrow-style category label + a serif title + a one-line compliance-safe description (no return numbers, no client names, no real outcomes). Photography: 6 warm Unsplash placeholders — **all different subjects from §4** to avoid visual repetition (boardroom / coastal estate / medical / library / airplane window / abstract skyscraper).
- **Geometry:** `py-[120px]` symmetric. Split header. Grid `cols={2}` default → 1-col on narrow mobile. Card aspect-ratio 676/456 (kit default). `gap: 24px`.
- **Animation:** deferred. Inherited from `SectionHeader` and `ImageCardGrid` (`blur-reveal` + per-card stagger index).
- **Hover:** inherited from `ImageCard` — `scale(1.03)` 600ms + gradient deepen 200ms, doctrine easing.
- **Webflow verdict:**
  - Card layout + hover: **NATIVE IX2**
  - Each card `href` points to a `#case-studies-<id>` anchor — the Webflow dev should wire these to real case-study pages or collection items when the client provides long-form content.

### 7. Mid-page statement banner — ✅ BUILT (session 9)
- **What:** First visual break from the warm cream. Full-bleed section in `--color-accent` (#FF512A), centered H0 serif statement "Clarity over complexity. Always." in `--color-text` (#212121). No eyebrow, no subtitle, no CTA — a full stop, not a conversion point.
- **Component:** `src/components/sections/Banner.tsx` (local, single-use).
- **Geometry:**
  - `min-height: clamp(480px, 70vh, 720px)` — breathes at every viewport
  - Vertical padding `clamp(96px, 15vh, 180px)`
  - Inner container `max-w-[960px]` centered, horizontal `px-6 md:px-8 lg:px-12`
  - Headline uses `text-balance` so the natural serif wraps balance visually
- **Typography:**
  - Plex Serif Medium (500), `var(--text-h0)` / `var(--lh-h0)` / `var(--ls-h0)` — same treatment as Hero H0 so the visual weight stays consistent
  - Desktop renders on 2 lines; mobile 3 lines; tracking tight at −0.026em
- **Colour choice (flat over gradient):** flat saturated orange reads as an editorial statement; a gradient would read as decoration. Matches firm voice of "quiet confidence". **Contrast:** `#212121` on `#FF512A` ≈ **8:1 (AAA)** at any text size.
- **Animation:** deferred. Headline carries `data-motion="blur-reveal"`. The motion pass will add a simple fade+blur entry when the banner enters the viewport. No scroll-pin, no parallax — the section is too short for either to pay off.
- **Webflow verdict:**
  - Full-bleed layout: **NATIVE IX2** — just a full-width section with accent bg
  - Text balance: use Webflow's text-wrap settings or leave natural wrap
  - Motion: **NATIVE IX2** when added — a single fade-in
- **Open for client:** "Clarity over complexity. Always." is the firm's own positioning line from the footer tagline (re-used here). Confirmed on-brand but client may want a different sentence — swap via `content/copy.json midpageBanner.headline`.

### 8. Testimonials + Stats — ✅ BUILT (session 10, biggest gap haul)
- **What:** Split `SectionHeader` (eyebrow `TESTIMONIALS` + H3 "Real results, real feedback" / sidebar body + custom `Button` "Leave a review" passed as ReactNode) → `SectionDivider` → 3-col `TestimonialGrid` with 10 cards → `SectionDivider` → 4-col `StatsRow`.
- **Component:** `src/components/sections/Testimonials.tsx`. Local sub-components: `TestimonialGrid`, `TestimonialCard`, `StatsRow`, `StarIcon`. Kit imports: `SectionHeader`, `SectionDivider`, `Button`. Inline SVG star icons — no icon library.
- **Gaps fixed (5 in this section alone, now 13/17 total):**
  - 🔴 **#2 eyebrow** — `Testimonials` sourced from `copy.json testimonials.eyebrow`, fixed back in session 1. No hardcode anywhere in `Testimonials.tsx`.
  - 🔴 **#3 fixed 400px heights** — grid uses `[grid-auto-rows:minmax(400px,auto)]` + author block has `mt-auto` so short quotes anchor the author to the bottom and long quotes can grow the row. **Verified via CDP assertion**: Diana Xavier / Wendy Kemp / Holly Woods (row 2) all report identical `400px` computed row heights — rows equalized, no content clipping, no awkward gaps.
  - 🔴 **row 4 orphan** — cards are `.slice(0, 10)` passed straight to a 3-col grid. CSS grid naturally places card 10 (Zara Payne) in row 4 col 1 with cols 2 and 3 simply not rendered. **No empty `<div>` placeholders.**
  - 🟠 **#8 fractional 442.67 widths** — `grid grid-cols-3 gap-6`, no pixel math.
  - 🟡 **#18 "12% annual returns" stat** — already replaced with `400+ Families served` in `content/stats.json` (session 1). Section consumes the JSON, no hardcode.
- **TestimonialCard structure:**
  - `border --color-border`, `--radius-window`, `bg-white` (pure white stands out on the warm cream `--color-bg`)
  - `p-7 md:p-10` (28 mobile / 40 desktop matches Figma 40 spec)
  - Top: 5 × 12px star SVG row, gap 4, `--color-accent` fill
  - Middle: 16px quote in `--color-text`
  - Bottom (`mt-auto`): 48×48 avatar (next/image) + name (16 semibold) + role (14 muted)
- **StatsRow structure:**
  - `grid-cols-2 md:grid-cols-4`, gap-x 6/12 + gap-y 12, no borders, no cell padding
  - Number: Plex Serif Regular, `clamp(32px, 4vw, 44px)`, tracking `-0.025em`
  - Caption: 14px `--color-text-muted`
- **Animation:** deferred. Each `TestimonialCard` has `data-motion="blur-reveal" data-motion-index={i}`. Each stats cell has `data-motion="count-up" data-motion-index={i}`. Motion pass will stagger card reveal and run a JS counter on stats.
- **Webflow verdict:**
  - Testimonial grid: **NATIVE IX2** with `grid-auto-rows: minmax(400px, auto)` — Webflow supports this via custom CSS
  - Star SVG: inline copy-paste snippet (4 lines)
  - Stats: **NATIVE IX2** for layout
  - Count-up: **CUSTOM EMBED** — ~15 lines JS with `IntersectionObserver` + `requestAnimationFrame`, documented later in `embeds/`
- **Open for client:** all 10 testimonial roles still read "Co-Founder @ Company" — flagged in the main placeholder table above. Replace with real roles before publish.

### 9. Our Process — ✅ BUILT (session 11)
- **What:** Split `SectionHeader` (eyebrow `HOW WE WORK` + H3 "Our Process" / body + "Get Started" CTA) + 4-step horizontal row. Each step: pill label at top / circle-on-line in the middle / description below.
- **Component:** `src/components/sections/Process.tsx`. Local sub-components `ProcessSteps`, `ProcessStep`. Kit imports: `SectionHeader`, `EyebrowLabel`.
- **Step structure:**
  - **Pill label** — `EyebrowLabel` reused (one of its intended second-uses, validates the primitive). Centered via `items-center` on the flex column — ZERO hardcoded x offsets (🟠 gap #9 closed).
  - **Connector row** — `h-9 w-full relative overflow-visible`. This is the critical piece for gap #6.
  - **Horizontal line segment** — `absolute top-1/2 h-px -translate-y-1/2 bg-border-strong`, hidden below `lg`. Per-step segments with `first:left-1/2` and `last:right-1/2` to trim the line at the first and last circle centers. The 3 middle segments span the full column. Steps touch at column boundaries (gap is the grid gap, which on `lg` is `gap-x-6`).
  - **Circle stack** — `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` with a 68×68 outer halo (accent/25 border) wrapping a 56×56 inner circle (accent solid border, bg cream, 24px serif number). `z-10` so it paints above the line. Because the outer halo is 68px but the connector row is 36px, the halo EXTENDS 16px above and below its own row — exactly matching the Figma `Frame 530 at (-16, -16, 68×68)`. Closed via `overflow-visible` + absolute translate, **not** via negative margin (negatives fight Framer Motion transforms).
  - **Description** — 14px muted, centered, `max-w-[280px]`.
- **Gaps fixed (last of the engineering-closable gaps):**
  - 🔴 **#6 circle overflow** — CDP-verified `{rowHeight: 36, haloHeight: 68, innerCircle: 56, overflowEachSide: 16, rowOverflowStyle: "visible"}`. Numerical match to Figma intent.
  - 🟠 **#9 fractional x positions for pill labels** — CDP-verified `pill center − step center = [0, 0, 0, 0]` across all four steps. Zero drift. No `123.5` / `127` / `114` anywhere in the code.
- **Responsive:**
  - `≥1024` (lg): 4-col row with visible connector line
  - `640-1023` (sm-md): 2×2 grid, lines hidden (hack-free — horizontal connector cannot meaningfully carry through a wrap)
  - `<640`: 1-col vertical stack, lines hidden
- **Animation:** deferred. `ProcessSteps` has `data-motion="line-draw"` for the eventual SVG stroke-dashoffset animation. Each `ProcessStep` has `data-motion="blur-reveal" data-motion-index={i}` for stagger reveal.
- **Webflow verdict:**
  - Layout: **NATIVE IX2** — grid + absolute + overflow-visible are all native Webflow properties
  - Circle halo hierarchy: **NATIVE** — two nested divs with border styles
  - Line draw animation: **CUSTOM EMBED** — small SVG with `strokeDasharray` / `strokeDashoffset` animated on scroll, ~20 lines of JS, documented in `embeds/` later

### 10. FAQ — ✅ BUILT (session 12)
- **What:** Stacked `SectionHeader` (eyebrow `FAQ` + H3 "Answers to the questions we get", no body, no CTA) + 7-item accordion with single-open state and animated expand/collapse.
- **Component:** `src/components/sections/FAQ.tsx` with local `FAQAccordion` / `FAQItem` / `ChevronToggle`. Kit imports: `SectionHeader`, `EASE_OUT`. Client component (`"use client"`) — it owns state.
- **Accordion behaviour:**
  - `useState<number | null>(null)` tracks the currently open item id
  - Clicking an open item closes it; clicking a closed item opens it AND auto-closes whatever else was open (single-open semantics)
  - Framer Motion `AnimatePresence` mounts/unmounts the answer panel with `height: 0 ⇄ auto`, `opacity: 0 ⇄ 1`, `duration: 0.35`, `ease: [0.16, 1, 0.3, 1]` (doctrine easing)
  - `overflow-hidden` on the animating wrapper — essential or Framer Motion height interpolation clips weirdly
  - Chevron ghost circle (44×44) rotates `180°` on open, border transitions to `--color-accent`
  - `aria-expanded` + `aria-controls` on each button, `id` on each panel
  - Keyboard native: `Enter` / `Space` toggle via the `<button>` element
- **Narrow editorial answer column:** `max-w-none` on mobile, `max-w-[560px]` on `lg`. Question row stays full-container-width for the click target; answer column narrows for editorial pacing. This is deliberate — **do not "improve" it by making the answer full-width on desktop.**
- **Slight widening from Figma:** Figma spec had the answer column at exactly `501px`; implementation uses `560px` for a touch more line length on ≥1280 viewports without losing the editorial feel. Revert to `max-w-[501px]` in `FAQItem` if exact Figma match is required.
- **Content 🟡 gap #16 — 6 of 7 answers placeholder:** only item 2 "How are you compensated?" has a real answer (AUM-based fee-only breakdown). Items 1, 3–7 render the Figma placeholder text plus a small "Placeholder answer — client to confirm" tag under the paragraph so the handoff is visually obvious.
- **Motion discipline:** interaction (open/close) ships live, NOT deferred. The ADR defers only scroll-linked and reveal animations. Scroll-reveal stagger for the FAQ section as a whole will land in the motion pass via `data-motion="blur-reveal"` on the `FAQAccordion` root.
- **CDP verification** (shoot script `Runtime.evaluate`):
  - `{existsBefore: false}` — answer panel is unmounted when closed (`AnimatePresence` working)
  - `{heightAfterOpen: 117}` — panel animates to 117px height when item 2 opens
  - `{singleOpen_item2AfterOpeningItem5: "false"}` — opening item 5 auto-closed item 2 (single-open confirmed)
  - `{singleOpen_item5Open: "true"}` — item 5 opened correctly
- **Webflow verdict:**
  - Accordion layout: **NATIVE IX2** — Webflow has a built-in accordion element
  - Height animation: **NATIVE IX2**
  - Chevron rotate: **NATIVE IX2** — Hover/Click trigger with Transform rotate

### 11. Contact form — ✅ BUILT (session 13, first dark section)
- **What:** Full-bleed dark section with 2-col layout — left: `CONTACT` eyebrow + H2 "Send us a message" + body + secondary info (email + schedule-direct links) / right: form card with name, email, phone (optional), message, consent checkbox, orange-accent "Send message" submit. Thank-you card swap on success.
- **Component:** `src/components/sections/Contact.tsx` (`"use client"`) with local `ContactLead` / `ContactForm` / `SecondaryRow` / `FieldText` / `FieldTextarea`. Kit imports: `Button` (accent variant), `EyebrowLabel`, `cn`, `EASE_OUT`.
- **🎯 Dark-theme architecture test — PASSED:** section wraps content in an inline `style={DARK_SCOPE}` that overrides `--color-bg`, `--color-text`, `--color-border`, etc. Kit components render purely from `var(--color-*)` and inherit the inverted palette automatically via CSS cascade. **No prop drilling, no `dark:` variant, no kit API changes.** CDP-verified at render time:
  - `sectionBg: "rgb(30, 30, 30)"` (matches the override)
  - `eyebrowColor: "rgb(244, 244, 244)"` (inverted — was #212121 before the scope override)
  - `eyebrowBorderColor: "rgba(255, 255, 255, 0.14)"` (inverted border)
  - `submitBg: "rgb(255, 81, 42)"` (accent variant stays constant across themes)
  - `inputBorderColor: "rgba(255, 255, 255, 0.14)"`, `inputBg: "rgb(30, 30, 30)"`, `inputColor: "rgb(244, 244, 244)"`
- **Tech debt surfaced and fixed:** the kit `Button` primary variant was hardcoded to `bg-[#212121] text-white hover:bg-[#0f0f0f]`. On a dark bg, that would have rendered a near-invisible dark pill. Rewritten to `bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90`. Hero and all SectionHeader CTAs across §3-9 visually unchanged (the cream → cream-tint text delta is within 5%). A new `variant="accent"` was added for CTAs that should always be the project accent regardless of theme scope; the Contact submit uses it. Full rationale in `DECISIONS.md`.
- **Form stack:**
  - `react-hook-form` for state and submission
  - `zod` schema in `src/lib/contactSchema.ts` — the schema lives outside the server-action file because Next.js 15 requires every export from a `"use server"` module to be an async function
  - `src/app/actions/submitContact.ts` — server action, Zod-validated, logs to server console with a 450ms simulated delay, returns `{ ok: true, message }` or `{ ok: false, message }`. 🟡 **Placeholder** — wire to a real email / CRM backend before publish.
  - `AnimatePresence` with `mode="wait"` swaps form → thank-you card on success, reversed via "Send another message" link
  - Inline error display (red `#f87171`) below each invalid field
  - Disabled submit + `Sending…` label during network call
- **Input styling:** inputs use `bg-[var(--color-bg)]` + `border-[var(--color-border)]` + `text-[var(--color-text)]` + `placeholder:text-[var(--color-text-subtle)]` — all tokens, all theme-scope friendly. Focus state flips border + ring to `--color-accent`. Doctrine easing on the transition.
- **Animation note:** interaction motion ships live (AnimatePresence, focus transitions). Scroll-reveal of the section is deferred to the motion pass — the section root has no `data-motion` yet; the motion pass can add one when it arrives.
- **Webflow verdict:**
  - Layout + dark bg: **NATIVE** — a single Webflow section with a custom background color
  - Form: Webflow's native form element + "Form Success" / "Form Error" state divs — the Webflow dev won't reuse our server action, so this entire block gets rewritten in Webflow's form system
  - Token theme scope: **CUSTOM EMBED** — one `<style>` snippet with the CSS variable override, scoped via a section ID
- **Open for client:**
  - Form submission is a placeholder — no real backend. Wire before publish.
  - Secondary links `hello@template-design.example` and `#schedule` are obvious placeholders.
  - Consent copy is legal-safe but generic — client legal should review.

### 12. Footer — ✅ BUILT (session 14, final structural section)
- **What:** Dark `DARK_SCOPE` block with three rows — logo+tagline/sitemap; decorative 8-dot row (one accent dot) + hairline divider; socials left + legal + copyright right.
- **Component:** `src/components/sections/FooterEditorial.tsx`. Kit imports: `LogoWave` (freshly promoted this session — reused in Nav and Footer, ≥2 uses justified). All content from `copy.json footer`.
- **Reused scope:** `DARK_SCOPE` extracted to `src/lib/darkScope.ts` so Contact (§11) and Footer (§12) share the same 9-token override. Any future dark section imports the same constant — DRY.
- **Dot row:** 8 × 10px circles, index 2 painted in `--color-accent`, the rest in `rgba(244,244,244,0.22)`. Motion pass can add a scroll-triggered accent shift later; static for now.
- **Social icons:** 4 inline SVGs (LinkedIn / WhatsApp / Instagram / Facebook), 40×40 ghost circles with hover border+bg shift to accent. `href="#"` placeholders — 🟡 flagged in HANDOFF as client-provided URLs required.
- **🎯 Runtime compliance assertion — PASSED:**
```json
{
  "legal_has_your":        true,
  "legal_no_prioritize_our": true,
  "copyright_has_studio":  true,
  "copyright_no_webflow":  true,
  "dark_color_text":       "#f4f4f4",
  "dark_color_bg":         "#1e1e1e",
  "section_bg":            "rgb(30, 30, 30)"
}
```
  - `legal_has_your: true` / `legal_no_prioritize_our: true` → **🔴 SEC compliance critical fix VERIFIED**: the footer text at runtime reads "All recommendations prioritize your interests", NOT "our interests". Consumed from `copy.json footer.legal` — no hardcode.
  - `copyright_has_studio: true` / `copyright_no_webflow: true` → **🟠 brand fix VERIFIED**: the footer reads "© 2026. Made by 3mpq studio.", NOT "Made by Webflow".
  - Dark scope tokens resolve correctly (#f4f4f4 text over #1e1e1e bg).
- **Webflow verdict:**
  - Layout + dark bg: **NATIVE** — standard Webflow section
  - Dot row: **NATIVE** — 8 divs with bg color, index 2 in the accent variable
  - Social icons: **CUSTOM EMBED** — paste the 4 inline SVG snippets into Webflow Embed elements (or use Webflow's native social icon component if the project has one installed)
  - **CRITICAL handoff note:** the "your interests" / "3mpq studio" text MUST be preserved in the Webflow rebuild. Do NOT revert to the original Figma copy. This section documents those fixes and the Webflow dev is responsible for carrying them through.

---

## Multi-page routes (added 2026-04-12)

Four new routes were added. All use the same kit components, tokens, and warm cream palette as the home page.

### /case-studies — Index page
- **What:** Stacked `SectionHeader` (eyebrow `CASE STUDIES` + H3 "Proven outcomes") + 2-col `ImageCardGrid`. Each card links to `/case-studies/[slug]`.
- **Component:** `src/app/case-studies/page.tsx`. Kit: `SectionHeader` (stacked), `ImageCardGrid`. Nav + FooterEditorial imported directly.
- **Webflow verdict:** **NATIVE** CMS collection list. Create a "Case Studies" collection, bind cards to collection items.

### /case-studies/[slug] — Case study detail
- **What:** Full-bleed hero image with gradient overlay + eyebrow + H1 title. Three content sections (situation / approach / outcome) at max-w-720. Dual CTA at bottom.
- **Component:** `src/app/case-studies/[slug]/page.tsx`. Kit: `Button`, `EyebrowLabel`. Static params from 6 JSON files in `content/case-studies/`.
- **Content:** ~250 words per case study, SEC-safe, no return numbers, no client names. All content in individual JSON files.
- **Webflow verdict:** **NATIVE** CMS template page. Hero image, rich text fields for each section, CTA buttons.

### /services — Services detail page
- **What:** Stacked `SectionHeader` + 6 service blocks in the canonical 501fr/200fr/676fr split grid. Each service has body paragraphs, "Who it is for", "How we work", and a per-service CTA. Centered bottom CTA.
- **Component:** `src/app/services/page.tsx`. Kit: `SectionHeader` (stacked), `Button`, `EyebrowLabel`. Content from `content/services-detail.json`.
- **Webflow verdict:** **NATIVE** static page or CMS collection. The split grid matches the home page layout.

### /blog — Blog index page
- **What:** Stacked `SectionHeader` (eyebrow `BLOG` + H3 "Thinking in public" + body) + 2-col `ImageCardGrid`. Each card links to `/blog/[slug]`.
- **Component:** `src/app/blog/page.tsx`. Kit: `SectionHeader` (stacked), `ImageCardGrid`. Three articles.
- **Webflow verdict:** **NATIVE** CMS collection list.

### /blog/[slug] — Blog article page
- **What:** Centered 720px article layout. Plex Serif H1, eyebrow pill (date + read time), body paragraphs at 16px Plex Sans, author block with border separator, dual CTA.
- **Component:** `src/app/blog/[slug]/page.tsx`. Kit: `Button`, `EyebrowLabel`. Static params from 3 JSON files in `content/blog/`.
- **Content:** ~400 words per article, covering fiduciary duty, tax-loss harvesting, and post-2022 risk management. All follow copywriter rules.
- **Webflow verdict:** **NATIVE** CMS template page. Rich text body, author reference field, CTA section.

### Navigation updates
- Nav: "More" replaced with "Blog" linking to `/blog`
- Footer sitemap: "Blog" added before "Style Guide"
- Home page case study cards: hrefs updated from `#case-studies-*` anchors to `/case-studies/[slug]` routes

---

## Known "custom embed" items

1. **Hero avatar z-stack ordering** — ~5 lines of CSS or a small React trick
2. **Split-text word reveal (Section 2)** — Webflow native text split OR custom JS
3. **Stats number count-up (Section 8)** — `embeds/count-up-stats.js` ✅ delivered
4. **Process connector line draw-on-scroll (Section 9)** — `embeds/blur-reveal.js` handles the `data-motion="line-draw"` case ✅ delivered
5. **Magnetic button hover (Section 11 submit + Hero CTA)** — `embeds/magnetic-button.js` ✅ delivered
6. **Global blur-reveal driver** — `embeds/blur-reveal.js` ✅ delivered — one snippet covers every `data-motion="blur-reveal"` target on the page

All snippets live in `projects/template-design/embeds/` with a `README.md` documenting paste order and contract-test instructions. Each is vanilla JS + inline CSS, self-contained, respects `prefers-reduced-motion`, and matches the React reference build's behaviour verbatim.

---

## Known "simplify on Webflow" items

If any of the custom embeds are too costly for Webflow, these are the fallbacks:

- **Hero scroll-pinned compression** → static hero without pin (still visually strong)
- **Split-text** → fade whole paragraph
- **Count-up stats** → static numbers
- **Draw-on-scroll connector** → static line
- **Magnetic button** → plain hover darken

---

## Assets

All images, videos, SVGs will be referenced from `public/` during the build phase. A final list with dimensions and file sizes will land here when sections are complete.

Known sources from the Figma:
- Hero image: two professionals walking in a modern office, warm natural light (Group - 2 of 3, 676×460)
- Section 4: 6 image cards (TBD subjects)
- Section 6: 6 case study cards (TBD subjects)
- 10 testimonial avatars (48×48 each)
- 4 trust-bar avatars in hero (48×48 each, overlapping 16px)
- Social icons (4): LinkedIn, WhatsApp, Instagram, Facebook

All photography licensing is the client's responsibility — flag for approval.
