# Template-Design — Project Rules

Inherits from `~/Aisoldier/CLAUDE.md`. Project-specific overrides only.

## Project identity
- **Positioning (from footer copy):** "Strategic wealth management for investors who value clarity over complexity. Fiduciary-first approach, transparent execution, results that matter."
- **Vertical:** SEC-regulated wealth management / fiduciary advisory
- **Source:** Figma file `hdriqKesBCNlAVapaGQXO6` — see `FIGMA_SPEC.md`

## Audience
- **Who:** HNW / UHNW individual investors, family offices, institutional allocators evaluating fiduciary wealth managers
- **Industry:** Financial advisory, SEC-regulated
- **Tone:** Editorial, confident, transparent. Not playful. Not aggressive. "Quiet money" voice.

## Accent
- **Hex:** `#FF512A` (warm orange-red)
- **Hover:** `#E63D17`
- **Subtle:** `rgba(255, 81, 42, 0.08)`
- **Why this color:** Designer choice. Warm saturated accent against cream paper — feels editorial and modern-finance (Ramp / Mercury territory) rather than cold-blue-incumbent (Schwab / Fidelity). Gives the firm a challenger identity without losing trust.

## Theme
- **Default:** light with warm palette (`#F8F7F1` bg, NOT pure white)
- **Reason:** Designer chose a warm editorial cream. Matches the "quiet money" voice better than sterile white.

## Stop-words and constraints
- No cold white (`#FFFFFF`) as page background — use `#F8F7F1`.
- No blue accent (avoid incumbent-financial clichés).
- No emojis anywhere.
- No stock-photo "handshake in conference room" imagery.
- No gradients as primary surfaces (they can appear as accents — the Figma has some gradient moments).
- No animated illustrations in the hero — text and photography only.

## Deviations from the global kit
- Accent is `#FF512A`, not `#0f62fe`. Stored in `projects/template-design/tokens.css`.
- Background is warm cream `#F8F7F1`, not pure white. Neutral palette shifts to warm tones.
- Typography uses the designer's Style-guide scale (H0 96 → Label Small 10). Doctrine rule of "min 16px body" is enforced — 10-12px is only allowed for uppercase eyebrow labels.
- H1 line-height is **0.95** (tight stack) per the designer's intent.

## Stack overrides
- Standard: Next.js 15 + Tailwind v4 + Framer Motion + Lenis.
- Rive: not needed — no complex motion in the Figma beyond scroll reveals.
- One extra consideration: the project needs **responsive breakpoints** fully engineered because the designer only delivered desktop 1440. We build mobile/tablet layouts ourselves.

## Designer handoff quality note
The designer delivered **only the 1440 desktop artboard** (plus a 1920 variant and a Style Guide). No tablet, no mobile, no dev-mode annotations. Decimal y-offsets in several section positions indicate sloppy grid-snapping. See `FIGMA_SPEC.md` for the `⚠️ designer gap` flags that need engineering decisions.
