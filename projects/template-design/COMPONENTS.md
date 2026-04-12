# template-design — Components

Track which kit components are used and any local additions. Every local addition must be evaluated for promotion to `ui-kit/` at session end.

## Used from ui-kit
| Component | Used in section | Notes |
|---|---|---|
| `Inspector` | root layout (dev only) | Cmd+click overlay. Imported from `@kit/components/devtools/Inspector`. |
| `NavSticky` | Section 0 (Nav) | Built directly in the kit (session 2). Project wrapper `src/components/sections/Nav.tsx` feeds copy + overrides `dataSource`. |
| `EyebrowLabel` | Section 1 (Hero — "Wealth Advisory" pill) | Promoted to kit in session 3. Covers the doctrine-sanctioned 12px uppercase. |
| `AvatarStack` | Section 1 (Hero — 4-avatar trust bar) | Promoted to kit in session 3. Handles the 🔴 gap #4 z-order internally via `row-reverse`. |
| `Button` | Section 1 (Hero — primary "Schedule call" + secondary "Get in touch") / Section 3 (`SectionHeader` CTA "Get Started") | Promoted to kit in session 3. `primary` variant is the dark pill with trailing accent dot. |
| `SectionHeader` | Section 3 (Approach) / Section 4 (Services) | Promoted to kit in session 5. `split` variant reuses 501fr/200fr/676fr grid. Accepts `{label,href}` CTA object OR a custom ReactNode. |
| `SectionDivider` | Section 3 (Approach) | Promoted to kit in session 5. 1px hairline. |
| `ImageCard` | Section 4 (Services showcase) / Section 6 (Case Studies) | Promoted to kit in session 6. Reused in session 8 with **zero prop changes, zero overrides** — API passed the reuse test. |
| `ImageCardGrid` | Section 4 (Services showcase) / Section 6 (Case Studies) | Promoted in session 6. Reused in session 8 — Case Studies is composed from two kit-component calls (`SectionHeader` + `ImageCardGrid`) with `caseStudies.cards` passed straight-through from `copy.json`. **API validated.** |
| `cn` util | everywhere | Re-exported through `src/lib/cn.ts`. |
| `motionPresets` / `EASE_OUT` | NavSticky mobile overlay | From `@kit/lib/motion`. |
| `SectionHeader` | /case-studies (stacked), /blog (stacked), /services (stacked) | Reused for all new page headers. Zero prop changes needed. |
| `ImageCardGrid` | /case-studies (cols=2), /blog (cols=2) | Reused for card grids on both index pages. |
| `ImageCard` | /case-studies, /blog (via ImageCardGrid) | Individual cards with href links to detail pages. |
| `Button` | /case-studies/[slug], /blog/[slug], /services | Primary + secondary CTAs on all detail pages. |
| `EyebrowLabel` | /case-studies/[slug] hero, /blog/[slug] date pill | Accent variant on case study hero, default on blog articles. |

