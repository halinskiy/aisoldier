# Template-Design — Design System Snapshot

Base inherited from `ui-kit/TOKENS.md`. This file documents **deltas and project-specific values**. Implementation in `tokens.css` (imported after the kit's `tokens.css`).

## Accent
```css
--color-accent: #FF512A;
--color-accent-hover: #E63D17;
--color-accent-subtle: rgba(255, 81, 42, 0.08);
```
Source: Figma Style guide variable `Accent`.

## Neutral palette — **WARM override** (NOT the kit default)
```css
--color-bg: #F8F7F1;           /* Figma var: Background */
--color-surface: #EFEDE7;      /* Figma var: Light */
--color-surface-2: #E8E5DC;    /* derived */
--color-border: #E0DCD0;       /* derived */
--color-border-strong: #C9C4B4; /* derived */
--color-text: #212121;         /* Figma var: Dark */
--color-text-muted: #5A5A5A;   /* derived */
--color-text-subtle: #8A8A84;  /* derived */
```

**Why this differs from the kit:** the Figma file uses a warm editorial palette, not the cold neutral default. Every surface, border, and muted text color had to be re-derived from the warm base. The kit assumes cold `#fafafa` / `#f5f5f5` / `#e5e5e5` — this project's warm equivalents are all listed above.

## Type scale — from Figma Style guide variables

| Role | Family | Weight | Size (fixed) | Size (responsive) | LH | LS |
|---|---|---|---|---|---|---|
| H0 | IBM Plex Serif | 500 Medium | 96 | clamp(40, 8vw, 96) | 1.0 | -0.026em |
| H1 | IBM Plex Serif | 500 Medium | 64 | clamp(36, 5.5vw, 64) | 0.95 | 0 |
| H2 | IBM Plex Serif | 400 Regular | 48 | clamp(28, 4vw, 48) | 1.1 | -0.042em |
| H3 | IBM Plex Serif | 400 Regular | 40 | clamp(24, 3vw, 40) | 1.1 | -0.025em |
| H4 | IBM Plex Serif | 400 Regular | 32 | clamp(22, 2.5vw, 32) | 1.1 | -0.031em |
| H5 | IBM Plex Serif | 400 Regular | 28 | clamp(20, 2vw, 28) | 1.2 | -0.018em |
| H6 | IBM Plex Serif | 500 Medium | 24 | 24 | 1.2 | -0.021em |
| Large Text | IBM Plex Sans | 400 | 20 | 20 | 1.4 | 0 |
| BodyText | IBM Plex Sans | 400 | 16 | 16 | 1.5 | 0 |
| Small Text | IBM Plex Sans | 400 | 14 | 14 | 1.5 | 0 |
| Label Large | IBM Plex Sans | 400 | 12 | 12 | 1.5 | 0.062em |
| Label Small | IBM Plex Sans | 400 | 10 | 10 | 1.5 | 0.062em |

### Notes on weight mixing
The designer deliberately mixes weights:
- **Medium on H0, H1, H6** — display headings and small heading.
- **Regular on H2, H3, H4, H5** — narrative/section headings.
This is intentional and must be preserved. Do not normalize.

### Notes on labels
- Label Large (12) and Label Small (10) have `letter-spacing: 0.062em` but are NOT uppercase in the variables file.
- **Whether to uppercase depends on how the section uses them.** Verify per section in `FIGMA_SPEC.md`. Default to uppercase for eyebrow labels above headings; keep lowercase for inline micro-copy.

## Custom tokens (project-only)
None yet — any new token introduced in a section gets recorded here before promotion.

## Reference — inherited base
See `../../ui-kit/TOKENS.md` for:
- Spacing scale
- Radii (`12px` / `8px` / full-round)
- Motion easing `cubic-bezier(0.16, 1, 0.3, 1)`
- Dot-grid surface treatment
- Focus ring
- Inspector attribute contract
