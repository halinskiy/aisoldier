# tracer — Project Rules

Inherits from the global `Aisoldier/CLAUDE.md`. Project-specific overrides only.

## Project identity
- **Product:** Tracer by NoCorny — a free, open-source (MIT) macOS screen recorder. Hit record, the video uploads to the user's OWN Dropbox (never NoCorny servers), and you get an instantly shareable clean link like `tracer.nocorny.com/v/k7r2-mx9p`. Viewers need no account. macOS-only, ~12MB, made by NoCorny Agency in Kyiv. The Loom alternative for people who want to own their footage.
- **Source of truth for facts:** `REDESIGN_BRIEF.md` §1 (feature set). Factcheck against it; invent nothing.

## Audience
- **Who:** developers, designers, indie hackers, OSS/privacy-minded prosumers, async-remote teams who resent "renting" recordings.
- **Tone:** confident, plain, technical-but-warm. No hype, no filler.

## Accent
- **Hex:** `#e5484d` (record red — the colour of the record dot).
- **Hover:** `#cc3b42`. **Deep:** `#a32a30`. **Subtle:** `rgba(229,72,77,0.08)`. **Soft:** `rgba(229,72,77,0.16)`.
- **Why this color:** the red record dot is the product's one true motif (it IS a recorder). One accent only; the old purple gradient system is killed.

## Theme
- **Default:** light page base (doctrine), with a **cinematic dark hero "studio" stage** and a light -> dark -> light section rhythm.
- **Reason:** a recorder/video product reads as cinematic on a dark stage (like a screen recording in a dark editor); keeping the page base light honours the doctrine and keeps the dark moments dramatic.

## Stop-words and constraints
- No purple, no second brand hue, no gradient text/buttons.
- No em/en dashes or bullets in prose. ASCII only. Hyphens between words banned in prose (real identifiers exempt).
- No eyebrow/kicker chips above headings. No emoji. No hedge copy ("a quiet little...", "made with love").
- Every text >= 16px. Max two font families: **Geist** (display/headings) + **Hanken Grotesk** (body), with **Geist Mono** for link/path strings ONLY (same Geist type system). Verified by scout (research/TRENDS.md), beats the doctrine Montserrat+Manrope default for this dev-tool audience. No raw hex outside `tokens.css`.
- One focal point per screen. Borders on every surface. AirBnB soft-spring motion, plays once then rests.

## Desktop-only mandate
- **All creative effort goes to the 1440px desktop experience.** The MAX WOW interactive/morphing hero (record -> your Dropbox -> share-link) is the centerpiece.
- **Mobile is a DELIBERATE MINIMAL STUB:** one screen (logo, one line, "Download for macOS"). Do NOT build a real responsive mobile layout or run the hero animation on mobile. Verify `document.body.scrollWidth === clientWidth` at 500px (no overflow).

## Stack overrides
- Kit consumed via `@ui-kit/*` path alias (tsconfig) + webpack alias + Tailwind v4 `@source`. Lenis enabled (smooth scroll). Framer Motion 12 for the hero choreography; note any custom embeds in `HANDOFF.md`.