## Local additions (pending promotion)
| Component | Path | Why local only for now | Promotion decision |
|---|---|---|---|
| `LenisProvider` | `src/components/providers/LenisProvider.tsx` | Root Lenis wrapper with project-specific duration/easing. Client-only. | **Promote** after Section 2 if no other project needs different options. |
| `Nav` (section wrapper) | `src/components/sections/Nav.tsx` | Thin pass-through that binds `copy.json` to kit `NavSticky`. | **Keep local.** |
| `Hero` (section) | `src/components/sections/Hero.tsx` | Composes `EyebrowLabel` + `Button` + `AvatarStack` + Next `Image` + bespoke `JourneyIndicator` + `CarouselCard`. Section composition is always project-owned. | **Keep local.** |
| `About` (section) | `src/components/sections/About.tsx` | 2-col paragraph block, reuses the `501fr 200fr 676fr` grid from Hero. Only consumes `EyebrowLabel` from the kit + project `copy.json`. | **Keep local.** |
| `Approach` (section) | `src/components/sections/Approach.tsx` | Composes `SectionHeader` (split) + `SectionDivider` + local `ApproachCards` 5-col grid. Mobile collapses to 1-col below 640, 3-col from 768, 5-col from 1024. | **Keep local.** |
| `Services` (section) | `src/components/sections/Services.tsx` | Composes `SectionHeader` (split) + `ImageCardGrid` `cols={2}` with 6 placeholder cards. Content is studio-authored wealth services, photography is Unsplash placeholder. | **Keep local.** |
| `ServicesList` (section) + local `ServiceListRow` | `src/components/sections/ServicesList.tsx` | 4 full-width rows of engagement types. Pattern only used here — no promotion. | **Keep local.** |
| `CaseStudies` (section) | `src/components/sections/CaseStudies.tsx` | Composed entirely from `SectionHeader` + `ImageCardGrid` — zero bespoke sub-components. `copy.json caseStudies.cards` passed straight-through. Canonical "thin shell" section. | **Keep local.** |
| `Banner` (section) | `src/components/sections/Banner.tsx` | Full-bleed `--color-accent` block with a single H0 serif statement. Single-use. | **Keep local.** |
| `Testimonials` (section) + local `TestimonialGrid` / `TestimonialCard` / `StatsRow` / `StarIcon` | `src/components/sections/Testimonials.tsx` | 3-col auto-rows grid + row-4 orphan + stats row. `SectionHeader.cta` passed custom ReactNode. CDP-verified row equalization. | **Keep local.** |
| `Process` (section) + local `ProcessSteps` / `ProcessStep` | `src/components/sections/Process.tsx` | 4-step horizontal timeline. Each step: pill label + connector row with 56×56 circle in 68×68 accent halo + description. Fixes 🔴 gap #6 (overflow-visible + absolute translate) and 🟠 gap #9 (items-center, no fractional px). CDP-verified. | **Keep local.** |
| `FAQ` (section) + local `FAQAccordion` / `FAQItem` / `ChevronToggle` | `src/components/sections/FAQ.tsx` | Single-open accordion with Framer Motion height animation, narrow editorial column. CDP-verified. | **Keep local.** |
| `Contact` (section) + local `ContactLead` / `ContactForm` | `src/components/sections/Contact.tsx` | First dark section. Wraps in `DARK_SCOPE` inline style. Form via react-hook-form + zod + server action. CDP-verified. | **Keep local.** |
| `FooterEditorial` (section) + local `DotRow` / `SocialRow` / `SocialIcon` | `src/components/sections/FooterEditorial.tsx` | Last section. Reuses shared `DARK_SCOPE` from `src/lib/darkScope.ts`. 3-row layout: logo+tagline / sitemap, decorative 8-dot row (index 2 in accent) + hairline divider, socials + legal + copyright. Inline SVG socials (LinkedIn / WhatsApp / Instagram / Facebook) — no icon library. 🔴 SEC fix `your interests` and 🟠 brand fix `3mpq studio` consumed verbatim from `copy.json`. CDP-verified at runtime. | **Keep local.** |
| `ApproachCards` (local grid) | same file, sub-component | 5-value-pillar grid with 1px hairline borders between cards. The `bg-[border] gap-px` trick keeps the layout responsive without nth-child hacks. | **Promote to kit as `HairlineCardGrid` if a second section reuses the pattern.** Candidates: Section 5 services list (4 rows, same trick), Section 8 stats row. |
| `JourneyIndicator` (inside Hero) | same file, sub-component | 2-marker decorative horizontal timeline from Hero. Only appears in the Hero — not worth promoting yet. | **Promote if a second project or section needs it.** |
| `CarouselCard` (inside Hero) | same file, sub-component | Editorial link-card with circular arrow button. Similar card styling will reappear in Section 6 (case studies). | **Promote to kit as `LinkCard` when Section 6 lands** — that's the canonical second use. |

## Promoted to ui-kit this session
| Component | Path | Rationale |
|---|---|---|
| `NavSticky` | `ui-kit/components/nav/NavSticky.tsx` | Sticky nav with scroll-linked background, pill CTA, mobile burger + overlay. Session 2. |
| `EyebrowLabel` | `ui-kit/components/section/EyebrowLabel.tsx` | 12px uppercase pill. The only sanctioned 12px element in the kit. Session 3. |
| `Button` | `ui-kit/components/ui/Button.tsx` | Primary dark pill with trailing accent dot + secondary ghost + ghost variant. `href` → anchor, otherwise button. Session 3. |
| `AvatarStack` | `ui-kit/components/section/AvatarStack.tsx` | Overlapping circular avatars with correct z-order via `row-reverse` (fixes FIGMA_SPEC 🔴 gap #4). Session 3. |
| `LogoWave` | `ui-kit/components/brand/LogoWave.tsx` | `Template ~ Design` wordmark with accent wave glyph. Extracted from `NavSticky` after hitting a second use in `FooterEditorial`. Session 14. |
| `SectionHeader` | `ui-kit/components/section/SectionHeader.tsx` | Standard section header (eyebrow + H3 [+ right body + right CTA]). `align: "split" \| "stacked"`. Reuses the 501/200/676 grid in split mode. Session 5. |
| `SectionDivider` | `ui-kit/components/section/SectionDivider.tsx` | Named 1px hairline. Session 5. |
| `ImageCard` | `ui-kit/components/section/ImageCard.tsx` | Editorial full-bleed photo card. Gradient overlay + bottom-anchored content. `aspectRatio` defaults to 676/456. Session 6. |
| `ImageCardGrid` | `ui-kit/components/section/ImageCardGrid.tsx` | Responsive photo-card grid wrapper. `cols: 2 \| 3`. Session 6. |

## Not using from ui-kit (explicit opt-outs)
_None yet._

