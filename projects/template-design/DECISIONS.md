# template-design — Decision Log

All 5 open questions from `FIGMA_SPEC.md` were answered in a previous session without the user present (the user said "можно работать, если что потом доработаем"). Every decision below has an **Alternatives** line so the user can reverse any single one without unwinding the whole project.

---

## 2026-04-11 — Figma symbol drill-down strategy
**Decision:** describe the 5 remaining symbols (Header, Section 4, Section 7, CTA, Footer) from visual inference + Style Guide screenshot evidence, without additional Figma MCP calls.
**Alternatives considered:** drill down on each symbol via `get_design_context` — blocked by the Figma MCP Starter plan rate limit, which was hit mid-session.
**Why:** Header and Footer are clearly visible in the Style Guide screenshot (HIGH confidence). Section 4 (services showcase), 7 (mid-page statement banner), and 11 (contact form) are inferred from the compressed full-Home screenshot + standard wealth-management landing patterns (MEDIUM confidence). Every inference is explicitly flagged in `FIGMA_SPEC.md`.
**Consequences:** first pass of Sections 4 and 7 may need visual adjustment after the Webflow developer or user compares against the real Figma. Inspector overlay makes this easy to correct.

## 2026-04-11 — Placeholder copy strategy (hybrid)
**Decision:** replace only the **obviously broken** Webflow template placeholders with credible wealth-management copy. Leave the rest of the Figma's copy as-is with a flag in `HANDOFF.md` for client rewrite.
**Alternatives considered:** (a) ship with Figma copy 1:1 — rejected because "Webflow Template" as a brand label is embarrassing; (b) rewrite every word — rejected because doctrine says "no unbounded scope creep, the designer already made narrative decisions".
**Why:** gets the landing to a professional-looking state without overstepping — the firm still decides final voice. Critical fixes only.
**Specific changes:**
- Hero eyebrow: "Webflow Template" → **"Wealth Advisory"**
- Hero primary CTA: "Get Template" → **"Schedule call"**
- Hero secondary CTA: keep "Get in touch"
- Hero typo: "yours capital" → **"your capital"**
- Section 8 eyebrow: "Services" → **"Testimonials"**
- All 10 testimonial roles "Co-Founder @ Company" → keep as-is and flag in `HANDOFF.md` (client replaces with real roles)
- Footer "Made by Webflow" → **"Made by 3mpq studio"** (can revert if client wants a different credit)
**Consequences:** the client will need to write real copy for: most FAQ answers, testimonial roles, any "Get Started" CTAs that should go somewhere specific.

## 2026-04-11 — "12% annual returns" compliance stat swap
**Decision:** replace the "12% / Average annual returns" stat in Section 8 with **"400+ / Families served"**.
**Alternatives considered:** (a) keep 12% with full SEC-compliant disclaimers in fine print — rejected because even with disclaimers, a specific return number in a hero stat is legal-risk territory; (b) strip the entire stat block to 3 items — rejected because the 4-column grid is part of the visual rhythm.
**Why:** "400+ families served" is compliance-neutral, is already referenced in the firm's copy ("over 400 families and institutions" from the About-section paragraph), and visually sits the same size as "500+ / $3.2B+ / 18 years".
**Consequences:** the final 4 stats become: 500+ / $3.2B+ / 18 years / 400+. All defensible.

## 2026-04-11 — Footer "our interests" legal typo fix
**Decision:** fix "All recommendations prioritize **our** interests" to "All recommendations prioritize **your** interests" in the footer legal small print.
**Alternatives considered:** none — this is a literal regulatory disaster that would get the firm sued if shipped.
**Why:** SEC fiduciary standard mandates client-first. The existing copy says the opposite.
**Consequences:** if the real firm actually wanted this phrasing (e.g., "our" = "our partner's", or some other reading), they can push back. Flagged 🔴 CRITICAL in `HANDOFF.md`.

