# Tracer — Decision Log

## 2026-06-23 (V3) — Scroll-scrubbed backbone, single page scroll source
**Decision:** Every backbone section is a `useScrubProgress` instance (vh runway
+ sticky stage + one spring). The page owns ONE no-target `useScroll()`
(`useGlobalProgress`) shared by the ScrollDot and the Ownership parallax.
**Why:** the V2 reveal-on-enter model read as "flicker then static text" in the
lived experience (the user's feedback). Binding morphs to scroll progress makes
the wheel scrub the page, which is the actual fix. A single scroll source +
single rAF loop is the anti-jank base (two loops reading stale scrollY 1-2 frames
apart is the classic рвано cause).

## 2026-06-23 (V3) — Promote ScrollDot + useScrubProgress to the kit
**Decision:** The through-dot and the scrub engine are reusable on any scroll-
narrative landing, so they were promoted to `ui-kit/components/motion/
ScrollDot.tsx` and `ui-kit/hooks/useScrubProgress.ts` (registered in INDEX/
REGISTRY/index.ts). The project imports them from `@ui-kit`.

## 2026-06-23 (V3) — Delete TravelingDot; Nav off the window scroll listener
**Decision:** Deleted `TravelingDot.tsx` (it animated `top`, a layout prop) and
moved the Nav backdrop trigger from `window.addEventListener('scroll')` to a
`useLenis` subscription.
**Why:** J4 bans animated layout props; J1/J2 require a single scroll loop with
no manual scroll listener. The transform-only ScrollDot replaces TravelingDot;
the Nav now rides the one Lenis loop.

## 2026-06-23 (V2) — One grid via .grid-page + DarkSection bleed
**Decision:** Defined `.grid-page` once (globals.css) + grid tokens, and added a
`bleed` prop to kit `DarkSection` so dark stages bleed full-viewport while their
content sits on the same `.grid-page` tracks as the light sections.
**Why:** the contract demands every section content edge align at 1440px. A
shared container is the only honest way; per-section max-widths were the v1 sin.
Extending DarkSection (rather than forking it) keeps the kit the source of truth.
Verified with the dev GridOverlay: hero/how/features/ownership/faq/cta left
content edges all land on column 1.

## 2026-06-23 (V2) — FAQ two-column split: sequential 4/3
**Decision:** Column A = items 0-3, Column B = items 4-6 (sequential, not
odd/even). **Why:** the longest answers cluster early (Dropbox, Loom); a
sequential split keeps the heavier column on the left where the eye lands first
and reads top to bottom naturally, and the open answer height never makes the
columns feel lopsided since only one is open at a time.

## 2026-06-23 (V2) — CTA layout: Option B (inline row)
**Decision:** Headline cols 1-8; the convergence resolves into an inline row
(Download button + link pill) spanning cols 1-12 below the headline, note line
under it. Chose B over A (composition right cols 7-12) because the convergence IS
the resolution INTO the button+pill row, so the morph and the rest state occupy
the same place. A split would have shown the composition somewhere and then the
button elsewhere, breaking the "the chain becomes the CTA" payoff.

## 2026-06-23 (V2) — No ambient drift on light sections
**Decision:** AmbientDrift only on the three dark stages (Hero, Ownership, CTA);
How-it-works and Features get none. **Why:** the contract makes light-section
drift optional and off-by-default; on How-it-works the scroll-scrubbed dot rail
is the life, and on Features the layout-arrange entrance is. A drift there would
compete and read as the gimmick the brief warns against.

## 2026-06-23 (V2) — AmbientDrift keyframe name via useId
**Decision:** AmbientDrift derives its injected `@keyframes` name from
`useId()`, not a module-level counter. **Why:** the counter incremented
differently on SSR vs client (3 instances), so the injected `<style>` content
mismatched and React regenerated the whole tree on hydration. That broke
`?motion=0` (the regenerated client tree re-ran the morph instead of resting).
`useId` is stable across SSR/client, so no mismatch. Caught by inspecting the
headless console; now zero hydration mismatch on / and /?motion=0.

## 2026-06-23 (V2) — Live morph timeline not captured under virtual-time
**Decision:** Verified the rest states via `?motion=0` screenshots and the live
reveal firing at t+1.2s; documented that Chrome `--virtual-time-budget` freezes
framer-motion mid-flight (leaving the hero blurred/empty in the fast-forwarded
frame) so a clean full-chain live screenshot was not obtainable here. **Why:**
flagged honestly for critic re-verification in a wall-clock browser rather than
claiming a live pass I could not screenshot. The static DOM is correct and v1
shipped the identical BlurReveal, so the risk is low but not self-verified.

## 2026-06-22 (fix round 1) — Kept bespoke Nav; did NOT migrate to NavSticky
**Decision:** Per ACTIONS H, the preferred path was to extend kit `NavSticky`
with `transparentRest` + `secondaryCta` and delete the bespoke `Nav`. After
reading `NavSticky`, I kept the bespoke `Nav` and added only the active-link
state.
**Why:** `NavSticky` hardcodes a light scrim (`rgba(250,249,247,...)`), text
permanently in `--color-text` (ink), a hide-on-scroll-down header + floating
CTA, and a `#212121` raw hex in the mobile overlay. Tracer's nav floats over the
DARK hero at rest and inverts paper->ink only on scroll. Migrating would regress
that color inversion (the documented escape hatch in ACTIONS H: "if migrating
regresses the inversion, KEEP bespoke Nav and document"). Adding a full
over-dark color-state path to a shared component used by other projects is a
large change with cross-project regression risk, out of scope for a Tracer fix
round.
**Consequences:** Nav stays project-local. Added the required active-link
scroll-spy (aria-current + font-semibold + accent underline) to it. A future
kit task can add an `overDark`/`transparentRest` tone to NavSticky deliberately.

## 2026-06-22 (fix round 1) — Hero rest = one composed share-link card
**Decision:** Recomposed `HeroMorphStage` so exactly ONE artifact rests on the
stage: an elevated dark share-link card under the CTA. The Dropbox folder is a
transient (beat 3), not parked at rest.
**Why:** ACTIONS A: the resting frame is the screenshot screen; at rest it must
be one cinematic, composed focal point, not three small disconnected pills on a
760px black void.
**Consequences:** Stage min-height dropped 380->300px, max-width 760->620px;
hero vertical rhythm tightened; the ~160px void is gone.

## 2026-06-22 (fix round 1) — ds-lint kit scope boundary
**Decision:** Cleared every ds-lint ERROR in the kit components Tracer actually
renders (FooterEditorial, StickyFeatureList, SpecStrip, DarkSection,
FAQAccordion, TextLink). Did NOT mass-fix the ~87 pre-existing errors in kit
components Tracer never imports (CmdKSearch, MetricsBar, system docs, Badge,
LogoBelt, etc.).
**Why:** ACTIONS C's verify gap was specifically "sub-16px hiding in the kit
that Tracer uses." The remaining errors (mostly sub-16px by design in
other-project components, plus comment glyphs) predate this work; editing them
would change other projects' visuals with no Tracer benefit and real regression
risk. That is a separate kit-hygiene pass, not this round.
**Consequences:** `ds-lint projects/tracer/src` = 0 errors; all Tracer-consumed
kit components = 0 errors. The full `ui-kit/components` scope still reports the
pre-existing 87 in unrelated files; flagged for a dedicated kit-cleanup task.

## 2026-06-22 — Bespoke Nav instead of kit NavSticky
**Decision:** Built a project-local `Nav` rather than using `NavSticky`.
**Alternatives considered:** `NavSticky` with `logoNode` override.
**Why:** NavSticky hardcodes a cream rest background, a single pill CTA, a
`LogoWave` `~` split, and a hide-on-scroll floating CTA. Tracer needs a
transparent rest state over the DARK hero with a light-to-ink theme inversion on
scroll, the NoCorny squiggle mark, and two CTAs (ghost Sign in + solid red
Download). Forcing NavSticky would have meant a fork.
**Consequences:** Nav is project-local. If the transparent-over-dark-hero pattern
recurs, add a `tone`/`overDark` prop to kit NavSticky instead of re-forking.

## 2026-06-22 — Bespoke dark hero stage instead of DarkSection
**Decision:** Hero uses a project-local dark `<section>` (`.dark-scope
.dot-grid-dark` + `--color-ink-surface`), not the kit `DarkSection`.
**Alternatives considered:** Wrapping the hero in `DarkSection`.
**Why:** The hero needs custom top padding for the floating nav, a centered
headline/morph/CTA composition, and is the page's opening band (not a mid-page
break). DarkSection has fixed inner padding and a `max-w-6xl` shell built for
break bands. Ownership and Final CTA DO use DarkSection (correct fit).
**Consequences:** One bespoke dark band in the hero; the dark scoping classes are
the same kit-contract classes, so theming stays consistent.

