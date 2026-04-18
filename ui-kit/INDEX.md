# UI Kit — Component Registry

**This is the single source of truth for components.** Every component used in any project must be listed here. Agent reads this file before any component work.

## How to use this file

- If the component you need is listed → use it from `ui-kit/components/<Name>.tsx`.
- If close but not quite → propose adding a variant, then use it.
- If nothing fits → STOP. Propose a new component to add to the kit. Do not inline components in a project.

Every row answers: **what it is**, **when to use**, **when NOT to use**.

---

## Primitives

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `EyebrowLabel` | `ui-kit/components/section/EyebrowLabel.tsx` | 12px small-caps pill that sits above every headline. Only sanctioned 12px usage in the kit. Variants: `pill` (default, bordered) / non-pill (flat). `accent` flag tints it with `var(--color-accent)` for dark CTA banners. | Any label that should be larger than 12px — use plain text with a `body-sm` class instead. |
| `Button` | `ui-kit/components/ui/Button.tsx` | Shared CTA primitive. Variants: `primary` (dark pill with trailing accent dot, the Figma default), `secondary` (outline ghost), `ghost` (flat). Sizes `md` (44px Figma height) and `lg` (48px). Renders as `<a>` when `href` is passed, otherwise `<button>`. | Nav-bar pill CTAs — `NavSticky` has a bespoke pill with chevron, don't swap it. |
| `AvatarStack` | `ui-kit/components/section/AvatarStack.tsx` | Overlapping circular avatars (trust-bar pattern). Defaults to 48px avatars with 16px overlap like the Figma hero. Z-order is handled correctly: leftmost paints on top via `row-reverse`. Accepts any image URL (next/image under the hood). | A flat avatar row with no overlap — use a plain `<ul>` with `gap-2`. |

## Layout

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `SectionHeader` | `ui-kit/components/section/SectionHeader.tsx` | Standard section header: eyebrow + H3 [+ right-side body + right-side CTA]. `align="split"` (default) reuses the project canonical `501fr 200fr 676fr` grid so gutters line up across every 2-column section. `align="stacked"` when there's no right column (e.g. FAQ). `headline` accepts `string` or `ReactNode` (multi-line). `cta` accepts `{label,href}` for default primary Button or a full ReactNode for a custom CTA. | Hero H0 blocks — Hero has a bespoke composition because of the split-line headline + avatar stack + journey indicator. |
| `SectionDivider` | `ui-kit/components/section/SectionDivider.tsx` | 1px hairline divider between section header and content. Named primitive so Inspector picks it up. Variants: `tone="default"` (border) / `tone="strong"` (border-strong). | A visual divider that actually separates two sections in `page.tsx` composition — that's the job of section padding, not a component. |

## Hero variants

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| _empty_ | — | — | — |

## Feature sections

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `ImageCard` | `ui-kit/components/section/ImageCard.tsx` | Editorial full-bleed photo card with bottom gradient + eyebrow + serif H5 + optional description. Optional `href` turns it into a focusable link. Hover: image `scale(1.03)` over 600ms + overlay deepen 200ms, both using the doctrine easing. `aspectRatio` defaults to the Figma 676/456. | Static screenshots (no photograph) — use a plain `Card` / `BentoCell` instead. Interactive card with a form — this is display-only. |
| `ImageCardGrid` | `ui-kit/components/section/ImageCardGrid.tsx` | Responsive grid of `ImageCard`s. `cols: 2 \| 3` at `lg`, auto-collapses to 2-col at `sm` and 1-col on narrow mobile. Default `gap: 24`. Each card gets `data-motion="blur-reveal"` + `data-motion-index`. Used by Sections 4 (services showcase) and 6 (case studies). | 5-col value-pillar grids without photos — those use a bespoke hairline grid (see Section 3 `ApproachCards`). |
| `BrowserFrame` | `ui-kit/components/section/BrowserFrame.tsx` | Generic browser-chrome wrapper with 36px title bar, three border-only dots (no emoji), 1px border, 12px radius, secondary surface fill. Children are any product mock — iframe live demos, dashboard screenshots, animated mockups. Default content aspect 16/10; override via `aspect` prop. Promoted in vendo-ai session 1 (2026-04-13). | Photographic editorial cards — use `ImageCard`. Cards that must NOT read as a "browser window" (testimonial blocks, bento cells). |
| `StickyFeatureList` | `ui-kit/components/section/StickyFeatureList.tsx` | Pinned-left-visual + scrolling-right-list pattern (Apple product pages, Linear Method, Stripe). `items: {number,title,body,visual?}[]`. Tracks the most-visible list item via IntersectionObserver and cross-fades the sticky visual via `<AnimatePresence mode="wait">`. Optional per-item `visual` override; default is a minimal chapter-card illustration. Promoted from booquarium session 1 (2026-04-17). | Short feature lists (≤2 items) — overkill; use a plain 2-col layout. Parallel features where user's eye should compare side by side — use a bento. |
| `BlurbWall` / `BlurbCard` | `ui-kit/components/section/BlurbWall.tsx` | Dense editorial blurb grid (back-of-paperback aesthetic). `blurbs: {quote,source,stars?}[]`. 3-col at `lg`, 2-col at `sm`, 1-col on narrow mobile. Each card: border + radius-window, italic serif quote, dot-stars in accent, source in small-caps eyebrow. Hover: border-strong + subtle shadow + 2px translate. Each card gets `data-motion="blur-reveal"` + `data-motion-index` for staggered entry. Promoted from booquarium session 1 (2026-04-17). | Singular/testimonial quotes (one-at-a-time emphasis) — use `EditorialQuote` instead. Long-form case studies — use `ImageCard`. |

