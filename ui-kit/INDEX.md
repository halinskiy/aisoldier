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
| `Badge` | `ui-kit/components/ui/Badge.tsx` | Small bordered pill for meta labels, counts, status. Uppercase letter-spaced text at 10px (sm) / 12px (md). Tones: `default` (surface), `accent` (accent fill, near-black text for AAA), `muted` (surface-2), `outline` (transparent, strong border). | Running body copy or anything longer than a few words — badges are for single-word meta chips. Prose inline highlight — use `TextLink` tone="accent". |
| `TextLink` | `ui-kit/components/ui/TextLink.tsx` | Inline link primitive. Not a button. Tones: `default` (inherits text color, underline on hover), `subtle` (muted until hover), `accent` (always accent, underline on hover). External links auto-apply target+rel and an 8×8 trailing arrow. Supports `as="span"` for wrapping router Links. | Any CTA — use `Button`. |

## Layout

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `SectionHeader` | `ui-kit/components/section/SectionHeader.tsx` | Standard section header: eyebrow + H3 [+ right-side body + right-side CTA]. `align="split"` (default) reuses the project canonical `501fr 200fr 676fr` grid so gutters line up across every 2-column section. `align="stacked"` when there's no right column (e.g. FAQ). `headline` accepts `string` or `ReactNode` (multi-line). `cta` accepts `{label,href}` for default primary Button or a full ReactNode for a custom CTA. | Hero H0 blocks — Hero has a bespoke composition because of the split-line headline + avatar stack + journey indicator. |
| `SectionDivider` | `ui-kit/components/section/SectionDivider.tsx` | 1px hairline divider between section header and content. Named primitive so Inspector picks it up. Variants: `tone="default"` (border) / `tone="strong"` (border-strong). | A visual divider that actually separates two sections in `page.tsx` composition — that's the job of section padding, not a component. |
| `BentoGrid` / `BentoCell` | `ui-kit/components/section/BentoGrid.tsx` | 12-column CSS-grid container (`BentoGrid`) + cells (`BentoCell`) with responsive column spans (`{base,md,lg}`), row spans, tones (`default`/`surface`/`accent`), and doctrine radius + border + hover-border-strong transition. The default layout for feature sections in 2024-2026 SaaS. | A standard 2-3 col photo grid — use `ImageCardGrid`. A sticky-visual list — use `StickyFeatureList`. |

## Hero variants

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `HeroPinned` | `ui-kit/components/section/HeroPinned.tsx` | Scroll-pinned hero (200vh outer, `sticky` inner) with framer-motion `useScroll`/`useTransform` compressing the title font-size and fading in the lede around 30% progress. Props: `title`, `lede`, `eyebrow`, `children` (optional media below), `heightVh`, `titleSizeStart`/`End`. Respects `prefers-reduced-motion`. | Short landings with no scroll runway — use a static hero composition. Hero with a video or interactive 3D canvas — build bespoke; the pinned pattern is text-first. |

