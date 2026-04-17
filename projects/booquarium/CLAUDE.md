# booquarium — Project Rules

Inherits from global `Aisoldier/CLAUDE.md`. Project-specific overrides only.

## Audience
- **Who:** Book authors (debut novelists, mid-list, non-fiction) launching their books
- **Industry:** Publishing / self-publishing / Etsy template market
- **Tone:** Literary-editorial. Warm, confident, quietly proud. Paris Review, not Webflow marketplace.

## Accent
- **Hex:** `#B8322C`
- **Hover:** `#961F1A`
- **Subtle:** `rgba(184, 50, 44, 0.08)`
- **Why:** Ink Crimson — literary, editorial, wins on Etsy thumbnails against wall of beige competitors.

## Theme
- **Default:** Light (white bg `#ffffff`)
- **Reason:** User specified white background. Clean, editorial, book-page feel.

## Stop-words
- No "users", "conversions", "CTA", "funnel", "content", "product", "SaaS", "platform"
- No "Get started for free" — use "Read the first chapter" or "Pre-order now"
- No startup lexicon of any kind

## Chapter-numbered nav
- Nav links use two-digit chapter numbers: `01 Books`, `02 About`, `03 Praise`, `04 Contact`

## Stack overrides
- React Three Fiber + @react-three/drei enabled for 3D Book Hero (explicitly requested)
- Flag in HANDOFF.md as "custom embed required — R3F canvas"

## Key sections (Phase 1)
0. Nav (chapter-numbered)
1. Hero — 3D Book + scroll-pinned compression
2. About the author
3. Book features / what's inside (sticky feature list)
4. Praise / blurb wall
5. Newsletter CTA
6. Footer editorial
