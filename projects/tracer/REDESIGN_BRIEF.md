# REDESIGN_BRIEF — Tracer by NoCorny

Owner: 3mpq-interpreter · Date: 2026-06-22 · Source: live https://tracer.nocorny.com/ (desktop, 1440px)
Hand to: 3mpq-slophunter (audit the existing) + 3mpq-director (set the bar).

---

## 1. What the thing IS (current state, captured)

**Product (ground truth — KEEP all of this true).** Tracer by NoCorny is a free,
open-source (MIT) macOS screen recorder. You hit record with a global hotkey, the
video uploads to YOUR OWN Dropbox (never NoCorny servers), and you get an instantly
shareable clean link like `tracer.nocorny.com/v/k7r2-mx9p`. Viewers need no account.
The web viewer streams from your Dropbox; metadata only lives on NoCorny's side.

**Core angle.** "Stop renting your screen recordings." You own the footage, it is
portable, and access is revocable. The Loom alternative for people who want to own
their data. macOS-only recorder, ~12MB download, made by NoCorny Agency in Kyiv.
No cookies, no trackers.

**Feature set (factual, do not invent beyond this):**
- Free & open source, forever — no paid tier, no "Pro," MIT-licensed app + web.
- Direct Dropbox integration — file lands in `~/Dropbox/Tracer/`, NoCorny never stores video.
- AI-generated titles & descriptions (transcribes audio, small LM; editable; disable-able).
- Searchable auto-captioned transcripts — click a line to jump to that moment.
- One-click sharing — link in clipboard the instant you stop.
- Lightweight viewer analytics — view counts + viewer names, no heatmaps, no tracking pixels.
- No watermarks, ever. Revoke access by disconnecting Dropbox.

**Screenshots (current site):**
- Desktop full page: `projects/tracer/research/current/tracer-current-1440.png`
- Mobile stub width: `projects/tracer/research/current/tracer-current-500.png`
- Raw DOM + copy: `projects/tracer/research/current/index.html`
- Compiled CSS (tokens/fonts): `projects/tracer/research/current/lp.css`

### Current section order (top to bottom)
1. **Header** — logo "NoCorny Tracer" (squiggle-into-dot mark, rendered in purple
   gradient text), nav (How it works · Features · Privacy · FAQ · GitHub), theme
   toggle (light/system/dark), "Sign in", small "Download" button.
