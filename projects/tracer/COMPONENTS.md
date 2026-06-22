# Tracer — Components

## Used from ui-kit
| Component | Used in section | Notes |
|---|---|---|
| `BlurReveal` | Hero, How it works, Features, Ownership, FAQ, Final CTA | Section-enter reveal; handles reduced-motion + `?motion=0`. |
| `SpecStrip` | Hero (horizontal), Ownership (vertical) | Promoted from this project (see below). |
| `StickyFeatureList` | How it works | 3 steps; per-step `visual` = a `MorphPanels` frame. `showOrdinal` left OFF (no Chapter kicker). step-2 `body` is a ReactNode wrapping `~/Dropbox/Tracer/` in Geist Mono. |
| `BentoGrid` / `BentoCell` | Features | Icon-free 3x2 uniform grid, tone="surface". |
| `DarkSection` | Ownership, Final CTA | Dark studio stage with white/10 hairlines. |
| `FAQAccordion` | FAQ | `mode="single"`. |
| `FooterEditorial` | Footer | Oversized wordmark + labeled `columns` (Product / Open source / NoCorny) + tagline + legal. External links carry target/rel via the `external` flag. |
| `useEnhancementEnabled` | HeroMorphStage | Gates the morph (minWidth 1024, reduced-motion, `?motion=0`). |
| `scroll-timeline-reveal.css` | Features (`.st-reveal`) | Native CSS staggered rise, CLS 0. |

## Local additions (project-local, NOT promoted)
| Component | Path | Why local | Promotion decision |
|---|---|---|---|
| `HeroMorphStage` | `src/components/HeroMorphStage.tsx` | The 5-beat record->Dropbox->link morph is product-specific to Tracer; no other product needs this exact storyboard. | Stays project-local; noted in HANDOFF as a custom embed. Generalise before promoting if reused. |
| `MorphPanels` | `src/components/MorphPanels.tsx` | Static frames of the hero beats for the how-it-works visuals; tied to Tracer's chrome. | Project-local. |
| `NoCornyMark` | `src/components/NoCornyMark.tsx` | Tracer's own brand mark (squiggle into record dot). | Project-local brand asset (not the 3mpq fallback). |
| `Nav` | `src/components/sections/Nav.tsx` | Bespoke nav (see DECISIONS): transparent-over-dark-hero theme inversion + two CTAs + squiggle mark do not fit `NavSticky`'s composition. | Stays project-local. If the transparent-over-dark pattern recurs, add a `tone`/`overDark` prop to kit `NavSticky` rather than re-forking. |

## Promoted to ui-kit this project
| Component | Session | Rationale |
|---|---|---|
| `SpecStrip` | 2026-06-22 | A single hairline strip of terse facts (horizontal credibility row OR vertical label+detail truth strip). Genuinely distinct from Badge/Bento/MetricsBar. Used twice in this project (hero + ownership). Registered in `index.ts`, `INDEX.md`, `REGISTRY.json` (`section.SpecStrip`). Fix round: vertical label column firmed to 280px so all detail rows share one left edge. |

## Kit components extended this project (fix round 1, 2026-06-22)
| Component | Change | Benefits |
|---|---|---|
| `StickyFeatureList` | `showOrdinal` prop (default OFF) gates the "Chapter NN" kicker; `body` widened to `string \| ReactNode`; sub-16px ordinal/eyebrow raised to 16px. | Every kit consumer; removes a doctrine kicker by default and unblocks inline mono in bodies. |
| `FooterEditorial` | `external` flag on `FooterLink` (adds target/rel); optional labeled `columns` prop; sitemap + back-to-top raised 14px->16px; back-to-top `whitespace-nowrap`. | Every landing footer; safer external links + labeled-column footers + 16px floor. |

## Not using from ui-kit (explicit opt-outs)
- `NavSticky` (contract suggested it): opted out. Its composition assumes a
  `LogoWave` `~` split, a single pill CTA, a hardcoded cream rest background, and
  a hide-on-scroll floating CTA. Tracer needs a squiggle mark, a transparent rest
  state over the dark hero with light-to-ink theme inversion, and two CTAs
  (ghost Sign in + solid red Download). Built bespoke `Nav` instead; see DECISIONS.
- `EyebrowLabel`: banned on this project (no eyebrow chips). Not used anywhere.
