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
| `SectionColophon` | `ui-kit/components/section/SectionColophon.tsx` | Editorial annotation in a section corner: `"01 / hero"` in IBM Plex Mono 11px uppercase muted. Static, never animates, ASCII only, hidden below 640px. Props `{ n, name, dataSource?, className?, style? }`. Promoted from corder-landing 2026-05-20. | A primary heading, a section number badge with a background, or any clickable element. This is a quiet typographic marker. |
| `BentoGrid` / `BentoCell` | `ui-kit/components/section/BentoGrid.tsx` | 12-column CSS-grid container (`BentoGrid`) + cells (`BentoCell`) with responsive column spans (`{base,md,lg}`), row spans, tones (`default`/`surface`/`accent`), and doctrine radius + border + hover-border-strong transition. The default layout for feature sections in 2024-2026 SaaS. | A standard 2-3 col photo grid — use `ImageCardGrid`. A sticky-visual list — use `StickyFeatureList`. |
| `SpecStrip` | `ui-kit/components/section/SpecStrip.tsx` | One quiet hairline-bordered strip of terse facts. `direction="horizontal"` (default): a single `\|`-divided row of mono fact strings near a hero fold (the credibility row that REPLACES chip soup, max ~5 facts, uniform). `direction="vertical"`: a stack of hairline rows, each a label (display) + optional detail (sans), for an ownership / truth strip. `tone` `light`/`dark`, `mono` (horizontal default true), `accentDot` (one accent dot per vertical row). All text >= 16px, monochrome, no icons. Props `{ items, direction?, mono?, tone?, accentDot?, className? }`. Promoted from tracer 2026-06-22. | A scatter of coloured proof pills (this is the opposite). A grid of cards (use `BentoGrid`). Animated headline numbers (use `MetricsBar`). |
| `DarkSection` | `ui-kit/components/section/DarkSection.tsx` | Full-bleed near-black break section for the light → dark → light page rhythm. Scopes child text to an on-dark paper-white ramp, lays a soft `.dot-grid-dark` atmosphere, top+bottom white/10 hairlines; the single accent pops. Token contract (project supplies in @theme): `--color-ink-surface` (warm near-black), `--color-on-dark` (paper-white), `--color-accent`, plus `.dark-scope` + `.dot-grid-dark` classes in globals.css. Props `{ component, source, tokens?, grid?, pad?, bleed?, id?, className?, innerClassName? }`. `bleed` drops the inner max-width + horizontal padding so the project supplies its own content grid (e.g. a single `.grid-page` shared across light AND dark sections) while the dark background still bleeds full-viewport; added tracer V2 2026-06-23. Motion-off safe (static surface; child motion gates itself), CLS-neutral. Promoted from quirky-landing 2026-06-01. | Light marketing sections — use `Section`. A dark footer with its own surface treatment — keep that project-local. Anything that must NOT invert text (it sets on-dark colour on all children). |

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
| `StickyFeatureList` | `ui-kit/components/section/StickyFeatureList.tsx` | Pinned-left-visual + scrolling-right-list pattern (Apple product pages, Linear Method, Stripe). `items: {number,title,body,visual?}[]` where `body` is `string \| ReactNode` (wrap mono paths / inline marks). Tracks the most-visible list item via IntersectionObserver and cross-fades the sticky visual via `<AnimatePresence mode="wait">`. Optional per-item `visual` override; default is a minimal chapter-card illustration. `showOrdinal` (default OFF) gates the "Chapter NN" ordinal label above each title — leave it off unless the section genuinely reads as numbered chapters (the ordinal is a kicker by doctrine). Promoted from booquarium session 1 (2026-04-17); showOrdinal + ReactNode body added tracer fix round (2026-06-22). | Short feature lists (≤2 items) — overkill; use a plain 2-col layout. Parallel features where user's eye should compare side by side — use a bento. Turning `showOrdinal` on as decoration — only when steps are truly chapters. |
| `EditorialQuote` | `ui-kit/components/section/EditorialQuote.tsx` | Singular pull-quote section. Large decorative `"` glyph in accent, italic serif blockquote, optional attribution with accent dash. No background — sits cleanly on white. Props: `quote`, `attribution`, `attributionDetail`. | Multiple testimonials side by side — use `BlurbWall`. |
| `BlurbWall` / `BlurbCard` | `ui-kit/components/section/BlurbWall.tsx` | Dense editorial blurb grid (back-of-paperback aesthetic). `blurbs: {quote,source,stars?}[]`. 3-col at `lg`, 2-col at `sm`, 1-col on narrow mobile. Each card: border + radius-window, italic serif quote, dot-stars in accent, source in small-caps eyebrow. Hover: border-strong + subtle shadow + 2px translate. Each card gets `data-motion="blur-reveal"` + `data-motion-index` for staggered entry. Promoted from booquarium session 1 (2026-04-17). | Singular/testimonial quotes (one-at-a-time emphasis) — use `EditorialQuote` instead. Long-form case studies — use `ImageCard`. |
| `LogoBelt` | `ui-kit/components/section/LogoBelt.tsx` | Client-logo row — greyscale at 50% opacity by default, each logo pops to full colour + 100% opacity on hover (150ms doctrine easing). Props: `logos`, `size` (sm=24 / md=32), `gap`, `align` (left/center/between), `grayscale`, optional `ImgComponent` adapter. Collapses to a 2-col grid on mobile. Uses plain `<img>` by default (see file header for rationale); pass `ImgComponent` for next/image or pre-rendered `render` elements per logo. | Single hero-scale logos — those belong in a bespoke layout. Logos that need individual captions — use `ImageCardGrid`. |
| `EventCards` | `ui-kit/components/section/EventCards.tsx` | Vertical list of event/appearance cards. Each row: large accent date, venue name, city + type metadata, arrow link. Hairline-bordered rows. Props: `eyebrow`, `headline`, `events[]`. Promoted from booquarium session 3 (2026-04-19). | A calendar grid — build `CalendarGrid`. Static text-only lists — use `StickyFeatureList`. |
| `PressStrip` | `ui-kit/components/section/PressStrip.tsx` | Grid of press/interview cards. Each cell: type badge (Interview/Essay/Podcast/Profile) in distinct color, publication name bold-uppercase, italic article title, "Read →" accent link. Border-grid layout. Props: `eyebrow`, `headline`, `items[]`. Promoted from booquarium session 3 (2026-04-19). | Star ratings or review scores — use `BlurbWall`. Logo-only press rows — use `LogoBelt`. |
| `ContactStrip` | `ui-kit/components/section/ContactStrip.tsx` | Three-column contact section (press / rights / speaking). Each column: small-caps label, description text, `mailto:` email link with accent underline. Border-grid. Props: `eyebrow`, `headline`, `columns[]`. Promoted from booquarium session 3 (2026-04-19). | Full contact forms — build a `ContactForm` component instead. Single email — use plain text. |
| `MetricsBar` | `ui-kit/components/section/MetricsBar.tsx` | Editorial audience-metrics row (creator / publisher landings). Big serif numbers in accent + small-caps sans labels + hairline-grid cells. Count-up animation on scroll-into-view with `cubic-bezier(0.16, 1, 0.3, 1)`. Respects `prefers-reduced-motion` AND `?motion=0` (renders final values synchronously — no "0" flash). Props `{ eyebrow?, headline?, intro?, note?, items: MetricItem[], id?, className?, dataSource? }`. Parses "54K" / "2.1M" / "3,800" / "6.4%" — preserves suffix, keeps thousands separator. Promoted from pagestack session 1 (2026-04-22). | Non-numeric stats or ratings — use `BlurbWall` for review quotes, `EventCards` for counts with date context. A single hero metric — use a bespoke oversized serif. |
| `ModeSwitcher` | `ui-kit/components/section/ModeSwitcher.tsx` | Interactive "one input, many outputs" demo for utility / dev-tool landings. A single static `scene` above a real WAI-ARIA tablist of `<button>` tabs; clicking a tab cross-fades the `role="tabpanel"` output live (visitor-driven comprehension). `tabs: {id,label,output,caption?}[]`, plus `scene`, `defaultIndex` (resolves the FIRST tab so the panel is NEVER blank under ?motion=0 / reduced-motion / no-JS), `tone` (`light` / `dark` panel ramp), `minPanelHeight` (CLS-neutral). Roving tabindex + Arrow/Home/End keyboard nav + aria-selected. Output cross-fade on the doctrine ease (no bounce); reads `prefers-reduced-motion` AND `?motion=0` inline and swaps instantly in static mode while click switching still works. Token-driven chrome (single accent on the active tab). Promoted from quirky-landing 2026-06-01. | A persistent multi-panel tabbed UI where each panel is a whole page region — build `Tabs`. A control with no shared scene above it (just a segmented switch) — use `SegmentedToggle`. |
| `FAQAccordion` / `FAQItem` | `ui-kit/components/section/FAQAccordion.tsx` | Headless accordion — `items: {question, answer}[]`. Default behaviour is `multi` (every panel toggles independently) — pass `mode="single"` for radio-style behaviour. Uses framer-motion `AnimatePresence` with height+opacity exit. Hairline top/bottom border per item, rotating +/− glyph at 45°. Respects `prefers-reduced-motion`. Promoted from booquarium session 2 (2026-04-18). | Single long FAQ entry — use plain prose. A chained narrative where each item builds on the last — use `StickyFeatureList`. |

