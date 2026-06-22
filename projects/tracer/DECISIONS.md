# Tracer — Decision Log

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
