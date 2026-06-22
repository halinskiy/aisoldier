# REDESIGN_V2_BRIEF — Tracer, creative escalation (user feedback 2026-06-22)

The v1 redesign passed the ship-gate, but after seeing it live the user wants the WHOLE page raised to the hero's ambition. This is a premium "more wow" round. Keep all v1 facts, copy truth, accent (#E5484D), fonts (Geist/Hanken), desktop-only mandate, and the passing gates. Level up the design.

## User feedback (verbatim intent)

1. **Hero — concept liked, animation needs work.**
   - The morph reads "странноватая" (odd): it is not obvious you must WAIT for it to play. Make it more ACTIVE / alive / energetic so it reads as motion immediately, not a thing that looks half-static until it finishes.
   - Elements must NOT shrink into "too small objects." Keep every beat at a confident, legible size; the capture/pills should not become tiny.
   - Net: same flow (record -> your Dropbox -> share link), but punchier, livelier, clearer, bigger. The user should be entertained and immediately understand it is animating.

2. **Grid consistency across ALL sections.**
   - One grid system, full-bleed. If the page is full-width, EVERY section is full-width on the same grid.
   - FAQ is the offender: it currently reads centered/narrow while other sections are full-width. Unify it (and any other narrow section) to the full-width grid. No section floats centered while neighbours go edge to edge.

3. **Sections are too boring — add creativity, elegance, wow.**
   - More morphs. More "wandering" elements that morph seamlessly and smoothly (floating/drifting objects with soft continuous morphs, AirBnB-style, tasteful not gimmicky).
   - Entertain the user as they scroll. Every section should have a designed, alive moment, not a static text block + list.
   - Elegance is the bar, not noise: seamless, smooth, premium morphs. Still one accent, still >=16px, still no slop.

4. **CTA section — the biggest miss, redesign it fully.**
   - Right now it is "just changed the background color and dropped centered text." Unacceptable.
   - Want a genuinely DESIGNED, beautiful CTA block: an enticing, creative composition that pulls the user to download. A real moment, with its own morph/wandering-element treatment, not a recolored band.

## Hard constraints (unchanged from v1)
- One accent #E5484D (record red), the red dot motif. No purple, no second hue, no gradient text/buttons.
- Geist (display) + Hanken (body) + Geist Mono (links/paths). All text >=16px. No eyebrow chips, no dashes/bullets in prose, no emoji.
- Desktop 1440px is the masterpiece; mobile stays the single-screen stub.
- Motion: AirBnB soft-spring, seamless morphs, plays then rests (the wandering ambient elements MAY drift continuously if tasteful and subtle, but content morphs play once then rest). Respect prefers-reduced-motion + ?motion=0 (static, composed, legible).
- Reuse/extend the kit; promote new reusable morph primitives.

## Success criteria
- Every section feels designed and alive, on the hero's level, not a list on a recolored band.
- One consistent full-width grid; nothing floats centered while neighbours are edge-to-edge.
- The hero animation reads as active and clear immediately; no beat shrinks to a tiny object.
- The final CTA is a beautiful, creative, enticing designed block (the second screenshot moment after the hero).
- Still CLEAN on all gates (ds-lint, slop-scan), still PASSED by judge/aesthete/slophunter/minimalist, no regression of v1 facts/accent/theme.