2. **Hero** — eyebrow chip "Free · Open source · macOS"; H1 "Screen recordings,
   instantly shareable." (second line in purple gradient); sub paragraph; two CTAs
   ("Download for macOS" purple gradient button + "Star on GitHub" ghost); a small
   trust line ("Free forever · No account needed for viewers · Your videos stay in
   your Dropbox"). Right/below: a **hero stage** = a floating "REC 00:42" recorder
   pill with animated waveform + stop button, sitting over a large mocked video-page
   browser window ("Dashboard redesign — quick walkthrough", author Maksym, 14 views,
   share URL, fake player with play button + progress + controls, and a live
   transcript panel with an active segment highlighted). This is the closest thing
   the current site has to the demonstrative hero — but it is static/decorative, not
   a choreographed record -> Dropbox -> link flow.
3. **How it works** (#how) — eyebrow "How it works"; H2 "Record, save, share.
   That's it."; sub; 3 numbered steps (Hit record / Lands in your Dropbox / Share
   the link) each with a tiny inline visual.
4. **Features** (#features) — eyebrow "Features"; H2 "Built for sharing, not for
   selling."; sub; a 6-card grid (1 hero card + 5): Free & open source; Your Dropbox,
   your files; AI titles & descriptions; Searchable transcripts; One-click shares;
   See who's actually watching.
5. **Privacy** (#privacy) — eyebrow "Your data"; H2 "Your videos. Your Dropbox.
   Your control."; two paragraphs; a 4-item checklist (zero video storage, no
   watermarks, revoke any time, open source); plus a "Your Mac -> Your Dropbox ->
   Viewers" 3-node diagram with a "Notice what's missing? Tracer's video servers —
   because there aren't any" footnote.
6. **FAQ** (#faq) — H2 "Frequently asked questions"; 7-item accordion.
7. **Final CTA** — "Stop renting your screen recordings." + sub + two buttons on a
   purple panel.
8. **Footer** — brand block + manifesto ("A quiet little screen-recorder for people
   who'd rather own their files than rent them"), "Made with love in Kyiv, Ukraine,"
   Product / Open source / Need a custom build? columns, agency contact, bottom bar
   ("© 2026 · MIT licensed · No cookies, no trackers").

### Current visual style (measured, not guessed)
- **Theme:** dark by default (`--bg-primary: #0f0e13`), with a working light/system/dark toggle.
- **Brand color:** a **purple/violet gradient** (`--gradient-start #3e0693 -> #6b00de -> #c084fc`),
  used on the wordmark, H1 second line, primary buttons, and the final CTA panel.
  There is a `--brand-red:#f9423a` token in the palette but it is NOT the brand color today.
- **Fonts:** **PT Sans** (display/heading) + **Mulish** (body). Not the doctrine pairing.
- **Type sizes:** many values BELOW the 16px floor — measured `15px (x2)`, `14px (x10)`,
  `13px (x15)`, `12px (x8)`, `11px (x11)`. Eyebrow chips are ~11px uppercase.
- **Motion:** mostly static; the recorder pill has a waveform/dot pulse and one
  "typing" demo. No scroll choreography, no morphing flow.

---

## 2. The amplified intent (what the user actually wants)

The one-liner is "redesign this, MAX WOW, record-red, cinematic." Amplified into a
concrete brief the orchestra can align on:

> Keep every true thing about Tracer and its single, genuinely strong story
> (record -> it lands in YOUR Dropbox -> share a clean link, and you own it), but
> rebuild the presentation to an Apple/Linear-grade tier: confident, minimal, the
> red record dot as the one central motif, and a **cinematic, interactive hero that
> literally demonstrates the record -> Dropbox -> share-link flow** (morphing scene,
> scroll choreography welcome) instead of the current static mock. The current site
> is competent but reads like a capable-template SaaS page (purple gradient, sub-16px
> chips, generic card grid) — not like a top-brand product. Remove the slop, raise
> the type, and make the hero the thing people screenshot.

**The current site is NOT:** premium, cinematic, or owned by a single bold motif. It
is a tasteful-but-generic dark SaaS template: gradient wordmark, gradient buttons,
eyebrow chips, a 6-card feature grid, and lots of small (sub-16px) supporting text.
Good bones, generic skin.

---

## 3. KEEP (must survive the redesign)

- **Brand & identity:** name "NoCorny Tracer," the squiggle-into-dot logo mark, the
  Kyiv / NoCorny Agency authorship, the agency contact in the footer.
- **The product truth (every fact in §1):** Dropbox-owned storage, MIT/free-forever,
  AI titles, searchable transcripts, one-click share, lightweight analytics, no
  watermarks, revocable, macOS-only recorder, ~12MB, no cookies/trackers, viewers
  need no account. Factcheck against this.
- **The one strong story / flow:** record -> lands in YOUR Dropbox -> share a clean
  `tracer.nocorny.com/v/...` link. This is the spine of both hero and "How it works."
- **The positioning line:** "Stop renting your screen recordings" / own-your-footage.
- **Real working links:** GitHub repo/issues/license/releases, /download, /dashboard
  (Sign in), agency email + site, /privacy, /terms.
- **The example link format** `tracer.nocorny.com/v/k7r2-mx9p` (it sells the payoff).
- **Light + dark capability** (toggle is a nice-to-keep; dark is the natural cinematic
  default for this product — confirm theme default with director).
- **Section coverage:** hero, how-it-works, features, privacy/ownership story, FAQ,
  final CTA, footer. The redesign re-skins and tightens these; it does not delete the
  story beats.

## 4. KILL (weak / generic / slop in the current site)

- **The purple/violet gradient brand system** — replace wholesale with the confirmed
  **record-red (#E5484D family)** accent and the red record dot as the single motif.
  Kill `gradient-text` wordmarks and gradient-fill buttons (multi-stop gradient text
  is an AI/template tell).
- **Sub-16px type, everywhere** — the 11/12/13/14/15px chips, captions, meta, and
  trust lines all violate the floor. Raise everything to >=16px; cut what only exists
  as small print.
- **Eyebrow / kicker chips** above every heading ("Free · Open source · macOS",
  "How it works", "Features", "Your data", "FAQ") — captions are banned by doctrine.
  Let the headings carry it.
- **PT Sans + Mulish** — swap to the verified current pairing (director/scout to set;
  doctrine default Montserrat + Manrope unless something better is scouted).
- **The static, decorative hero mock** — it shows a finished video page but never
  demonstrates the flow. Replace with the cinematic, interactive, morphing
  record -> Dropbox -> link scene (the whole point of MAX WOW).
- **Generic 6-card feature grid** — the "1 hero card + 5 equal cards" pattern is the
  default SaaS look. Re-think as fewer, bolder, more uniform statements (per director's
  minimum-text rule); strip any card that is filler.
- **Filler / hedge copy and emoji** — "❤️ Made with love in Kyiv 🇺🇦," "A quiet little
  screen-recorder," "Built for sharing, not for selling," cutesy footnotes, and any
  em/en dashes in prose (the current copy uses them, e.g. "screen-recorder — quick
  walkthrough"). Naturalist + copywriter pass; ASCII only, no dashes/bullets in prose.
- **Competing focal points in the hero** — recorder pill + full video page + transcript
  panel all at once. One focal point per screen.
- **Real responsive mobile** — explicitly NOT wanted (see constraints).

---

## 5. Target feel

Apple/Linear-grade product page: confident, minimal, nothing superfluous. **One motif:
the red record dot** — it is the logo accent, the CTA color, the "live" pulse, and the
through-line of the hero animation. Cinematic and dark-leaning (the recorder/video
context wants a dark stage), with generous air and genuinely big display type. The hero
is an interactive, morphing scene that performs the product's one promise: you press
record (red dot), the capture flies into YOUR Dropbox, and a clean shareable link
materializes — scroll choreography welcome. Everything morphs (AirBnB soft-spring), no
flat fades, plays once then rests. The bar: getcorder-grade. The opposite of the current
purple-gradient template look.

## 6. Constraints (hard)

- **Accent: record-red, #E5484D family. ONE accent color.** No purple, no second brand hue.
- **DESKTOP ONLY.** All creative effort goes to the 1440px desktop experience. Mobile is
  a DELIBERATE MINIMAL STUB — one screen: logo, one line, "Download for macOS." Do NOT
  design a real responsive mobile experience; do not spend the hero animation on mobile.
- **MAX WOW hero** is the centerpiece: interactive/morphing scene demonstrating
  record -> Dropbox -> share-link; scroll choreography allowed; Rive/Framer permitted for
  the hero (note custom embeds in HANDOFF.md).
- **Doctrine floors:** >=16px everywhere, max two font families, no eyebrow/kicker
  captions, no em/en dashes or bullets in prose, no raw hex outside the token layer, one
  focal point per screen, AirBnB motion, borders on surfaces, Lenis smooth scroll.
- **Factual integrity:** every claim must match §1. No invented features, counts, or specs.

## 7. Success criteria (how we know it is done)

1. **Slop scorecard CLEAN** — `tools/slop-scan.mjs` and `tools/ds-lint.mjs` green: zero
   sub-16px text, <=2 font families, no banned glyphs/dashes/bullets, no raw hex outside tokens.
2. **One motif, one accent** — record-red is the only brand color; the red dot reads as
   the identity across logo, CTA, live state, and hero. Zero purple remains.
3. **The hero demonstrates the flow** — a viewer who watches the hero understands
   record -> own Dropbox -> share-link without reading a word; it is the screenshot-worthy
   moment, interactive and morphing (AirBnB soft-spring, plays once then rests), and it
   holds up at 1440px.
4. **Minimalist budget holds** — sections are heading (+ at most one subheading); feature
   items are terse and uniform; no eyebrow chips, no filler cards, no hedge copy, no emoji.
5. **Every fact intact** — factcheck passes against §1; all real links work; the Loom-alt /
   "own your footage" positioning is unmistakable.
6. **Desktop is the masterpiece; mobile is an honest stub** — desktop is getcorder-grade;
   mobile renders the intentional single-screen stub with no broken layout (verify
   `document.body.scrollWidth === clientWidth` at 500px), and that stub is by design.
7. **The user recognizes their intent** — "premium, cinematic, record-red, MAX WOW hero
   that shows the flow" is visibly delivered, not approximated.
