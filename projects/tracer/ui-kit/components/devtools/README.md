# Inspector Overlay — Live Spec

Dev-mode overlay for Cmd+click inspection of any element on a project's landing page. Built in session 1. Used by the Webflow developer to map a visual element back to its source file, component name, and tokens.

## Live kit catalog (as of session 15)

As of session 15, `@aisoldier/ui-kit` ships **12 components** — all exercised at least once in the `template-design` project, most reused ≥2 times. Promotion rule: a component is only moved into the kit after hitting ≥2 confirmed uses. No speculative promotions.

| Component | File | One-line role |
|---|---|---|
| `Inspector` | `components/devtools/Inspector.tsx` | Dev-mode Cmd+click overlay itself — reads `data-component` / `data-source` / `data-tokens` on any element and shows a floating panel with the component name, path, computed size, and token chips. |
| `NavSticky` | `components/nav/NavSticky.tsx` | Sticky header with transparent → backdrop-blur scroll state, horizontal nav, pill CTA, and mobile burger overlay. Delegates logo rendering to `LogoWave`. |
| `LogoWave` | `components/brand/LogoWave.tsx` | `Template ~ Design` wordmark with an accent wave glyph between halves. Splits on `~`. Reused by Nav + Footer. |
| `EyebrowLabel` | `components/section/EyebrowLabel.tsx` | 12px uppercase small-caps pill — the only sanctioned 12px element in the kit. `pill` / `accent` variants. |
| `Button` | `components/ui/Button.tsx` | Shared CTA primitive. Variants `primary / secondary / ghost / accent`, sizes `md / lg`. Renders as `<a>` when `href` is passed. Optional `magnetic` prop for pointer-tracking drift on hover. |
| `AvatarStack` | `components/section/AvatarStack.tsx` | Overlapping circular avatars (trust-bar pattern). Correct z-order via `row-reverse` so the leftmost avatar paints on top — fixes FIGMA gap #4 at the component level. |
| `SectionHeader` | `components/section/SectionHeader.tsx` | Standard section header: eyebrow + H3 [+ body + CTA]. `align: "split" | "stacked"`. `split` reuses the project canonical `501fr 200fr 676fr` grid so gutters line up across every 2-column section. |
| `SectionDivider` | `components/section/SectionDivider.tsx` | Named 1px hairline. `tone: "default" | "strong"`. Named primitive so Inspector picks it up instead of an anonymous `<hr>`. |
| `ImageCard` | `components/section/ImageCard.tsx` | Editorial full-bleed photo card with bottom gradient overlay + eyebrow + serif H5 + optional 1-line description. Optional `href` makes the whole card a focusable link. Hover: `scale(1.03)` + overlay deepen. |
| `ImageCardGrid` | `components/section/ImageCardGrid.tsx` | Responsive grid of `ImageCard`s. `cols: 2 | 3` at lg, auto-collapses to 2-col at sm and 1-col on narrow mobile. Stamps `data-motion="blur-reveal"` + `data-motion-index` on every card. |
| `BlurReveal` | `components/motion/BlurReveal.tsx` | Section-enter reveal primitive. Framer Motion `useInView`, `{opacity 0, y 24, blur 8}` → resting state. Respects `prefers-reduced-motion`. |
| `SplitText` | `components/motion/SplitText.tsx` | Word-by-word reveal with staggered `opacity / y / blur` per `motion.span`. Plain text selection still works because each word is a real text node. Respects `prefers-reduced-motion`. |

Plus utility exports: `cn`, `motionPresets`, `EASE_OUT`, `EASE_MINIMIZE`, `durations`.

## How the Inspector works

1. Every kit component and every project section carries three data attributes on its root element:
   ```tsx
   <section
     data-component="SectionHeader"
     data-source="ui-kit/components/section/SectionHeader.tsx"
     data-tokens="text-h3,lh-h3,ls-h3,font-serif,color-text,color-text-muted"
   >
   ```

2. The Inspector is imported once in each project's `app/layout.tsx`:
   ```tsx
   {process.env.NODE_ENV === "development" && <Inspector />}
   ```

3. It listens for `keydown` to track when Cmd/Meta is held and `click` in capture phase.

4. On **Cmd+click** (or Ctrl+click on Windows/Linux):
   - Walks up the DOM from the clicked element until it finds an ancestor with `data-component`.
   - Highlights that element with a 2px outline and a semi-transparent overlay (see `InspectorPanel.tsx`).
   - Shows a dark floating panel near the element with:
     - Component name (large, bold)
     - Source path (clickable — opens in your editor via `cursor://` protocol)
     - Bounding box dimensions (`width × height px`)
     - Token chips, one per comma-separated token in `data-tokens`
     - Footer: "Esc to close · Cmd+click to inspect"

5. On **Esc** or clicking elsewhere the panel closes.

## Example: Cmd+click on the hero eyebrow

In session 4 the Inspector was contract-tested via CDP. A synthesised `MouseEvent` with `metaKey: true` was dispatched on the first `[data-component="EyebrowLabel"]`. The panel rendered correctly:

![Inspector panel showing EyebrowLabel](../../../../tmp/aisoldier-shots/desktop-inspector.png)

Visible in the screenshot:
- Blue outline around the "WEALTH ADVISORY" pill
- Dark panel reading `EyebrowLabel` / `ui-kit/components/section/EyebrowLabel.tsx` / `142 × 27 px` / five token chips (`text-label-lg`, `color-border`, `color-text`, `color-accent`, `radius-pill`)

That confirms `data-component` / `data-source` / `data-tokens` are wired end-to-end in both kit and project components.

## File layout

```
ui-kit/components/devtools/
  README.md              # this file (live catalog)
  Inspector.tsx          # the overlay root (mounts the panel on target)
  InspectorPanel.tsx     # the floating dark panel
  useInspectorHotkey.ts  # Cmd+click + Esc + scroll re-position hook
```

## Implementation notes

- **Zero runtime cost in production.** The `NODE_ENV === "development"` check means the entire Inspector tree is tree-shaken out of production builds.
- **Data attributes have zero production cost.** They're just HTML. Webflow export will strip them via a build step before handoff.
- **No external dependencies.** No devtools bridge, no React devtools protocol. Plain DOM walking.
- **Scroll-safe.** The panel is `position: fixed` and the bounding rect is re-read on scroll/resize so the outline tracks the element.
- **Mobile-unsupported by design.** The Inspector is a desktop dev tool. Touch devices don't get Cmd+click.
- **Style isolation.** The panel uses inline styles only — no external CSS to leak or receive.

## What it does NOT do

- No editing. Inspector is read-only. Editing happens in source files.
- No network requests. Everything is local.
- No auth. It's a dev tool.
- No production hot-reload integration. If you edit a source file, reload the page manually.

## Contract tests

The Inspector contract was verified twice during the `template-design` build:

- **Session 4** — CDP dispatched a synthetic `MouseEvent({metaKey: true})` on the first `EyebrowLabel`, screenshot captured the resulting panel with the correct `data-component`, `data-source`, and 5 token chips.
- **Sessions 8 / 9 / 10 / 11 / 14** — every "gap closed" claim that touched a kit component was verified by reading the rendered DOM through the same CDP assertion pattern, proving the data-attribute contract held across refactors.
