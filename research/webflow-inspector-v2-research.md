# Webflow Inspector v2 — Research Spec

**Date:** 2026-04-11
**Author:** 3mpq-soldier research pass
**Status:** Ready for implementation planning

---

## Executive Summary

The current Inspector shows: component name, source path, bounding-box size, and design-token chips. This is useful for developers reading *our* codebase but **useless for a Webflow developer** who needs to rebuild the page visually. They don't care about React component names or file paths — they care about the exact CSS values they need to type into Webflow's Style Panel.

The enhanced Inspector v2 must show **computed CSS properties organized to match Webflow's Style Panel sections**, with one-click copy for every value. It should feel like a portable Figma Dev Mode inspect panel that lives directly on the reference build.

### What must change

| Current Inspector | v2 Inspector |
|---|---|
| Component name + source path | Element tag + suggested Webflow class name |
| Bounding box `W x H` only | Full box model: margin, padding, border, content size |
| Token chips (developer-facing) | Resolved CSS values with variable names where applicable |
| No typography info | Full typography panel: family, weight, size, line-height, letter-spacing, color |
| No layout info | Display mode, flex/grid properties, gap |
| No color info | All colors as hex + CSS variable name, with visual swatches |
| No effects | Box-shadow, opacity, border-radius, filters, transitions |
| No copy mechanism | Click-to-copy on every individual value |
| No spacing visualization | Visual box-model diagram (Chrome DevTools style) |

---

## 1. Property Catalog — Organized by Webflow Style Panel Sections

Webflow's Style Panel (post-2025 redesign) has these sections top-to-bottom. The Inspector v2 panel must mirror this order so the Webflow dev can read the panel and fill in Webflow fields sequentially.

### 1.1 Layout

| Property | How to read | Display format |
|---|---|---|
| `display` | `getComputedStyle` | `flex` / `grid` / `block` / `inline-block` / `none` |
| `flex-direction` | computed | `row` / `column` / `row-reverse` / `column-reverse` |
| `flex-wrap` | computed | `nowrap` / `wrap` |
| `justify-content` | computed | keyword value |
| `align-items` | computed | keyword value |
| `align-content` | computed | keyword value (only if wrap) |
| `gap` | computed | `{row}px {col}px` |
| `grid-template-columns` | computed | raw value |
| `grid-template-rows` | computed | raw value |

**v2 display:** Show as a mini layout diagram — a small rectangle with arrows indicating flex direction and alignment. Webflow devs set these via dropdowns, so showing the keyword is sufficient.

### 1.2 Spacing (Margin + Padding)

| Property | Display |
|---|---|
| `margin-top` | value + unit |
| `margin-right` | value + unit |
| `margin-bottom` | value + unit |
| `margin-left` | value + unit |
| `padding-top` | value + unit |
| `padding-right` | value + unit |
| `padding-bottom` | value + unit |
| `padding-left` | value + unit |

**v2 display:** Classic nested-box diagram (like Chrome DevTools Computed tab). Four concentric rectangles: margin (orange) > border (yellow) > padding (green) > content (blue). Each side shows its pixel value. Click any value to copy.

### 1.3 Size

| Property | Display |
|---|---|
| `width` | authored value (%, px, auto, vw) |
| `min-width` | value |
| `max-width` | value |
| `height` | value |
| `min-height` | value |
| `max-height` | value |
| `overflow-x` | `visible` / `hidden` / `scroll` / `auto` |
| `overflow-y` | same |
| `aspect-ratio` | value or `auto` |
| `object-fit` | `cover` / `contain` / `fill` / `none` (images only) |

**v2 display:** Show both the *authored* value (from stylesheets, which may be `100%` or `auto`) and the *computed* value in px. Webflow devs need the authored intent, not just computed pixels.

**Implementation note:** `getComputedStyle` returns computed values. To get authored values, we need to walk `element.style` and matched CSS rules via `getMatchedCSSRules` or `document.styleSheets`. Fall back to computed if authored unavailable.

### 1.4 Position

| Property | Display |
|---|---|
| `position` | `static` / `relative` / `absolute` / `fixed` / `sticky` |
| `top` | value |
| `right` | value |
| `bottom` | value |
| `left` | value |
| `z-index` | number or `auto` |
| `float` | `none` / `left` / `right` |

### 1.5 Typography