## 2026-04-11 — Hero journey indicator with 2 markers
**Decision:** keep the 2 markers (from → to) and frame it as an intentional "Our Solution → Increase Royalty" decorative indicator. No third marker added.
**Alternatives considered:** (a) add a 3rd marker with invented label — rejected because we don't know the firm's actual 3-step pitch; (b) remove the indicator entirely — rejected because the designer chose to put it there and it gives the hero a secondary visual interest beat.
**Why:** 2-marker arrows with editorial labels are a valid pattern (seen on multiple Awwwards landings in the research catalog). Making it look intentional is cheaper than inventing a fake 3rd step.
**Consequences:** implementation draws a single horizontal line with 2 dots, small eyebrow labels underneath each dot, accent-colored line segment connecting them. On mobile, this becomes a vertical mini-diagram.

## 2026-04-11 — Accent color confirmed
**Decision:** project accent is **`#FF512A`** (warm orange-red), hover `#E63D17`, subtle `rgba(255, 81, 42, 0.08)`.
**Alternatives considered:** kit default `#0f62fe` (IBM Blue) — rejected because the Figma Style Guide variables explicitly define `#FF512A` and the entire page is designed around warm tones.
**Why:** sourced directly from the Figma Style Guide `Accent` variable.
**Consequences:** the warm cream background `#F8F7F1` + orange accent combo is locked. Any component using the accent (buttons, eyebrows, focus rings, active states, link hovers) inherits `var(--color-accent)` and will pick up this value.

## 2026-04-11 — Neutral palette: warm override
**Decision:** override the kit's cold neutral palette with warm tones throughout the project. Implementation in `projects/template-design/tokens.css`.
**Alternatives considered:** use kit's cold whites — rejected because it clashes visually with the warm cream `#F8F7F1` page background.
**Why:** Figma Style Guide variables define `Background: #F8F7F1`, `Light: #EFEDE7`, `Dark: #212121`. Warm neutrals are the project's identity.
**Consequences:** all derived tokens (surface-2, border, text-muted, text-subtle) were derived from the warm base. Documented in `DESIGN_SYSTEM.md`.

## 2026-04-11 — Testimonial card grid: auto-rows
**Decision:** implement testimonial grid as `grid grid-cols-3 gap-6 auto-rows-[minmax(400px,auto)]` so cards in the same row share a common height determined by the tallest card.
**Alternatives considered:** fixed 400px card height as in Figma — rejected because quotes vary 48→227 px of text and short cards have embarrassing empty gaps while long cards would clip.
**Why:** matches what the designer probably meant (consistent visual rhythm per row, flexible content).
**Consequences:** row heights may grow slightly beyond 400. Acceptable.

## 2026-04-11 — Trailing orphan testimonial (row 4)
**Decision:** show 10 testimonials. Row 4 has one card (Zara Payne) left-aligned with cols 2 and 3 empty.
**Alternatives considered:** (a) add 2 fake testimonials — rejected, dishonest; (b) center-align Zara — rejected, asymmetry is stronger.
**Why:** editorial "trailing orphan" is a recognized pattern in magazine layouts and modern landing design.
**Consequences:** mobile collapses to 1-col and the orphan issue disappears.

## 2026-04-11 — Mobile nav burger (not designed in Figma)
**Decision:** implementation adds a mobile burger menu not present in the Figma. Triggered at <768 viewport.
**Alternatives considered:** ship without mobile nav — rejected, the landing must be fully responsive per the user's explicit requirement.
**Why:** the designer only delivered 1440 desktop. A mobile burger is the standard response.
**Consequences:** new component `NavMobileOverlay` will be built in the project folder, promoted to `ui-kit/` after validation.

## 2026-04-11 — Stack: Next.js 15 + Tailwind v4 + Framer Motion + Lenis (no Rive)
**Decision:** stick to the default Aisoldier stack. No Rive for this project.
**Alternatives considered:** Rive for hero — rejected because Figma contains no complex motion spec, just scroll reveals and a nav scroll state.
**Why:** Rive would require custom embed in Webflow, adds complexity for no visible benefit.
**Consequences:** all motion is pure Framer Motion + Lenis. Webflow handoff is cleaner.