## Navigation

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `NavSticky` | `ui-kit/components/nav/NavSticky.tsx` | Any landing that needs a sticky header with transparent → backdrop-blur scroll state, horizontal nav, pill CTA, and a mobile burger overlay. Props `{ logo, links, cta, dataSource? }`. Split a logo with a `~` to get an accent wave glyph between the two halves (delegates to `LogoWave`). | Full-width mega-menu navigation with multi-column dropdowns — this component only supports flat link arrays. Build a `NavMegaMenu` variant instead. |
| `LogoWave` | `ui-kit/components/brand/LogoWave.tsx` | `Template ~ Design` wordmark with an accent wave glyph painted between the two halves. Props `{ logo, size?, href?, tone?, dataSource? }`. Split on the first `~`. Promoted in session 14 after hitting 2 uses (Nav + Footer). | Any wordmark that doesn't use the `~` split pattern — render plain text instead. |
| `FooterEditorial` | `ui-kit/components/section/FooterEditorial.tsx` | Default closing pattern for every landing. Oversized typographic wordmark + sitemap nav (small-caps) + tagline + legal/built-with row with "Back to top" link. Light-theme by default; inherits `--color-text` so will invert under a dark scope. Props `{ wordmark, tagline?, links?, legal?, builtWith?, topHref? }`. Promoted from booquarium session 1 (2026-04-17). | Dark-scoped footer with decorative dot-row + socials (template-design has a project-local `FooterEditorial` with more surface area — leave that one at the project level). |

## Motion primitives

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `BlurReveal` | `ui-kit/components/motion/BlurReveal.tsx` | Section-enter reveal. Wraps children, transitions from `{opacity 0, y 24, blur 8}` → resting state when in view. Props: `delay / duration / margin / once / className / dataSource`. Respects `prefers-reduced-motion` (renders children instantly). | Long running text you want to reveal word-by-word — use `SplitText` instead. |
| `SplitText` | `ui-kit/components/motion/SplitText.tsx` | Narrative paragraphs that should reveal word-by-word (editorial split-text pattern). Each word gets its own `motion.span` with staggered opacity/y/blur. Plain text input (`text: string`) so copy-paste selection still works. Respects `prefers-reduced-motion`. | Dense UI labels or very short headings — too much per-word machinery for ≤3 words. |

## Devtools

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| Inspector (spec only) | `ui-kit/components/devtools/Inspector.tsx` | Dev-mode overlay for Cmd+click inspection of any element. Read `data-component` / `data-source` / `data-tokens`. | Production builds. |

---

## Must-have v1 (from research, to be built on demand)

These are the components the Awwwards 2024-2026 research flagged as high-frequency. Build them when a project first needs them, then list them above.

1. **HeroPinned** — scroll-pinned hero with size compression. 200vh parent + sticky child + `useScroll`/`useTransform`. The single most copied pattern of 2024-2026.
2. **SplitTextReveal** — word-by-word or character-by-character scroll reveal.
3. **BlurReveal** — IntersectionObserver + blur-in entry.
4. **BentoGrid** — default layout for feature sections (2024-2026 SaaS standard — 67% of top landings).
5. **MarqueeInfinite** — speed-linked-to-scroll and constant-speed variants.
6. **MagneticButton** — magnetic hover attraction for CTAs.
7. **CursorFollow** — custom cursor with mix-blend-mode variants.
8. **StickyFeatureList** — pinned sticky list where right-side visual changes with scroll.
9. **DotGridSurface** — 24×24 radial-gradient background, light + dark variants.
10. **EyebrowLabel** — small-caps label, 12px, letter-spacing 0.04em, font-weight 600.
11. **SectionHeader** — IBM Plex Serif H2 + optional eyebrow + optional description.
12. **Logo marquee** — infinite logo strip for trust bar.
13. **TestimonialBlock** — editorial quote variant.
14. **FAQAccordion** — single-open, framer-motion layout transitions.
15. **FooterEditorial** — large typography footer with sitemap grid.
16. **NavSticky** — transparent → solid-on-scroll nav with morphing behavior.

---

## Promotion rules

When you build something reusable in a project:
1. Move the file from `projects/<name>/src/components/` to `ui-kit/components/`.
2. Re-import from the kit in the project.
3. Add a row to the appropriate table above.
4. Add/update the token list in `TOKENS.md` if new tokens were needed.
5. Note the promotion in the project's `DECISIONS.md` and `CHANGELOG.md`.
