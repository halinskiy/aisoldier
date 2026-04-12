# UI Kit — Design Tokens

**Source of truth for all tokens.** Every project imports from here. The only token that changes per project is `--color-accent`.

Tokens live in Tailwind v4 `@theme` block in `ui-kit/tokens.css`. Projects copy that file and override only `--color-accent` (and optionally the dark-mode switch).

---

## Colors

### Accent (per-project override)

```css
--color-accent: #0f62fe;        /* overridden per project */
--color-accent-hover: #0043ce;  /* derived: accent darker 20% */
--color-accent-subtle: rgba(15, 98, 254, 0.08); /* derived: accent at 8% alpha */
```

**Rule:** one accent per project. Never introduce a second brand color. Derivatives (`hover`, `subtle`) are generated from the base.

### Neutral (light theme — default)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#fafafa` | Elevated surface — feature cards, panels |
| `--color-surface-2` | `#f5f5f5` | Deeper surface — quote blocks, code blocks |
| `--color-border` | `#e5e5e5` | Default border everywhere |
| `--color-border-strong` | `#d4d4d4` | Hover borders, dividers |
| `--color-text` | `#212121` | Primary text (never pure black) |
| `--color-text-muted` | `#525252` | Secondary text |
| `--color-text-subtle` | `#a3a3a3` | Tertiary text, timestamps |
| `--color-text-faint` | `#d4d4d4` | Placeholder, disabled |

### Neutral (dark theme — on request only)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#161616` | Page background (near black, never pure) |
| `--color-surface` | `#1e1e1e` | Elevated surface |
| `--color-surface-2` | `#262626` | Deeper surface, inputs |
| `--color-border` | `#393939` | Default border |
| `--color-text` | `#f4f4f4` | Primary text |

In dark theme, text hierarchy uses opacity scales on top of `#f4f4f4`:
`text-white/80` (secondary), `/50` (tertiary), `/40` (quaternary), `/30` (most muted).

---

## Typography

### Families

```css
--font-sans: 'IBM Plex Sans', system-ui, sans-serif;
--font-serif: 'IBM Plex Serif', Georgia, serif;
```

**Rules:**
- Serif is **headings, brand marks, display only**.
- Sans is everything else.
- No other families without explicit permission.
- Weights: Sans 400/500/600. Serif 500/600/700.

### Type scale (clamp-based, responsive)

| Role | Size (clamp) | Family | Weight | Line-height | Usage |
|---|---|---|---|---|---|
| `display-xl` | `clamp(64px, 8vw, 128px)` | Serif | 600 | 0.95 | Oversized hero |
| `display-lg` | `clamp(48px, 6vw, 96px)` | Serif | 600 | 1.0 | Hero |
| `display-md` | `clamp(36px, 4.5vw, 64px)` | Serif | 600 | 1.05 | Section headers |
| `h1` | `clamp(32px, 3.5vw, 48px)` | Serif | 600 | 1.1 | Page titles |
| `h2` | `clamp(24px, 2.5vw, 36px)` | Serif | 600 | 1.15 | Section titles |
| `h3` | `20px` | Serif | 600 | 1.25 | Subsection |
| `body-lg` | `18px` | Sans | 400-500 | 1.6 | Large body, intro paragraphs |
| `body` | `16px` | Sans | 400-500 | 1.625 | Default body. **Never smaller.** |
| `body-sm` | `14px` | Sans | 500 | 1.5 | UI labels, card text only |
| `eyebrow` | `12px` | Sans | 600 | 1.2 | **Uppercase, letter-spacing 0.04em.** Only allowed 12px usage. |

---

## Spacing

Context-driven, no rigid scale. Common values:

| Token | Value | Usage |
|---|---|---|
| `gap-2` | 8px | Badges, inline elements |
| `gap-3` | 12px | Feature grids, menu items |
| `gap-4` | 16px | Card internal gaps |
| `gap-6` | 24px | Section internal gaps |
| `p-4` | 16px | Small card padding |
| `p-5` | 20px | Medium card padding |
| `p-6` | 24px | Window/panel padding (mobile) |
| `p-8` | 32px | Window/panel padding (desktop) |
| `section-y` | `clamp(64px, 10vh, 160px)` | Vertical section padding |

---

## Radii

```css
--radius-window: 12px;   /* cards, modals, windows, large surfaces */
--radius-button: 8px;    /* buttons, inputs, small cards, gallery */
--radius-pill: 9999px;   /* badges, dots, avatars */
```

**Rule:** only these three values. No ad-hoc `rounded-[7px]` or `rounded-[15px]`.

---

## Motion

### Easing (mandatory)

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* default — fast-in, gentle-out */
--ease-minimize: cubic-bezier(0.4, 0, 0.2, 1); /* decelerate — for exits */
```

**Rule:** no other easings. No `ease-in`, no `ease-in-out`, no elastic, no overshoot.

### Durations

| Role | Duration |
|---|---|
| Micro (hover, focus) | 150ms |
| Menu/dropdown open | 150ms |
| Modal open | 200ms |
| Section enter | 400ms |
| Hero scroll-linked | scroll-bound, no duration |
| Theme toggle | 800ms (View Transitions API) |

### Framer Motion presets

```ts
export const enterFromBelow = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

export const blurReveal = {
  initial: { opacity: 0, filter: 'blur(12px)' },
  whileInView: { opacity: 1, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-10%' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};
```

---

## Surfaces

### Dot grid (default atmosphere)

```css
background-image: radial-gradient(circle, #e5e5e5 1px, transparent 1px);
background-size: 24px 24px;
```

Dark variant: `#333` dots on `#161616` background.

### Grain overlay (2024-2026 trend)

```css
.grain {
  position: relative;
}
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/noise.png');
  opacity: 0.04;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

---

## Borders

Every card, input, window, menu, badge has a border.

```css
.surface {
  border: 1px solid var(--color-border);
}
.surface:hover {
  border-color: var(--color-border-strong);
}
```

In dark theme, the border becomes the primary separator — shadows are light-theme only.

---

## Focus ring

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

## Text selection

```css
::selection {
  background: rgba(250, 204, 21, 0.35); /* warm yellow highlight */
  color: inherit;
}
```

Same in both themes — the yellow ties the studio's voice.

---

## Inspector attribute contract

Every component must include these data attributes on its root element:

```tsx
<div
  data-component="HeroPinned"
  data-source="ui-kit/components/HeroPinned.tsx"
  data-tokens="accent,display-lg,radius-window,ease-out"
>
```

The Inspector overlay reads these at Cmd+click and shows a floating panel with the values. This is how the Webflow developer maps a visual element back to its source.