## 2026-04-12 — Motion pass: CSS-driven + IntersectionObserver + kit primitives
**Decision:** motion pass implemented via a hybrid approach:
- **Global `MotionProvider`** (`src/components/providers/MotionProvider.tsx`) — single client component mounted in root layout. Scans the DOM for `[data-motion="blur-reveal"]` / `[data-motion="line-draw"]` targets, initialises state to `"initial"`, observes via IntersectionObserver, flips to `"visible"` on enter with per-element stagger based on `data-motion-index`.
- **CSS transitions** in `globals.css` — `[data-motion-state="initial"]` is hidden, `[data-motion-state="visible"]` has the resting state with a `600ms cubic-bezier(0.16, 1, 0.3, 1)` transition. Zero JavaScript per element, one observer per page.
- **Kit `BlurReveal`** — convenience wrapper that uses `framer-motion useInView` for cases where you want explicit stagger control via `delay` prop. Self-managed animation; does NOT set `data-motion="blur-reveal"` attribute to avoid double-observation.
- **Kit `SplitText`** — word-by-word reveal using `framer-motion` + `useInView`. Respects `prefers-reduced-motion`. Used in About section.
- **Local inline ScrollPin / LineDraw / CountUp** — specialised effects kept in their sections. `LineDraw` uses the same observer pattern (`data-motion="line-draw"`, CSS `transform: scaleX(0 → 1)`). `CountUp` uses `IntersectionObserver + requestAnimationFrame` — no animation library.
- **Magnetic button** — `magnetic` prop on the kit `Button` component. Opt-in per usage. Applied to Hero primary CTA and Contact submit.
**Alternatives considered:**
- All-framer-motion approach — rejected. Wrapping every reveal target in a `<motion.div>` ships a lot of JS per element and re-runs on every render.
- Tailwind-only animations — rejected. Tailwind doesn't have "reveal on enter" utilities; would need custom CSS anyway.
**Why:**
- **Bundle-efficient:** the bulk of reveals use zero JS per element — one global observer drives all of them via attribute flips.
- **SSR-safe:** initial HTML renders with the final opacity; the observer only adds `data-motion-state` after mount. `?motion=0` URL param lets regression shots render in final state without waiting for animation.
- **Reduced-motion friendly:** one branch in `MotionProvider` sets state to `"reduced"` which shortcuts the CSS to the resting state. `@media (prefers-reduced-motion: reduce)` is the belt-and-suspenders safety net.
- **Kit primitives available** for cases where declarative wrapping is preferred.
**How to apply:** tag elements with `data-motion="blur-reveal"` + optional `data-motion-index={i}`. Global observer handles the rest. For per-word effects use `<SplitText>`. For scroll-linked SVG draws add `data-motion="line-draw"`. For numeric count-ups wrap in the local `CountUp` (Testimonials StatsRow) or `data-count-up` attribute in Webflow (see `embeds/count-up-stats.js`).

## 2026-04-12 — Theme-scope pattern via CSS variable override + kit hardening
**Decision:** sections that need a different theme (e.g. a dark-mode contact section on an otherwise light-mode landing) wrap their content in a `<div style={{ "--color-bg": "...", "--color-text": "...", ... }}>` and inherit the rest through CSS cascade. Kit components must render purely from `var(--color-*)` tokens so they adapt automatically.
**Alternatives considered:**
- Prop drilling `tone="dark"` through every kit component — rejected, pollutes every public API for one project's needs.
- Tailwind `dark:` variant wrapper — rejected, mixes two theming models (`dark:` variant + `var()` tokens) and doesn't compose with already-written utilities.
**Why:** CSS custom-property cascade is the canonical way to scope a theme. If a kit component breaks under a scope override, that's a bug in the kit (hardcoded color), not a limitation of the pattern.
**How to apply:**
- Wrap the section in a plain `<div>` with inline `style` setting all the dark tokens.
- Let everything inside read from `var(--color-*)`.
- Do NOT add a `dark` class, do NOT add tone props to kit components.