| Property | Webflow field name | Display |
|---|---|---|
| `font-family` | Font | family name, stripped of fallbacks |
| `font-weight` | Weight | numeric (400, 600, 700...) + named (Regular, Semi Bold, Bold) |
| `font-size` | Size | `{value}px` (or rem with px equivalent) |
| `line-height` | Height | value + unit, or unitless ratio |
| `letter-spacing` | Spacing | `{value}em` or px |
| `text-transform` | Transform | `none` / `uppercase` / `lowercase` / `capitalize` |
| `text-align` | Align | `left` / `center` / `right` / `justify` |
| `font-style` | Style | `normal` / `italic` |
| `text-decoration` | Decoration | `none` / `underline` / `line-through` |
| `color` | Color | hex + swatch + CSS var name |
| `word-spacing` | — | value (if non-default) |
| `text-shadow` | Shadow | full shorthand if present |

**v2 display:** Typography specimen block — render a small preview of the text "Aa" in the actual font/weight/size, followed by the property table. This mirrors Figma Dev Mode's typography section. Show font-family as the display name only (e.g. "IBM Plex Sans" not the full stack).

### 1.6 Backgrounds

| Property | Display |
|---|---|
| `background-color` | hex + swatch + CSS var |
| `background-image` | `url(...)` or gradient shorthand |
| `background-size` | value |
| `background-position` | value |
| `background-repeat` | value |
| `background-blend-mode` | value (if not `normal`) |

**v2 display:** Color swatch (24x24 rounded square) next to hex value. For gradients, render a small gradient preview bar.

### 1.7 Borders

| Property | Display |
|---|---|
| `border-width` (per side) | px value |
| `border-style` (per side) | `solid` / `dashed` / `dotted` / `none` |
| `border-color` (per side) | hex + swatch + CSS var |
| `border-radius` (per corner) | px value |
| `outline` | shorthand if present |

**v2 display:** Show border-radius as a mini corner diagram if values differ per corner. If all four are equal, show single value. Webflow has per-corner radius controls.

### 1.8 Effects

| Property | Display |
|---|---|
| `opacity` | 0-100% |
| `box-shadow` | full shorthand (inset, x, y, blur, spread, color) |
| `filter` | full shorthand |
| `backdrop-filter` | full shorthand |
| `mix-blend-mode` | value |
| `cursor` | value (if not `auto`) |
| `transform` | full shorthand |
| `transition` | property, duration, timing-function, delay |

**v2 display:** For box-shadow, show a small visual preview (dark rectangle with the shadow applied). For transitions, show as a timeline-style row: `property 300ms ease-out` with the easing curve icon.

---

## 2. UX Recommendations

### 2.1 Panel Layout

**Tabbed interface** with three tabs:
1. **Style** — all CSS properties organized by Webflow sections (default tab)
2. **Box** — visual box-model diagram (always visible as a mini version in the Style tab header)
3. **Meta** — component name, source path, tokens (the current v1 content, for our team)

Panel width: **340px** (current max is 360, keep it). Panel height: **scrollable**, max 70vh.

### 2.2 Section Collapsing

Each property group (Layout, Spacing, Size, etc.) is a collapsible section with a header. Default state:
- **Expanded:** Typography, Spacing, Size (most-used by Webflow devs)
- **Collapsed:** Layout, Position, Backgrounds, Borders, Effects (expand on click)
- **Hidden:** Sections where all values are browser defaults (e.g. no transitions, no transforms)

### 2.3 Copy-to-Clipboard UX

Three copy levels:
1. **Click any single value** — copies just that value (e.g. `16px`, `#0f62fe`, `600`)
2. **Click section header copy icon** — copies all non-default properties in that section as CSS block
3. **Click "Copy All" button** — copies entire element's non-default CSS as a formatted block

Visual feedback: value text briefly flashes with a highlight color (accent blue) and shows a small checkmark for 800ms.

### 2.4 Color Display

Every color value shows:
- **Swatch** (16x16 rounded square with checkered background for transparency)
- **Hex value** (`#0f62fe`)
- **CSS variable name** if one resolves to this value (`--color-accent`)
- Click swatch to cycle through: hex > rgb > hsl

### 2.5 Box Model Visualization

Render the classic Chrome DevTools nested-box diagram directly in the panel header area:
- Outermost: margin (semi-transparent orange)
- Middle: border (semi-transparent yellow)
- Inner: padding (semi-transparent green)
- Center: content dimensions in blue
- Each side shows its px value
- Click any value to copy
- Total footprint: ~200px wide x ~140px tall

Additionally, when the inspector is active:
- **On-page margin overlay** — orange tinted area around the element showing margin space
- **On-page padding overlay** — green tinted area inside the element showing padding space
- These overlays appear on the actual page, not just in the panel (like Chrome DevTools element highlighting)

