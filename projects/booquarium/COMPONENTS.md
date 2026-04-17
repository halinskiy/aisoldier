# booquarium — Components

Track which kit components are used and any local additions. Every local addition must be evaluated for promotion to `ui-kit/` at session end.

## Section 0: Nav

### Used from kit
- `NavSticky` (`ui-kit/components/nav/NavSticky.tsx`) — sticky header, logo, links, pill CTA, mobile burger

### Kit fixes applied this session
- `NavSticky`: scrolled bg changed from hardcoded `rgba(248,247,241,0.85)` → `color-mix(in srgb, var(--color-bg) 85%, transparent)`
- `NavSticky`: logo conditionally renders `LogoWave` (tilde present) or plain serif `<a>` (no tilde)
- `NavSticky`: desktop CTA `text-[14px]` → `text-[16px]` (doctrine §2.4)
- `NavSticky`: mobile overlay CTA `text-[15px]` → `text-[16px]` (doctrine §2.4)

### Local additions
- `src/components/sections/Nav.tsx` — thin wrapper reading `content/copy.json`

---

## Section 1: Hero — 3D Book + scroll-pinned compression

### Used from kit
- `BlurReveal` — per-element entry animation for eyebrow, headline, subhead, body, CTAs, metadata row
- `Button` (size `lg`, variants `primary` + `secondary`) — pre/read CTAs. `className="text-[16px]"` override applied to satisfy doctrine §2.4
- `EyebrowLabel` — "Debut Novel" pill

### Local additions
- `src/components/3d/BookScene.tsx` — custom R3F canvas. Not promoted to kit (project-specific, relies on book geometry not the kit's motion primitives).
- `src/components/sections/Hero.tsx` — HeroPinned variant with a 3D scene in the left column. Not promoted (too project-specific).

### Webflow handoff flag
- **CUSTOM EMBED REQUIRED** — R3F canvas cannot be reproduced in Webflow IX2.

---

## Section 2: About the Author

### Used from kit
- `SectionHeader` (align `stacked`) — eyebrow + headline
- `SplitText` — word-by-word reveal on the bio paragraph
- `Button` (variant `secondary`, size `lg`) — "Write to Elena" CTA with text-[16px] override
- `BlurReveal` — photo placeholder + CTA wrapper

### Local additions
- `src/components/sections/About.tsx` — section wrapper
- `AuthorPhotoPlaceholder` (inline component inside About) — dot-grid square with serif initials. Not promoted (too bespoke for this project).

---

## Section 3: Inside the Book (sticky feature list)

### Used from kit
- `SectionHeader` (align `stacked`) — eyebrow + headline
- `StickyFeatureList` **(new kit component, promoted this session)** — sticky-left-visual + scrolling-right-list pattern

### Promoted to kit this session
- `StickyFeatureList` + default `StickyFeatureItem` — `ui-kit/components/section/StickyFeatureList.tsx`

---

## Section 4: Praise (blurb wall)

### Used from kit
- `SectionHeader` (align `stacked`)
- `BlurbWall` + `BlurbCard` **(new kit components, promoted this session)**

### Promoted to kit this session
- `BlurbWall` + `BlurbCard` — `ui-kit/components/section/BlurbWall.tsx`. Dense 3-col editorial quote grid. Not a carousel.

---

## Section 5: Newsletter

### Used from kit
- `EyebrowLabel`
- `BlurReveal`

### Local additions
- `src/components/sections/Newsletter.tsx` — inline form with `useState`-driven "Thank you" confirmation. Client-only. No backend.

The form submit button is a bespoke inline element (not the kit `Button`) because it needs to pair with the input in an sm:flex-row layout with matching height/radius — the kit `Button` uses `rounded-full` which would clash with the input's `rounded-[8px]`.

---

## Section 6: Footer

### Used from kit
- `FooterEditorial` **(new kit component, promoted this session)**

### Promoted to kit this session
- `FooterEditorial` — `ui-kit/components/section/FooterEditorial.tsx`. Oversized typographic wordmark + sitemap + tagline + legal rows.

---

## Summary — kit surface changes this session

| Component | Path | Added | Rationale |
|---|---|---|---|
| `StickyFeatureList` | `ui-kit/components/section/StickyFeatureList.tsx` | ✅ new | Must-have v1 (INDEX.md) — Apple/Stripe product-tour pattern |
| `BlurbWall` / `BlurbCard` | `ui-kit/components/section/BlurbWall.tsx` | ✅ new | Editorial blurb-grid — reusable for any author/book/agency landing |
| `FooterEditorial` | `ui-kit/components/section/FooterEditorial.tsx` | ✅ new | Must-have v1 (INDEX.md) — default closing pattern for every landing |
| `BlurReveal` | `ui-kit/components/motion/BlurReveal.tsx` | (pre-existing) | Used heavily this session |
| `SplitText` | `ui-kit/components/motion/SplitText.tsx` | (pre-existing) | Used in About |

All three new components registered in `ui-kit/INDEX.md` and re-exported from `ui-kit/index.ts`.
