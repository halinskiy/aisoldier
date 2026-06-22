# SLOP_REPORT -- Tracer (NoCorny) redesign

Auditor: 3mpq-slophunter. Live: http://localhost:3107 @ 1440px + 500px.
Reference: research/ai-design-slop.md.

## Round 2 (re-audit after de-slop round 1)

### Verdict: CLEAN

Deterministic gates green:
- `ds-lint projects/tracer/src` -> 0 errors, 0 warnings (17 files)
- `slop-scan projects/tracer/src` -> PASS (0 blocking signals)

### Round-1 offenders -- all four resolved (verified in render + code)

1. "CHAPTER 01/02/03" eyebrow + sub-16px -- RESOLVED. No EyebrowLabel/kicker
   imported in tracer; no "chapter"/"eyebrow"/"kicker" string in src. Hero
   goes straight to h1; HowItWorks uses StickyFeatureList numbers (`01`/`02`/
   `03`) as list ordinals, not a caption above a heading.
2. Footer sub-16px (14px) -- RESOLVED. FooterEditorial has zero sub-16px text.
   StickyFeatureList has zero sub-16px text (the one `[12px]` hit was a
   `rounded-[12px]` radius, not a font size).
3. Raw hex/rgba outside tokens -- RESOLVED. Zero raw hex or rgba() in any
   `*.tsx`. All literals live in tokens.css; SVG strokes use currentColor /
   var(). Accent shades (`#e5484d`/`#cc3b42`/`#a32a30`) only in tokens.css.
4. Glassmorphism on hero recorder pill -- RESOLVED. RecorderPill
   (HeroMorphStage.tsx:191) now renders solid `--color-on-dark-glass-strong`
   + a `--color-on-dark-hairline-strong` border + `--shadow-dark-lg`. No
   backdrop-blur on the pill or any other hero surface.

### Type front cleared 70 (was 62)

No sub-16px text anywhere. Smallest text token is `--text-body: 16px`
(and `--text-eyebrow: 16px`). Every `1[0-5]px` literal in src is a non-text
dimension (record dot `12px`, sync dot `10px`, `--radius-window: 12px`, nav
`blur(12px)`). Type scale is a real display+body system: Geist (display) +
Hanken Grotesk (body) + Geist Mono for path/link strings only (one Geist
family system). Two families, ~4 sizes, big display clamps. No gradient
text, no bg-clip-text, no Title Case soup.

### Color / accent

One accent only: `#e5484d` (record red) + its hover/deep/soft/subtle shades.
Zero purple / violet / indigo. Zero gradient text or gradient buttons.
The four `*-gradient()` uses are all sanctioned, non-slop:
- two `radial-gradient(circle, ... 1px, transparent 1px)` = doctrine dot-grid
- one `linear-gradient` = a 1px vertical hairline fading at both ends
- one `radial-gradient(var(--color-accent-soft) -> transparent)` = a faint
  single-accent ambient glow under the protagonist (not a multi-hue wash)

### Note (not an offender)

`Nav.tsx:60` keeps `backdropFilter: blur(12px) saturate(1.4)` -- but ONLY on
the scrolled state, over a solid `--color-nav-scrim` background with a real
border. That is the canonical functional frosted-nav scrim (a fixed bar over
scrolling content), not the decorative stacked-glass-cards slop the brief
flagged on the hero pill. Restrained, single surface, justified. Leave it.

## Seven-front scorecard (round 2)

| Front                       | R1 | R2 | Notes |
|-----------------------------|----|----|-------|
| Structure                   | 84 | 86 | Demonstrative morph hero (record -> Dropbox -> link), not the centered-hero/3-card template spine. One focal point per screen. |
| Type                        | 62 | 84 | All >=16px now; real Geist + Hanken pairing; big display; no gradient text. Cleared 70. |
| Color                       | 88 | 90 | One accent #E5484D; zero purple/gradients; gradients are dot-grid + hairline + single-accent glow only. |
| Surface / decoration        | 70 | 86 | Hero glass pill -> solid bordered surface; borders + shadow-as-secondary on every card; nav blur is functional, not decorative. |
| Iconography / illustration  | 86 | 86 | Monochrome Dropbox glyph (not brand-blue), custom record/squiggle mark, currentColor SVGs. No emoji, no stock 3D blobs. |
| Motion                      | 84 | 86 | AirBnB soft-spring morph, plays once then rests on the share-link card; the single infinite loop is the live record dot (true live indicator). Reduced-motion + ?motion=0 fall back to beat 5 statically. |
| Content authenticity        | 88 | 88 | Real product facts (own Dropbox, ~/Dropbox/Tracer/, tracer.nocorny.com/v/..., MIT, ~12MB). No fake logos/stats/avatars. |

No front <= 50, no three fronts <= 70 -> CLEAN.

## Cross-summon

None required. Copy passed slop-scan; no fake claims spotted; mobile stub +
reduced-motion fallbacks present.