## Feature sections

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `ImageCard` | `ui-kit/components/section/ImageCard.tsx` | Editorial full-bleed photo card with bottom gradient + eyebrow + serif H5 + optional description. Optional `href` turns it into a focusable link. Hover: image `scale(1.03)` over 600ms + overlay deepen 200ms, both using the doctrine easing. `aspectRatio` defaults to the Figma 676/456. | Static screenshots (no photograph) — use a plain `Card` / `BentoCell` instead. Interactive card with a form — this is display-only. |
| `ImageCardGrid` | `ui-kit/components/section/ImageCardGrid.tsx` | Responsive grid of `ImageCard`s. `cols: 2 \| 3` at `lg`, auto-collapses to 2-col at `sm` and 1-col on narrow mobile. Default `gap: 24`. Each card gets `data-motion="blur-reveal"` + `data-motion-index`. Used by Sections 4 (services showcase) and 6 (case studies). | 5-col value-pillar grids without photos — those use a bespoke hairline grid (see Section 3 `ApproachCards`). |
| `BrowserFrame` | `ui-kit/components/section/BrowserFrame.tsx` | Generic browser-chrome wrapper with 36px title bar, three border-only dots (no emoji), 1px border, 12px radius, secondary surface fill. Children are any product mock — iframe live demos, dashboard screenshots, animated mockups. Default content aspect 16/10; override via `aspect` prop. Promoted in vendo-ai session 1 (2026-04-13). | Photographic editorial cards — use `ImageCard`. Cards that must NOT read as a "browser window" (testimonial blocks, bento cells). |
| `StickyFeatureList` | `ui-kit/components/section/StickyFeatureList.tsx` | Pinned-left-visual + scrolling-right-list pattern (Apple product pages, Linear Method, Stripe). `items: {number,title,body,visual?}[]`. Tracks the most-visible list item via IntersectionObserver and cross-fades the sticky visual via `<AnimatePresence mode="wait">`. Optional per-item `visual` override; default is a minimal chapter-card illustration. Promoted from booquarium session 1 (2026-04-17). | Short feature lists (≤2 items) — overkill; use a plain 2-col layout. Parallel features where user's eye should compare side by side — use a bento. |
| `EditorialQuote` | `ui-kit/components/section/EditorialQuote.tsx` | Singular pull-quote section. Large decorative `"` glyph in accent, italic serif blockquote, optional attribution with accent dash. No background — sits cleanly on white. Props: `quote`, `attribution`, `attributionDetail`. | Multiple testimonials side by side — use `BlurbWall`. |
| `BlurbWall` / `BlurbCard` | `ui-kit/components/section/BlurbWall.tsx` | Dense editorial blurb grid (back-of-paperback aesthetic). `blurbs: {quote,source,stars?}[]`. 3-col at `lg`, 2-col at `sm`, 1-col on narrow mobile. Each card: border + radius-window, italic serif quote, dot-stars in accent, source in small-caps eyebrow. Hover: border-strong + subtle shadow + 2px translate. Each card gets `data-motion="blur-reveal"` + `data-motion-index` for staggered entry. Promoted from booquarium session 1 (2026-04-17). | Singular/testimonial quotes (one-at-a-time emphasis) — use `EditorialQuote` instead. Long-form case studies — use `ImageCard`. |
| `LogoBelt` | `ui-kit/components/section/LogoBelt.tsx` | Client-logo row — greyscale at 50% opacity by default, each logo pops to full colour + 100% opacity on hover (150ms doctrine easing). Props: `logos`, `size` (sm=24 / md=32), `gap`, `align` (left/center/between), `grayscale`, optional `ImgComponent` adapter. Collapses to a 2-col grid on mobile. Uses plain `<img>` by default (see file header for rationale); pass `ImgComponent` for next/image or pre-rendered `render` elements per logo. | Single hero-scale logos — those belong in a bespoke layout. Logos that need individual captions — use `ImageCardGrid`. |
| `FAQAccordion` / `FAQItem` | `ui-kit/components/section/FAQAccordion.tsx` | Headless accordion — `items: {question, answer}[]`. Default behaviour is `multi` (every panel toggles independently) — pass `mode="single"` for radio-style behaviour. Uses framer-motion `AnimatePresence` with height+opacity exit. Hairline top/bottom border per item, rotating +/− glyph at 45°. Respects `prefers-reduced-motion`. Promoted from booquarium session 2 (2026-04-18). | Single long FAQ entry — use plain prose. A chained narrative where each item builds on the last — use `StickyFeatureList`. |

## Navigation

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `NavSticky` | `ui-kit/components/nav/NavSticky.tsx` | Any landing that needs a sticky header with transparent → backdrop-blur scroll state, horizontal nav, pill CTA, and a mobile burger overlay. Props `{ logo, links, cta, dataSource? }`. Split a logo with a `~` to get an accent wave glyph between the two halves (delegates to `LogoWave`). | Full-width mega-menu navigation with multi-column dropdowns — this component only supports flat link arrays. Build a `NavMegaMenu` variant instead. |
| `LogoWave` | `ui-kit/components/brand/LogoWave.tsx` | `Template ~ Design` wordmark with an accent wave glyph painted between the two halves. Props `{ logo, size?, href?, tone?, dataSource? }`. Split on the first `~`. Promoted in session 14 after hitting 2 uses (Nav + Footer). | Any wordmark that doesn't use the `~` split pattern — render plain text instead. |
| `FooterEditorial` | `ui-kit/components/section/FooterEditorial.tsx` | Default closing pattern for every landing. Oversized typographic wordmark + sitemap nav (small-caps) + tagline + legal/built-with row with "Back to top" link. Light-theme by default; inherits `--color-text` so will invert under a dark scope. Props `{ wordmark, tagline?, links?, legal?, builtWith?, topHref? }`. Promoted from booquarium session 1 (2026-04-17). | Dark-scoped footer with decorative dot-row + socials (template-design has a project-local `FooterEditorial` with more surface area — leave that one at the project level). |