## Navigation

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `NavSticky` | `ui-kit/components/nav/NavSticky.tsx` | Any landing that needs a sticky header with transparent → backdrop-blur scroll state, horizontal nav, pill CTA, and a mobile burger overlay. Props `{ logo, links, cta, dataSource? }`. Split a logo with a `~` to get an accent wave glyph between the two halves (delegates to `LogoWave`). | Full-width mega-menu navigation with multi-column dropdowns — this component only supports flat link arrays. Build a `NavMegaMenu` variant instead. |
| `LogoWave` | `ui-kit/components/brand/LogoWave.tsx` | `Template ~ Design` wordmark with an accent wave glyph painted between the two halves. Props `{ logo, size?, href?, tone?, dataSource? }`. Split on the first `~`. Promoted in session 14 after hitting 2 uses (Nav + Footer). | Any wordmark that doesn't use the `~` split pattern — render plain text instead. |
| `Mascot` | `ui-kit/components/brand/Mascot.tsx` | Token-driven friendly blob character with personality: randomized blink, cursor-tracking pupils (fine pointers only), and three moods (`idle` / `happy` / `peek`). All colours are CSS vars (accent-soft body, ink stroke, paper eyes) so it inherits the project accent. Pass `still` for the calm static pose under reduced-motion / `?motion=0`. Dependency-free (CSS-transform squish, pneumatic ease, no bounce). Promoted from quirky-landing soul pass (2026-06-01). Wrap it for reactions / speech bubbles per project. | A detailed illustrated mascot or a multi-frame animated sprite. This is a single expressive blob, not a sprite system. Do not make it nag or block content (it is a FRIEND, not Clippy). |
| `FooterEditorial` | `ui-kit/components/section/FooterEditorial.tsx` | Default closing pattern for every landing. Oversized typographic wordmark + nav + tagline + legal/built-with row with "Back to top" link. Light-theme by default; inherits `--color-text` so will invert under a dark scope. Nav is either a flat small-caps sitemap (`links`) OR labeled column groups (`columns: {label, links}[]`, contract-S7b style; takes precedence over `links`). Each `FooterLink` accepts `external?: boolean` which adds `target=_blank rel=noopener noreferrer`. All text >= 16px (back-to-top is `whitespace-nowrap`). Props `{ wordmark, tagline?, links?, columns?, legal?, builtWith?, topHref?, topLabel?, hideBottomBar? }`. Promoted from booquarium session 1 (2026-04-17); columns + external + 16px floor added tracer fix round (2026-06-22). | Dark-scoped footer with decorative dot-row + socials (template-design has a project-local `FooterEditorial` with more surface area — leave that one at the project level). |

