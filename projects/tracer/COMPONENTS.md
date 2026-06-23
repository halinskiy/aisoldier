# Tracer — Components

> V3 (2026-06-23) re-architected MOTION (scroll-scrubbed, not reveal-on-enter).
> The component shells below stay; their motion model changed. See the V3 block.

## V3 motion components (2026-06-23)

Kit (promoted this session):
- `@ui-kit/hooks/useScrubProgress` — the scroll-scrub engine (useScroll+useSpring
  once -> one `p`). Used by Hero, How-it-works, Ownership numbers, CTA.
- `@ui-kit/components/motion/ScrollDot` — global fixed through-dot driven by the
  page progress; docks at section markers. Mounted once in page.tsx.

Project-local:
- `src/hooks/useGlobalProgress.ts` — the ONE no-target useScroll() (page spine).
  Feeds ScrollDot + Ownership parallax.
- `src/components/ScrubReveal.tsx` — A4 scroll-linked clip/blur type reveal
  (replaced BlurReveal on all section H2s).
- `HeroMorphStage.tsx` — REWORKED: 3-beat vertical scrub (300vh).
- `HowItWorksScroll.tsx` — REWORKED: Framer horizontal scrub (300vh).
- `CTAConvergence.tsx` — REWORKED: 4-beat scroll climax (200vh).
- `OwnershipNumbers.tsx` — NEW: A5 scrubbed numbers strip (150vh).
- `TruthRows.tsx` — NEW: A4 reveal rows (replaced TravelingDot).
- `Features.tsx` — REWORKED: per-cell local-useScroll reveal (no enter stagger).
- DELETED: `TravelingDot.tsx` (animated `top`, a layout prop = jank).
- Nav: backdrop now rides `useLenis` (no addEventListener('scroll')).

> V2 (2026-06-23) reworked the section roster. The grid, the dot-thread, and
> the per-section alive moments below supersede the v1 component map where they
> conflict. SpecStrip and the v1 hero rest-card carry forward inside the new
> HeroMorphStage.

## Used from ui-kit
| Component | Used in section | Notes |
|---|---|---|
| `BlurReveal` | Hero, How it works, Features, Ownership, FAQ, Final CTA | Section-enter reveal; handles reduced-motion + `?motion=0`. |
| `AmbientDrift` | Hero, Ownership, Final CTA | V2 promote. One slow blurred glow per dark stage. Opacity clamped <=0.12, duration >=20s, translation-only, pauses under reduced-motion + `?motion=0`. |
| `SpecStrip` | Hero (horizontal) | Promoted from this project (see below). Ownership no longer uses it (replaced by TruthRail in V2). |
| `BentoGrid` / `BentoCell` | Features | Icon-free 3x2 uniform grid, tone="surface". V2 wraps each cell content in a Framer layout-arrange entrance. |
| `DarkSection` | Ownership, Final CTA | Dark studio stage; V2 uses the new `bleed` prop so content sits on the project `.grid-page`. |
| `FooterEditorial` | Footer | Oversized wordmark + labeled `columns` + tagline + legal. External links carry target/rel. |
| `useEnhancementEnabled` | HeroMorphStage, HowItWorksScroll, TravelingDot, Features, CTAConvergence | Gates all heavy morph motion (reduced-motion, `?motion=0`). |
| `scroll-timeline-reveal.css` | Features, How it works (`.st-reveal`) | Native CSS staggered rise, CLS 0. |

## V2 retirements (kit components no longer used here)
| Component | Was in | Replaced by |
|---|---|---|
| `StickyFeatureList` | How it works (v1) | `HowItWorksScroll.tsx` (scroll-scrubbed re-stage with dot rail). Kit component remains correct for pinned-visual/scrolling-list patterns; just not this section. |
| `FAQAccordion` | FAQ (v1) | `FAQTwoCol.tsx` (full-width two-column, dot open marker). |

## Local additions (project-local, NOT promoted)
| Component | Path | Why local | Promotion decision |
|---|---|---|---|
| `GridPage` | `src/components/GridPage.tsx` | The ONE page grid wrapper (`.grid-page`). | Promote to `section.GridPage` if a second project adopts the single-grid contract. |
| `HeroMorphStage` | `src/components/HeroMorphStage.tsx` | The record->capture->Dropbox->link morph is product-specific to Tracer. V2: alive from frame 1, beat-2 capture card, blur-morph seams, no scale-to-speck. | Stays project-local; custom embed. |
| `HowItWorksScroll` | `src/components/HowItWorksScroll.tsx` | Scroll-scrubbed 3-panel re-stage with the record-dot rail threading REC->sync->tick. | Promote on second use. |
| `TravelingDot` (TruthRail) | `src/components/TravelingDot.tsx` | A record-red dot travels down a left rail lighting each truth-row dot (ownership seal). Coupled to the truth-row layout. | Promote on second traveling-rail use. |
| `FAQTwoCol` | `src/components/FAQTwoCol.tsx` | Full-width two-column accordion with the ring->dot open marker + divider grid. Distinct from single-column `FAQAccordion`. | Promote on second use (as `FAQTwoCol` or a `FAQAccordion` twoCol variant). |
| `CTAConvergence` | `src/components/CTAConvergence.tsx` | The B2 four-beat payoff convergence; unique to Tracer's single-object motif. | No promotion; custom embed. |
| `GridOverlay` | `src/components/dev/GridOverlay.tsx` | Dev-only 12-col guide overlay, localStorage toggle, absent in production. | No promotion; project dev utility. |
| `NoCornyMark` | `src/components/NoCornyMark.tsx` | Tracer's own brand mark (squiggle into record dot). V2: one-shot `pulse` on the terminal dot. | Project-local brand asset. |
| `Nav` | `src/components/sections/Nav.tsx` | Bespoke nav: transparent-over-dark-hero inversion + two CTAs + squiggle mark + V2 sliding active-section dot. | Stays project-local. |

## Promoted to ui-kit this project
| Component | Session | Rationale |
|---|---|---|
| `AmbientDrift` | 2026-06-23 (V2) | One slow blurred low-opacity drifting glow for cinematic dark stages. Distinct from MarqueeInfinite/BlurReveal. Hard limits baked in (opacity <=0.12, duration >=20s, translation-only). `useId` keyframe name for hydration stability. Registered in `index.ts`, `INDEX.md`, `REGISTRY.json` (`motion.AmbientDrift`). Used on Hero, Ownership, CTA. |
| `SpecStrip` | 2026-06-22 | A single hairline strip of terse facts. Used in hero. Registered (`section.SpecStrip`). |

## Kit components extended this project
| Component | Change | Benefits |
|---|---|---|
| `DarkSection` | V2: `bleed` prop drops the inner max-width + horizontal padding so a project can run a single grid across light AND dark sections (the dark background still bleeds full-viewport). | Any project enforcing one page grid. |
| `StickyFeatureList` | fix round 1: `showOrdinal` (default OFF) + `body` ReactNode + 16px floor. | Every kit consumer. (No longer used by tracer in V2.) |
| `FooterEditorial` | fix round 1: `external` flag + labeled `columns` + 16px floor. | Every landing footer. |

## Not using from ui-kit (explicit opt-outs)
- `NavSticky`: opted out (bespoke `Nav`, see DECISIONS).
- `StickyFeatureList`, `FAQAccordion`: opted out in V2 (replaced by the bespoke
  `HowItWorksScroll` / `FAQTwoCol`; both kit components remain correct for their
  original patterns, just not these sections).
- `EyebrowLabel`: banned on this project (no eyebrow chips). Not used anywhere.