## Forms

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `Input` | `ui-kit/components/ui/Input.tsx` | Standard `<input>` wrapper with `label` / `helperText` / `error` / `leftSlot` / `rightSlot`. Sizes md (44px) and lg (48px). 8px radius, accent focus border + 3px accent-20% ring. Font-size fixed at 16px (prevents iOS Safari zoom). | Single-select dropdowns — build `Select` (not in kit yet). Rich-text editor — far outside scope. |
| `Textarea` | `ui-kit/components/ui/Textarea.tsx` | Multi-line counterpart to `Input`. Default `rows={4}`, resize-y. Shares the same label/helper/error API, radius, focus ring, and 16px min font-size. | One-line text collection — use `Input`. |

## Controls

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `SegmentedToggle` | `ui-kit/components/ui/SegmentedToggle.tsx` | Minimal typographic 2-3 state control. Active option is weight 700 in `--color-text`, inactive is weight 500 in `--color-text-subtle`, with a faint `/` divider between options. No pill background, no group border — matches the editorial restraint used on `/system`. Arrow-left/right keyboard cycling. Sizes sm and md. | A full tabbed UI with panels — build `Tabs` (not in kit yet). More than 3 states — use a `Select` or a group of checkboxes. |

## Motion primitives

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `MarqueeInfinite` | `ui-kit/components/motion/MarqueeInfinite.tsx` | Infinite horizontal text ticker. `items: string[]`, `speed` (px/s, default 60), custom `separator`. Duplicates the row to loop seamlessly. Fades edges with a mask gradient. Stops on `prefers-reduced-motion`. | Logo marquees — use `LogoBelt` (static) or build `LogoMarquee` variant. |
| `BlurReveal` | `ui-kit/components/motion/BlurReveal.tsx` | Section-enter reveal. Wraps children, transitions from `{opacity 0, y 24, blur 8}` → resting state when in view. Props: `delay / duration / margin / once / className / dataSource`. Respects `prefers-reduced-motion` (renders children instantly). | Long running text you want to reveal word-by-word — use `SplitText` instead. |
| `SplitText` | `ui-kit/components/motion/SplitText.tsx` | Narrative paragraphs that should reveal word-by-word (editorial split-text pattern). Each word gets its own `motion.span` with staggered opacity/y/blur. Plain text input (`text: string`) so copy-paste selection still works. Respects `prefers-reduced-motion`. | Dense UI labels or very short headings — too much per-word machinery for ≤3 words. |

## Devtools

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| Inspector (spec only) | `ui-kit/components/devtools/Inspector.tsx` | Dev-mode overlay for Cmd+click inspection of any element. Read `data-component` / `data-source` / `data-tokens`. | Production builds. |

---

## Must-have v1 (from research, to be built on demand)

These are the components the Awwwards 2024-2026 research flagged as high-frequency. Build them when a project first needs them, then list them above.

1. ~~**MarqueeInfinite**~~ → Motion primitives (promoted booquarium session 3 2026-04-19)
2. **MagneticButton** — magnetic hover attraction for CTAs. *(superseded by Button `magnetic` prop — keep for standalone variant if ever needed)*
3. **CursorFollow** — custom cursor with mix-blend-mode variants.
4. **DotGridSurface** — 24×24 radial-gradient background, light + dark variants.
5. **TestimonialBlock** — editorial quote variant.
6. **LogoMarquee** — infinite logo strip for trust bar. *(distinct from `LogoBelt` — marquee is scrolling, belt is static)*
7. **Select** — single-select dropdown primitive (Form coverage).
8. **Tabs** — tabbed panel control for UI-heavy landings.

### Done (moved to the tables above)

- ~~HeroPinned~~ → Hero variants
- ~~SplitTextReveal~~ → Motion primitives (`SplitText`)
- ~~BlurReveal~~ → Motion primitives
- ~~BentoGrid~~ → Layout
- ~~StickyFeatureList~~ → Feature sections
- ~~EyebrowLabel~~ → Primitives
- ~~SectionHeader~~ → Layout
- ~~FAQAccordion~~ → Feature sections
- ~~FooterEditorial~~ → Navigation
- ~~NavSticky~~ → Navigation

---

## Promotion rules

When you build something reusable in a project:
1. Move the file from `projects/<name>/src/components/` to `ui-kit/components/`.
2. Re-import from the kit in the project.
3. Add a row to the appropriate table above.
4. Add/update the token list in `TOKENS.md` if new tokens were needed.
5. Note the promotion in the project's `DECISIONS.md` and `CHANGELOG.md`.