## 2026-04-12 — Kit Button hardcoded colors → CSS variables (tech debt fixed)
**Decision:** the kit `Button` primary variant was hardcoded to `bg-[#212121] text-white hover:bg-[#0f0f0f]`. Rewritten to `bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90` so it inverts under a theme scope override.
**Discovery:** found during the Section 11 dark-theme audit. Button primary would have rendered as a near-invisible dark pill on the dark Contact background, because `#212121` is the dark bg itself.
**Also added:** new `variant="accent"` for CTAs that should be the project accent regardless of theme. Used by the Contact form submit button. `accent` variant renders `bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]`.
**Impact on existing screens:**
- Hero primary "Schedule call" — `var(--color-text)` resolves to `#212121` on light bg (same as before), text was `text-white`, now `text-[var(--color-bg)]` which is `#F8F7F1` (cream). Barely perceptible warmer tint, arguably nicer.
- `SectionHeader` CTAs across §3-9 — same resolution, visually identical.
- Hover was `#0f0f0f`, now `opacity-90`. Visually almost identical.
**Remaining tech debt:** `NavSticky.ScheduleCta` and `MobileOverlay` CTA still use hardcoded `bg-[#212121]`. Not fixed this pass because nav is always on light bg and the fix is a cosmetic refactor, not a correctness issue. Flagged in `DECISIONS.md` for a later cleanup pass.

## 2026-04-12 — CDP contract tests for every geometry-closed gap
**Decision:** every "gap X closed" claim that relates to layout geometry, DOM structure, or computed styling must be backed by a CDP `Runtime.evaluate` (or equivalent) assertion embedded in the shoot script, not by "visual inspection on the screenshot".
**Alternatives considered:**
- (a) Visual-only verification — rejected because "cards look the same height" and "cards ARE the same computed height" are different statements. A screenshot can hide a 3px drift that the next viewport exposes. In session 10 we proved Diana/Wendy/Holly shared `400px` computed row height, which is categorically stronger than "rows look equal".
- (b) Jest snapshot tests — rejected because they require a test runner, a test fixture, and don't survive refactors cheaply. CDP assertions live in the same shoot script that's already capturing screenshots, so the check runs on every section without extra infrastructure.
**Why:**
1. Turning visual claims into numerical claims kills an entire class of "looks right, actually isn't" bugs.
2. The shoot script is already stood up and running; embedding a `Runtime.evaluate` call costs 5-15 lines.
3. Future maintainers can run the shoot script and immediately see which gaps were proven vs assumed.
**How to apply:**
- Any time a fix involves computed sizes, positions, z-order, overflow, grid row heights, or layout relationships between multiple elements — add a `Runtime.evaluate` in the shoot script that queries the relevant DOM and logs a dictionary with the measurements.
- The log line must mention the gap number so it's greppable (e.g., `Gap #3 heights: {...}`).
- Record the assertion output in the session `CHANGELOG.md` entry so it survives the shoot script being edited.
- Gaps that are copy-only, content-only, or purely aesthetic are exempt — they can stay visual-verified.
**Consequences:** shoot script grows over time but stays one file. Geometry claims become provable, not rhetorical.

## 2026-04-11 — Motion pass consolidated after static build complete
**Decision:** no scroll-linked animation, split-text reveals, scroll-pinned compression, magnetic hovers, or count-up counters are implemented while building sections 0-12. All motion is deferred to a single dedicated pass after the 13th static section is verified.
**Alternatives considered:**
- (a) Build motion per-section as each one lands — rejected. Holistic motion state (Lenis lerp, sticky triggers, stagger timings) needs the full stack to tune correctly; per-section tuning drifts and accumulates inconsistency.
- (b) Skip motion entirely and hand off to Webflow static — rejected because the Figma brief explicitly references `puchix-studio.webflow.io` for "Анимация появления секций"; motion is part of the deliverable.
**Why:**
1. Lenis smooth-scroll tuning is holistic — easing/duration only feels right when you can scroll the full page, not a single section.
2. Scroll-linked transforms (scroll-pinned hero, marker-line draw, count-up triggers) are easier to debug when the scrollable content exists around them.
3. Verifying static layout first catches geometry bugs that motion would otherwise hide — a broken grid or missing image doesn't get papered over by fade-in.
4. One motion commit is cheaper to code-review than 13 scattered changes.
**How to apply:** every section ships with `data-motion="<preset>"` attributes on the elements that will receive motion in the final pass. This leaves a grep-able trail so the motion pass can find everything in one `rg -n 'data-motion'` query. Presets agreed so far: `split-text-reveal` (Section 2 paragraphs), `blur-reveal` (section enters), `scroll-pin` (Hero), `line-draw` (Section 9 process connectors), `count-up` (Section 8 stats).
**Consequences:** Sections 0 and 1 ship visibly static — this is intentional. If a reviewer sees "static hero, no animation" and thinks it's broken, point them at this ADR.

