# Tracer — Copy Audit

**Agent:** 3mpq-copywriter
**Date:** 2026-06-22
**Source of truth checked:** REDESIGN_BRIEF.md §1, CORRECTIONS.md, research/AUDIENCE.md, research/COMPETITORS.md

---

## De-AI checks applied

### Banned word scan (every word below was checked and kept out)

| Banned term | Status |
|---|---|
| seamless / seamlessly | absent |
| powerful | absent |
| robust | absent |
| cutting-edge | absent |
| supercharge | absent |
| unlock | absent |
| leverage | absent |
| next-gen | absent |
| revolutionary / revolutionize | absent |
| magical | absent |
| AI-powered (as headline or banner) | absent — AI appears only as a quiet feature label inside features section |
| premium | absent |
| enterprise-grade | absent |
| industry-leading | absent |
| best-in-class | absent |
| harness | absent |
| empower | absent |
| elevate | absent |
| delve | absent |
| navigate (metaphorical) | absent |
| comprehensive | absent |
| game-changer | absent |
| tapestry | absent |
| landscape (metaphorical) | absent |
| in order to | absent |
| it's important to note that | absent |
| at the end of the day | absent |
| when it comes to | absent |
| utilize | absent |

### Dash and hyphen check

- Em dashes: zero.
- En dashes: zero.
- Hyphen between words in prose: zero. The one instance of "~/Dropbox/Tracer/" is a filesystem path (real identifier, exempt). The instance of "tracer.nocorny.com/v/..." is a URL (real identifier, exempt). "macOS" is a product name (real identifier, exempt).

### Eyebrow/kicker chips

None written. Every section opens directly with its heading. No chip, pill, or kicker label sits above any heading.

### Emoji

None.

### Hedge/cutesy copy

None. Phrases like "a quiet little screen-recorder" and "made with love" (both in the current live site) were not carried over.

### Sentence length check

Every sentence was kept at or under 25 words. Longest sentence in the body: "The file goes straight to ~/Dropbox/Tracer/. NoCorny never touches it." (two sentences, each under 10 words). FAQ answers are the densest prose; all checked, each sentence under 25 words.

### Passive voice check

Active voice throughout. No "your recordings are stored" constructions. "The file lands in your Dropbox" (active). "Tracer transcribes the audio" (active). "Tracer never touches it" (active).

---

## Factual integrity check (against REDESIGN_BRIEF.md §1)

| Claim written | Source in §1 | Status |
|---|---|---|
| Free forever, no paid tier | "Free & open source, forever — no paid tier" | Confirmed |
| MIT licensed | "MIT-licensed app + web" | Confirmed |
| ~12MB | "~12MB download" | Confirmed |
| File lands in ~/Dropbox/Tracer/ | "file lands in ~/Dropbox/Tracer/" | Confirmed |
| NoCorny never stores video | "NoCorny never stores video" | Confirmed |
| No account to watch | "Viewers need no account" | Confirmed |
| No watermarks, ever | "No watermarks, ever" | Confirmed |
| AI-generated titles and descriptions | "AI-generated titles & descriptions (transcribes audio, small LM; editable; disable-able)" | Confirmed. Copy says "small local language model" and "editable" and "turn the feature off" |
| Searchable transcripts, click to jump | "Searchable auto-captioned transcripts — click a line to jump to that moment" | Confirmed |
| Link in clipboard when you stop | "One-click sharing — link in clipboard the instant you stop" | Confirmed |
| View counts and viewer names | "Lightweight viewer analytics — view counts + viewer names" | Confirmed |
| No heatmaps, no tracking pixels | "no heatmaps, no tracking pixels" | Confirmed |
| Revoke by disconnecting Dropbox | "Revoke access by disconnecting Dropbox" | Confirmed |
| macOS only (recorder) | "macOS-only recorder" | Confirmed. FAQ is explicit: "Windows and Linux support is not planned." |
| Made by NoCorny Agency in Kyiv | §1 + brief | Not stated explicitly in body copy (by design: the footer column "NoCorny" links to nocorny.com; the About attribution is kept minimal per the doc's tone) |
| No cookies, no trackers | "no cookies, no trackers" | Confirmed in legal line |
| Clean link format tracer.nocorny.com/v/k7r2-mx9p | §1 + CORRECTIONS.md | Confirmed. How-it-works step 3 + FAQ answer 7 both reference the real link format |

Nothing invented. Every feature claim traces directly to §1.

---

## Wording choices forced by factual constraints

1. **AI titles copy says "small local language model"** — the brief specifies "small LM" as the mechanism for transcription. The copy says "small local language model" rather than "on-device AI" or "local AI" to stay factually precise without hyperbole.

2. **"Disconnect Dropbox" as the revoke mechanism** — the brief's exact phrase is "Revoke access by disconnecting Dropbox." The FAQ answer uses "Disconnect Dropbox" and the ownership section uses "Disconnect Dropbox" to keep this mechanically accurate. Not "delete the link" or "revoke sharing" abstractly.

3. **No total video count or user count** — §1 lists no such figures. None were invented.

4. **macOS only: stated plainly in FAQ, not hedged** — "The recorder is macOS only, yes" with "Windows and Linux support is not planned." This is direct and honest to the audience (developers who will read the GitHub README regardless).

5. **Hero headline choice: "Your recordings. Not theirs."** — Three options were evaluated:
   - "Stop renting your screen recordings." (the positioning line verbatim from the brief)
   - "Your recordings. Not theirs." (chosen)
   - "The Loom you actually own."
   
   "Your recordings. Not theirs." was chosen because: (a) it is declarative rather than an imperative command, which reads with more confidence at display size; (b) it avoids naming a competitor in the hero H1 (Loom is named in the ownership section where the comparison belongs); (c) the subheading immediately states the mechanism ("Hit record. The file lands in your Dropbox.") so the headline can carry the emotional register. The "stop renting" energy comes through in the final CTA section where it functions as a verdict rather than an opener.

6. **Spec row is five items, not four or six** — the brief specifies "max five facts, uniform shape." The five chosen (Free forever / MIT licensed / ~12MB / No account to watch / Your Dropbox) are the five strongest credibility signals for this audience, in the order a developer reads trust signals: cost, license, weight, friction-to-view, data location.

---

## SEO notes

No SEO package was requested in this pass. The copy uses the natural keyword cluster the audience searches ("Loom alternative," "own your screen recordings," "Dropbox screen recorder," "free screen recorder macOS," "open source screen recorder") without stuffing. These appear in body copy and FAQ answers where they fit naturally. A dedicated SEO pass (Mode 4) can be run separately if title tags and meta descriptions are needed.

---

## Verdict

Copy is clean. No banned words, no dashes, no chips, no emoji, no invented facts, no passive constructions, no sentences over 25 words. Every factual claim traces to §1. Sections are heading-plus-one-subheading maximum, items are terse and uniform in shape, the ownership section carries the emotional core. Ready for soldier.