## 2026-06-22 — SpecStrip carries both layouts (horizontal + vertical)
**Decision:** One `SpecStrip` component with a `direction` prop, promoted to the
kit. Horizontal = hero credibility row; vertical = ownership truth strip.
**Alternatives considered:** Two components (SpecStrip + a separate TruthRow).
**Why:** Both are "a hairline strip of terse, uniform facts" with shared tone /
border / mono behaviour. A single component with a direction variant is a prop,
not a fork. The contract explicitly allowed extending SpecStrip with a vertical
variant.
**Consequences:** `section.SpecStrip` in the kit handles both; future truth
strips reuse it.

## 2026-06-22 — Kit module resolution via symlink + preserveSymlinks
**Decision:** Symlinked the kit into `node_modules/@aisoldier/ui-kit`, aliased
`@ui-kit` to it, set `transpilePackages` + `resolve.symlinks=false` (webpack) and
`preserveSymlinks:true` (tsconfig).
**Alternatives considered:** The original raw `@ui-kit -> ../../ui-kit` path
alias; adding `resolve.modules`.
**Why:** With the raw external-dir alias, `next build` typechecks the kit files
and cannot resolve their `react`/`framer-motion` imports (the external dir has no
node_modules and tsc canonicalises the symlink away). The symlink-under-
node_modules + preserveSymlinks pattern (proven in template-design) makes kit
deps resolve to THIS project's installs at both compile and typecheck time.
**Consequences:** `npm run build` passes clean. The symlink must exist; documented
in HANDOFF.

## 2026-06-22 — How-it-works runway kept compact
**Decision:** `StickyFeatureList` with no `itemMinHeight` override (kit default).
**Alternatives considered:** `itemMinHeight="56vh"` / `"34vh"`.
**Why:** Large per-item min-heights stretched the sticky runway into multi-
viewport empty voids between the three short steps. The kit's natural `py-10`
rhythm keeps the steps compact while still pinning the visual.
**Consequences:** The section reads as a tight Apple-style scroll, not a void.