## Forms

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `Input` | `ui-kit/components/ui/Input.tsx` | Standard `<input>` wrapper with `label` / `helperText` / `error` / `leftSlot` / `rightSlot`. Sizes md (44px) and lg (48px). 8px radius, accent focus border + 3px accent-20% ring. Font-size fixed at 16px (prevents iOS Safari zoom). | Single-select dropdowns — use `Select`. Rich-text editor — far outside scope. |
| `Textarea` | `ui-kit/components/ui/Textarea.tsx` | Multi-line counterpart to `Input`. Default `rows={4}`, resize-y. Shares the same label/helper/error API, radius, focus ring, and 16px min font-size. | One-line text collection — use `Input`. |
| `Select` | `ui-kit/components/ui/Select.tsx` | Headless single-select combobox. Custom listbox panel avoids native OS dropdown chrome (macOS aqua, etc.). Keyboard nav (Arrow/Enter/Escape/Home/End/Tab), outside-click close, hidden input for native form submission via `name` prop. Shares Input's label/helper/error API, 8px radius, accent focus ring. Accepts `options: string[] \| SelectOption[]`. Promoted from pagestack session 2 after judge flagged native `<select>` as brand-breaking. | Searchable combobox / autocomplete — build `Combobox` (not in kit yet). Multi-select — build `MultiSelect`. |

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
| `useEnhancementEnabled` | `ui-kit/components/motion/useEnhancementEnabled.ts` | The single gate for any heavy / scroll-pinned / fixed-overlay motion enhancement that must layer on top of a static content backbone, not replace it. Returns true only when viewport ≥ `minWidth` (default 768) AND `prefers-reduced-motion` is unset AND `html[data-motion]` is not `"off"` (the `?motion=0` QA flag). Returns false during SSR and the first client frame, then resolves after mount; re-evaluates on resize, reduced-motion change, and `data-motion` change. Gate the flourish on this; render the static sections unconditionally underneath. Promoted from quirky-landing 2026-06-01 (the scroll-pinned morph overlay). | Lightweight in-view reveals — `BlurReveal` already handles reduced-motion/`motion=0` itself, no separate gate needed. Anything that should run on mobile too — this hook deliberately excludes narrow viewports. |
| `scroll-timeline-reveal.css` | `ui-kit/components/motion/scroll-timeline-reveal.css` | Native CSS scroll-driven reveal (rise + sharpen on viewport entry) via `animation-timeline: view()`. Zero JS, compositor thread. Apply `.st-reveal` (plus `.st-reveal-1..4` for stagger) to repeated rows/cards. TRIPLE-GATED: `@supports (animation-timeline: view())` + `prefers-reduced-motion: no-preference` + `html:not([data-motion="off"])`; otherwise content is simply visible (resting state). transform/opacity/filter only => CLS 0. Requires the pre-hydration `data-motion` bootstrap so `?motion=0` resolves before paint. Promoted from quirky-landing 2026-06-01 (awwwards-motion pass). | Browsers/contexts where you cannot guarantee the resting state is visible by default — but this pattern already defaults visible, so that case does not exist. One-off entrance of a single hero element — use `BlurReveal`. |