### 2.6 Spacing Between Elements

When hovering a second element while one is already selected (hold Shift):
- Show a **distance line** (red dashed line with px label) between the two elements
- Measure edge-to-edge distance on all four sides
- This is the single most requested feature from VisBug that Webflow devs use

### 2.7 Responsive Indicators

Show the current viewport width and which Webflow breakpoint it maps to:
- Desktop: > 991px
- Tablet: 768-991px
- Mobile Landscape: 480-767px
- Mobile Portrait: < 480px

Display as a small badge in the panel header: `Desktop (1440px)`.

---

## 3. Tool Analysis — What to Steal

### 3.1 VisBug (Google Chrome Labs)

**What it does well:**
- Distance measurement between any two elements (Shift+click)
- Guides/rulers that snap to element edges
- Color contrast checking (a11y)
- Multi-select with Shift for batch inspection
- Artboard zoom mode (Option+scroll)

**What to steal:**
- Distance measurement UX between siblings
- The hover-to-reveal guides concept
- Color/contrast accessibility info

**What to skip:**
- Editing capabilities (we're read-only)
- Move/resize tools (not relevant)
- Accessibility tree inspection (not a Webflow concern for our use case)

### 3.2 CSS Scan

**What it does well:**
- Instant hover-to-see all CSS (zero clicks to start)
- Preserves authored units (%, rem, em) instead of converting to px
- Copies pseudo-classes (:hover, :before, :after) in one click
- Copies media queries per element
- DOM navigation with arrow keys (up/down to traverse parents/children)
- Optional Tailwind CSS conversion output
- Filters out overridden/duplicate declarations automatically

**What to steal:**
- Preserving authored units (critical for Webflow — they need to know if something is % or px)
- Filtering out browser defaults and overridden values (show only meaningful declarations)
- Arrow key DOM traversal
- The "clean CSS only" philosophy — no noise

**What to skip:**
- Tailwind conversion (irrelevant for Webflow)
- Live editing (we're read-only)
- Codepen export (not our workflow)

### 3.3 CSS Peeper

**What it does well:**
- Page-wide color palette extraction (all colors used on the page)
- Color categorization: text, background, border, shadow colors separately
- Typography catalog: all font pairings on the page
- Asset extraction: download all images/icons from the page
- WCAG contrast ratio checking per color pair

**What to steal:**
- Page-wide color palette view (add as a separate tab or mode)
- Typography catalog (list all unique type styles used on the page)
- Color categorization by usage type

### 3.4 Figma Dev Mode

**What it does well:**
- CSS code panel with copy button per property
- Visual box-model diagram with exact spacing
- Typography section with font specimen preview
- Color values showing both hex and variable name
- "Ready for dev" status workflow
- Version diff (what changed since last handoff)
- Component properties panel (variant, boolean, text props)

**What to steal:**
- The property organization (our sections should match Figma's order since Webflow devs already read Figma)
- Font specimen preview
- Per-property copy buttons
- Showing CSS variable names alongside resolved values

### 3.5 Responsively App

**What it does well:**
- Multi-device preview side by side
- Synchronized scroll across devices
- Unified inspector across breakpoints

**What to steal:**
- Breakpoint badge concept (show which Webflow breakpoint the current viewport maps to)
- Consider: a button that opens the current page in Responsively for multi-breakpoint comparison

---

## 4. Webflow-Specific Features

### 4.1 Class Name Suggestions

Webflow uses classes, not inline styles. The inspector should suggest a **Webflow class name** for each element based on:
- The element's role/tag (e.g. `<section>` -> `section_hero`)
- The data-component attribute (e.g. `SectionHeader` -> `section-header`)
- Follow Client-First convention by default: `{block}_{element}` with descriptive names

Display at the top of the panel: **Suggested class:** `hero_heading`

This is a suggestion only — not enforced. But it saves the Webflow dev from inventing names on the fly.

### 4.2 Webflow Panel Section Mapping

Show a small icon or label next to each property group indicating which Webflow Style Panel section it maps to. For example:
- Layout properties -> "Layout section"
- Margin/padding -> "Spacing section"
- Width/height -> "Size section"
- Font properties -> "Typography section"

This helps Webflow devs locate the right panel section instantly.

### 4.3 IX2 Interaction Annotations

Elements with motion/animation should be flagged. Read from:
- `data-motion` attribute (our convention for animated elements)
- Computed `transition` property
- Computed `animation` property
- `data-tokens` containing motion-related tokens

Display as an "Interactions" badge on the element:
- **"Has transition"** — show the transition property/duration/easing
- **"Has animation"** — show the animation name/duration
- **"Needs IX2"** — flag elements that use Framer Motion (from data-motion) with a note: "Rebuild with Webflow IX2: [trigger type] on [event]"

Include a mini IX2 recipe suggestion:
- `data-motion="blur-reveal"` -> "IX2: Scroll Into View trigger. Initial: opacity 0, blur 8px, translateY 24px. Animate to: opacity 1, blur 0, translateY 0. Easing: custom cubic-bezier(0.16, 1, 0.3, 1). Duration: 600ms."

### 4.4 Combo Class Hints

When an element has modifier-like styling (e.g. a variant of a base component), suggest combo class structure:
- Base class: `button`
- Combo class: `button.is-primary`

Detect from: data-component variant props, modifier classes in className.

### 4.5 Responsive Notes

The inspector should flag properties that are likely to need breakpoint overrides:
- Font sizes > 48px -> "Consider reducing at tablet/mobile"
- Fixed widths in px -> "Consider % or vw for responsive"
- Large padding/margin values -> "May need reduction at mobile"
- Grid with many columns -> "Likely needs fewer columns at tablet"

### 4.6 CMS Binding Hints

If an element renders dynamic content (detected via data attributes or repeated structures), add a note: "This content likely needs CMS binding in Webflow" with the collection field type suggestion.

---

## 5. Implementation Recommendations

### 5.1 Changes to `useInspectorHotkey.ts`

Add to `InspectorTarget`:
```typescript
export type InspectorTarget = {
  element: HTMLElement;
  component: string;
  source: string;
  tokens: string[];
  rect: DOMRect;
  // NEW v2 fields:
  computedStyles: CSSStyleDeclaration;
  authoredStyles: Record<string, string>; // from matched CSS rules
  parentDisplay: string; // parent's display mode (for context)
  childCount: number;
  tagName: string;
  motionData: {
    hasTransition: boolean;
    hasAnimation: boolean;
    motionAttribute: string | null;
    transitionValue: string;
    animationValue: string;
  };
};
```

### 5.2 New utility: `extractWebflowStyles.ts`

Create a function that takes an HTMLElement and returns a structured object organized by Webflow panel sections:

```typescript
type WebflowStyleMap = {
  layout: { display, flexDirection, flexWrap, justifyContent, alignItems, gap, ... };
  spacing: { marginTop, marginRight, ..., paddingTop, paddingRight, ... };
  size: { width, minWidth, maxWidth, height, minHeight, maxHeight, overflow, ... };
  position: { position, top, right, bottom, left, zIndex, float };
  typography: { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, ... };
  backgrounds: { backgroundColor, backgroundImage, backgroundSize, ... };
  borders: { borderWidth, borderStyle, borderColor, borderRadius, ... };
  effects: { opacity, boxShadow, filter, backdropFilter, transform, transition, ... };
};
```

Filter out browser defaults (compare against a baseline default map for each tag type).

### 5.3 New utility: `resolveColorVariables.ts`

Walk `document.styleSheets` to build a map of CSS custom property names to their resolved color values. When displaying any color, check if it matches a known variable and show both.

### 5.4 New component: `BoxModelDiagram.tsx`

Render the nested-box SVG/div diagram. Input: margin/padding/border/content values. Output: the visual diagram with clickable values.

### 5.5 New component: `PropertyRow.tsx`

Single row: `[label] [value] [copy button]`. The copy button is a small clipboard icon that appears on hover. Click copies value, shows checkmark for 800ms.

### 5.6 Changes to `InspectorPanel.tsx`

Replace the current simple panel with a tabbed panel:
- Tab 1: **Style** (Webflow-oriented CSS properties)
- Tab 2: **Box** (box model diagram + spacing visualization)
- Tab 3: **Meta** (current v1 content: component name, source, tokens)

Each tab's content is a scrollable area with collapsible sections.

### 5.7 On-page overlays

Add to `Inspector.tsx`:
- Margin overlay (orange tint around element)
- Padding overlay (green tint inside element)
- These render as additional fixed-position divs using the element's rect + computed spacing values

---

## 6. Priority Matrix

### Must-Have v1 (ship first)

| Feature | Effort | Impact |
|---|---|---|
| Typography section (all font properties) | Medium | Critical — #1 thing Webflow devs type |
| Spacing section with box model diagram | Medium | Critical — #2 thing Webflow devs type |
| Color values with hex + CSS var + swatch | Low | Critical — every element needs colors |
| Size section (width, height, min/max) | Low | High |
| Layout section (display, flex props, gap) | Low | High |
| Click-to-copy on every value | Low | High — saves constant cmd+c switching |
| Border-radius (all corners) | Low | High — Webflow has per-corner controls |
| Suggested Webflow class name | Low | Medium — saves naming decisions |
| Section collapse/expand | Low | Medium — reduces overwhelm |
| Filter out browser defaults | Medium | High — noise reduction |

### Nice-to-Have v2 (ship second)

| Feature | Effort | Impact |
|---|---|---|
| On-page margin/padding overlay (colored areas) | Medium | High |
| Distance measurement between elements (Shift+hover) | High | High |
| IX2 interaction recipe suggestions | Medium | Medium |
| Page-wide color palette view | Medium | Medium |
| Page-wide typography catalog | Medium | Medium |
| Responsive breakpoint badge | Low | Medium |
| Authored vs computed value toggle | High | Medium |
| Arrow key DOM traversal | Medium | Low |
| Effects section (shadows, filters, transforms) | Low | Medium |
| Position section (position type, offsets, z-index) | Low | Medium |
| Combo class suggestions | Medium | Low |
| Gradient preview rendering | Medium | Low |
| Transition timeline visualization | High | Low |
| CMS binding hints | Medium | Low |

---

## 7. Common Webflow Developer Complaints About Handoffs

Sourced from Webflow Forum, Reddit r/webflow, and agency blog posts:

1. **"I have to guess the spacing."** Designs show visual spacing but don't specify margin vs padding, or which side gets the value. The inspector must show all four sides of both margin and padding explicitly.

2. **"Font sizes change at breakpoints but nobody documents which ones."** Our inspector shows the current viewport's values. The responsive badge helps, but a future version could show "this value changes at tablet" annotations.

3. **"I don't know if this is flexbox or grid."** The layout display mode is invisible in a static design. The inspector must show `display: flex` vs `display: grid` vs `display: block` prominently.

4. **"Colors are inconsistent — is this #333 or #2d2d2d?"** Showing exact hex values (not "dark gray") is essential. Showing the CSS variable name helps maintain consistency.

5. **"I don't know what the hover state looks like or how the animation works."** IX2 recipes from data-motion attributes address this. Future: capture hover states by applying `:hover` styles on demand.

6. **"The designer used a custom font but didn't tell me which weight files to load."** Showing `font-weight: 600` as "Semi Bold" with the family name helps the Webflow dev pick the right font variant.

7. **"Border radius looks like 8px but might be 10px or 12px."** Exact per-corner values eliminate guessing.

8. **"I can't tell if overflow is hidden or visible."** Overflow is a common source of Webflow bugs. Show it explicitly.

---

## Sources

- [Figma to Webflow Workflow Guide 2026](https://www.attabird.com/blog-posts/figma-to-webflow-workflow-guide-2026)
- [Figma Dev Mode Review 2025](https://skywork.ai/blog/figma-dev-mode-review-2025/)
- [Webflow Style Properties API Reference](https://developers.webflow.com/designer/reference/style-properties)
- [Webflow Style Panel Overview](https://university.webflow.com/lesson/style-panel-overview)
- [Webflow New Style Panel](https://webflow.com/blog/meet-the-new-style-panel)
- [VisBug GitHub](https://github.com/GoogleChromeLabs/ProjectVisBug)
- [VisBug 101](https://medium.com/google-design/visbug-101-d2636120f8d7)
- [CSS Scan](https://getcssscan.com)
- [CSS Peeper](https://csspeeper.com/)
- [Responsively App](https://responsively.app/)
- [Figma Guide to Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode)
- [Figma Guide to Inspecting](https://help.figma.com/hc/en-us/articles/22012921621015-Guide-to-inspecting)
- [BRIX Figma-to-Webflow Best Practices](https://brixtemplates.com/blog/best-practices-to-build-figma-designs-on-webflow)
- [Client-First Naming Convention](https://finsweet.com/client-first/docs/classes-strategy-1)
- [Webflow BEM Class Naming](https://webflow.com/blog/class-naming-101-bem)
- [Webflow Class Types Explained](https://www.calebraney.com/post/webflow-class-types-explained)
- [Webflow Advanced Typography](https://help.webflow.com/hc/en-us/articles/33961334261779-Advanced-web-typography)
- [Webflow Developer Handoff Process](https://www.pravinkumar.co/blog/webflow-client-handoff-process-design-systems-2026)