## 2026-04-11 — Section 7 placeholder copy
**Decision:** use **"Clarity over complexity. Always."** as placeholder copy for the mid-page statement banner (Section 7). Flag for client approval.
**Alternatives considered:** generic stock phrases — rejected.
**Why:** the exact phrase is lifted from the firm's own positioning in the footer tagline, so it is guaranteed on-brand.
**Consequences:** if the client wants a different line, swap it in one place (`projects/template-design/content/copy.json` or inline in the component).

## 2026-04-12 — Dark/colored sections: section background always static, only children animate
**Decision:** on sections with a non-default background color (Contact `#1e1e1e`, Footer `#1e1e1e`, Banner `#FF512A`), the `data-motion="blur-reveal"` attribute must NEVER be placed on the section root element. Only child content elements inside the section should carry blur-reveal.
**Alternatives considered:**
- (a) Keep `data-motion="blur-reveal"` on the section root and add an explicit `background-color` to the `[data-motion-state="initial"]` CSS rule -- rejected because it overcomplicates the CSS layer and couples the motion system to per-section theming knowledge.
- (b) Use a separate CSS class `.bg-static` that forces `opacity: 1 !important` on the background -- rejected because it's a workaround, not a root-cause fix.
**Why:** When `data-motion="blur-reveal"` is on a section root, the CSS sets `opacity: 0` in the `initial` state. For dark sections, this makes the page background color (cream `#F8F7F1`) bleed through, causing a visible "cream flash" as the dark section fades in. Between two adjacent dark sections (Contact and Footer), this creates a jarring light stripe during scroll.
**Rule (added to doctrine):**
- Section root elements with `DARK_SCOPE` or any non-default `backgroundColor` must NOT carry `data-motion`.
- Child content rows/elements should carry `data-motion="blur-reveal"` with staggered indices instead.
- The section's background must be visible from the first paint, with only its content animating in.
**Applied to:**
- Footer (`FooterEditorial.tsx`): removed `data-motion="blur-reveal"` from `<footer>`, added to 3 child rows with `data-motion-index` 0, 1, 2.
- Contact (`Contact.tsx`): was already clean (no `data-motion` on `<section>`).
- Banner (`Banner.tsx`): was already clean.
**Consequences:** Future sections with custom backgrounds must follow this pattern. Inspector overlay still works because `data-component` stays on the root.

## 2026-04-12 — EyebrowLabel flex-item width fix
**Decision:** when `EyebrowLabel` is used as a direct child of a `flex flex-col` container (which has `align-items: stretch` by default), add `className="w-fit self-start"` at the usage site to prevent the pill from stretching to the parent's full width.
**Alternatives considered:**
- (a) Add `w-fit self-start` to the kit EyebrowLabel defaults -- done, but Next.js HMR does not reliably hot-reload symlinked kit files during dev. The usage-site fix is the immediate safety net.
- (b) Wrap every EyebrowLabel usage in a `<div>` or `<span>` -- rejected because it's unnecessary markup pollution. `self-start` on the component itself is the correct CSS fix.
- (c) Change all parent containers from `flex-col` to `flex-col items-start` -- rejected because it would affect all children, not just the eyebrow.
**Why:** In CSS flex layout with `flex-direction: column`, the cross-axis (horizontal) defaults to `stretch`. An `inline-flex` element used as a flex item in this context loses its intrinsic sizing and stretches to the container width. `align-self: flex-start` + `width: fit-content` override this behavior.
**Applied to:** Hero.tsx, About.tsx, Contact.tsx. Kit file also updated (takes effect after next full rebuild or server restart).
