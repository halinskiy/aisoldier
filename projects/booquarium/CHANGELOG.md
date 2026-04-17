# booquarium — Changelog

Dated log of changes to this project. Write an entry every session, even short ones. Future-you will thank past-you.

Format:
```
## YYYY-MM-DD
- {{what changed}}
- {{what was decided}}
- {{what's next}}
```

---

## 2026-04-17 — Session 2

### Hero 3D Book — Complete Rebuild (FINAL PASSED)

**User brief:** Loader → book appears and opens → morph dissolves into hero at "pages open" state → scroll drives front cover open/close + back cover Y-flip.

#### New: `src/components/Loader.tsx`
- CSS book intro overlay: navy cover, crimson spine, gold border, "Opening…" serif italic 16px
- Phases: enter (400ms) → CSS cover opens (800ms) → exit fade (600ms) → unmount
- `useReducedMotion`: if reduced, skip animation entirely, still jump scroll to open state
- `lenis.stop()` / `lenis.start()` wraps animation, `lenis.scrollTo(targetY, {immediate:true})` positions scroll before loader reveals hero

#### Rebuilt: `src/components/3d/createBookTextures.ts`
- Fantasy cover art: deep navy gradient, compass rose, gold ornamental border, corner diamonds
- Front cover: "The Cartographer's Daughter" + "ELENA VOSS" in gold/cream typography
- Back cover: blurb excerpt + synopsis + barcode simulation + publisher line
- Page spread (1024×720): two-page book typography, crimson drop cap, running headers, page numbers, literary prose
- Page edge texture + inside cover bookplate with compass rose

#### Rebuilt: `src/components/3d/BookScene.tsx`
- Canvas textures applied via 6-face material arrays (BoxGeometry face 4 = +Z front, face 5 = -Z back)
- Front cover pivot at spine (`x = -BW/2`), `coverAngle` MotionValue drives Y rotation
- `bookRotY` MotionValue drives entire book Y-flip to reveal back cover
- Mouse parallax on outer tilt group, idle float, both lerped per-frame
- Separate `tiltGroup` (mouse) → `bookGroup` (scroll Y-flip) → `coverPivot` (cover open)
- Canvas textures disposed on unmount

#### Rebuilt: `src/components/sections/Hero.tsx`
- 500vh (was 200vh) to accommodate 5 scroll phases
- Phases: 0.00-0.05 closed → 0.05-0.30 cover opens → 0.30-0.55 pages visible → 0.55-0.80 cover closes → 0.80-1.0 Y-flip to back cover
- Two MotionValues (`coverAngle`, `bookRotY`) derived from `scrollYProgress` in `useEffect` — no re-renders on scroll
- Text column: `textScale` + `textOpacity` fade at 0.6-0.85 scroll progress
- Scroll hint: "Scroll to open" + animated mouse icon, fades at scrollProgress 0.06, respects `useReducedMotion`
- `useReducedMotion` imported, guards mouse SVG repeat animation

#### Doctrine fixes
- `data-tokens` changed from `"ease-out"` → `"ease-pneumatic"` (canonical name in token system)
- `hero.book_location` added to `copy.json`; hardcoded `"Edinburgh"` removed from Hero
- Loader drop-cap "T" color: `#B8322C` → `var(--color-accent)`

#### Judge: FINAL PASSED (RE-REVIEW #2)
- 6 ISSUES from RE-REVIEW #1 all closed
- CDP-verified: CSS loads, fonts loaded, all tokens resolving, MotionValues correct
- Known headless caveat: R3F WebGL canvas blank without GPU — verify 3D states in real browser

---

## 2026-04-17 — Session 1

### Kickoff
- Created project, ran kickoff research (AUDIENCE, COMPETITORS, TRENDS, MOODBOARD)
- Accent confirmed: Ink Crimson `#B8322C`. Theme: light/white.
- Pattern shortlist approved (7 sections + 2 new kit components: 3D Book Hero, Blurb Wall)
- Copywriter wrote `content/copy.json` — Elena Voss / The Cartographer's Daughter demo

### Scaffold
- Next.js 15 + Tailwind v4 + R3F + Lenis + MotionProvider
- IBM Plex Sans + Serif via next/font
- Inspector behind NODE_ENV === development

### Section 0: Nav — FINAL PASSED
- Used `NavSticky` from kit
- Kit fix: scrolled bg → `color-mix(in srgb, var(--color-bg) 85%, transparent)`
- Kit fix: plain serif logo when no tilde in logo string
- Kit fix: CTA 14px → 16px, mobile overlay CTA 15px → 16px (doctrine §2.4)
- Dev server: http://localhost:3456

### Section 1: Hero — 3D Book + scroll-pinned compression (built, awaiting judge)
- New project file `src/components/3d/BookScene.tsx` — R3F Canvas with front/back covers, pages, spine, 4 peeking-page planes, idle-float + mouse-tracking rotation
- `src/components/sections/Hero.tsx` — 200vh parent, sticky child, `useScroll` / `useTransform` feeding a `MotionValue` that the book scene reads in `useFrame`
- Text column: eyebrow (`EyebrowLabel`), H1 serif headline, italic subhead, body, primary + secondary `Button` CTAs (both overridden to `text-[16px]`), small-caps metadata row
- Webflow flag: **CUSTOM EMBED REQUIRED** — R3F canvas can't be reproduced in IX2

### Section 2: About — built, awaiting judge
- `src/components/sections/About.tsx` — 2-col with square dot-grid photo placeholder (serif initials "E.V." + caption + accent corner mark) on the left, stacked `SectionHeader` + `SplitText` bio + secondary `Button` on the right
- Bio paragraph uses `SplitText` for word-by-word reveal

### Section 3: Features (Inside the Book) — built, awaiting judge
- New kit component `ui-kit/components/section/StickyFeatureList.tsx` — pinned-left-visual + scrolling-right-list pattern, promoted to kit in the same session
- `src/components/sections/Features.tsx` — thin wrapper passing `features.items` + a `SectionHeader` header into `StickyFeatureList`
- Section id `books` so nav link `01 Books` scrolls here

### Section 4: Praise — built, awaiting judge
- New kit components `BlurbWall` + `BlurbCard` (same file), promoted this session
- `src/components/sections/Praise.tsx` — 3-col dense blurb grid on `--color-surface` background
- Footnote: "Sample copy for template demonstration"

### Section 5: Newsletter — built, awaiting judge
- `src/components/sections/Newsletter.tsx` — dot-grid full-width surface, centered composition
- Inline form with `useState`-driven "Thank you" confirmation (no backend)
- Input + submit button bespoke inline (not kit `Button`) because submit needs `rounded-[8px]` to match the input; kit `Button` primary variant is `rounded-full`

### Section 6: Footer — built, awaiting judge
- New kit component `FooterEditorial` promoted this session
- `src/components/sections/Footer.tsx` — project wrapper passing `nav.logo` as the oversized wordmark, tagline, sitemap, legal, and a "Built with Booquarium" link
- "Back to top" anchor via Lenis `#top`

### Kit surface expansion this session
- 3 new kit components: `StickyFeatureList`, `BlurbWall` (+`BlurbCard`), `FooterEditorial`
- All registered in `ui-kit/INDEX.md` and re-exported from `ui-kit/index.ts`
- 3 more Must-have v1 components ticked off (sticky feature list, editorial footer were explicitly listed)