## System / documentation surfaces

These primitives are built for `/system` style documentation pages (Aisoldier doctrine docs, 3mpq-studio-export `/#/system`, future kit-mirror sites). They are deliberately monochrome — no accent reaches into chrome. Every one is safe to import from both Next.js and Vite consumers.

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `CodeBlock` | `ui-kit/components/system/CodeBlock.tsx` | Copyable code surface for doc pages. Plex Mono 14px, hairline border, radius 8, 36px toolbar with optional filename and a Copy button that toggles to "Copied" with a fixed min-width (no layout shift). No syntax-highlight tokens in v1. Props `{ code, filename?, bare?, copyLabel?, copiedLabel?, preamble?, className?, dataSource? }`. Promoted from /system redesign 2026-05-14. | Inline `<code>` runs inside prose — use plain `<code>` with `var(--font-mono)`. Editable sandboxes — out of scope for v1. |
| `PropsTable` | `ui-kit/components/system/PropsTable.tsx` | Component API documentation. Fixed four-column schema (Name / Type / Default / Description), hairline cell borders, monospace for the first three columns, Plex Sans 16px for Description. "No default" renders as the literal lower-case word `none` (no em-dash). Props `{ rows, caption?, className?, dataSource? }`. | Any tabular content that is not a typed-props reference — use a plain `<table>` styled inline. |
| `DocCard` | `ui-kit/components/system/DocCard.tsx` | The canonical component documentation block. Renders, in fixed order, header (name + status badge + source path + pairs-with + used-in), preview surface, `CodeBlock`, `PropsTable`, and a Don't / Do paragraph pair. `extras` slot for variants. Status badge has three preset states (`stable` / `beta` / `spec-only`) using only border weight, no fill. Props `{ name, source, status?, description?, pairsWith?, usedIn?, lastUpdated?, preview, code, codeFilename?, props?, doNote?, dontNote?, extras?, id?, className? }`. | Standalone preview cards inside marketing pages — they should not borrow the documentation surface. |
| `SidebarNav` | `ui-kit/components/system/SidebarNav.tsx` | Left-rail navigation primitive for doc pages. Two levels (group caption uppercase 12px small-caps, item label sans 14px), 2px left border on the active item, sticky-from-top on desktop, slide-in drawer on mobile. Scroll-spy wired through IntersectionObserver against the item IDs. Props `{ groups, title?, subtitle?, className?, menuLabel?, dataSource? }`. | Top-bar tabs or breadcrumb navigation — those are different primitives. |
| `TocScrollSpy` | `ui-kit/components/system/TocScrollSpy.tsx` | Right-rail table-of-contents primitive. Lists in-page anchors, highlights the most visible one via IntersectionObserver. Active item is weight 600 in `--color-text`; inactive is weight 400 in `--color-text-muted`. Hides below 1024px. Render only when a section carries more than eight anchors. Props `{ items, caption?, className?, dataSource? }`. | Short pages with three or four sections — vertical rhythm is enough. |
| `CmdKSearch` | `ui-kit/components/system/CmdKSearch.tsx` | Client-side search dialog opened by Cmd+K / Ctrl+K (or `/` when focus is not in an editable element). Filters a passed list of `{ id, label, category?, keywords? }` by substring; matched substring is rendered weight 600 against weight 400 context (monochrome — no colour highlight). Closes on Escape, click-outside, or selection. Props `{ items, onSelect, placeholder?, emptyLabel?, disableHotkey?, dataSource? }`. | Full-text search across long-form prose — needs an index. Not in scope for v1. |
| `OrchestraMark` | `ui-kit/components/system/OrchestraMark.tsx` | Quiet "Built by" credit for doc-page hero corners. Pairs an eyebrow caption with a serif wordmark and a trailing arrow that nudges right on hover. No fill, no border in the resting state. Optional `LinkComponent` prop accepts react-router or next/link adapters. Defaults to a plain `<a>` with `href="/#/orchestras/3mpq"`. Props `{ href?, eyebrow?, wordmark?, LinkComponent?, className?, dataSource? }`. | Any other footer signature or general CTA — this credit is reserved for doc-surface heroes. |
| `DocFooter` | `ui-kit/components/system/DocFooter.tsx` | Quiet single-line footer for documentation pages. Small serif wordmark on the left (22px, no decoration), small-caps link row in the middle, fineprint on the right. Designed for `/system`, `/orchestras` and similar surfaces where `FooterEditorial`'s oversized wordmark reads as marketing. Props `{ wordmark, caption?, links?, legal?, builtWith?, meta?, className?, dataSource? }`. | Landing pages — use `FooterEditorial` instead, the oversized wordmark belongs to a marketing surface. |

## Consent

| Component | Path | When to use | When NOT to use |
|---|---|---|---|
| `CookieConsent` | `ui-kit/components/consent/CookieConsent.tsx` | GDPR strict opt-in consent card. Fixed bottom-left, body-portal rendered (escapes ancestor `overflow:hidden` + zoom), MONOCHROME chrome (no accent — reads identically on light and dark scopes), token-driven so it auto-themes. Purely presentational: host passes `open` + `onAccept` / `onDecline`; component owns NO storage and NO analytics. `role="dialog"` `aria-modal="false"` (persistent corner card, not a blocking modal), focuses on mount, Esc is a no-op so consent is never implied. Promoted from 3mpq-studio-export 2026-05-19. | A blocking full-screen consent wall — this is a non-blocking corner card by design. Storage/analytics logic — that belongs in an app-level util (see `src/utils/consentLoader.ts` in studio-export), keep the kit component pure. |

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
7. ~~**Select**~~ → Forms (promoted pagestack session 2 2026-04-22)
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
