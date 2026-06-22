# Tracer — Audience

**Date:** 2026-06-22
**Status:** Kickoff research (fresh — all prior files were blank templates)

Tracer: free, open-source (MIT), macOS-only screen recorder. Records, uploads to the user's **own Dropbox**, returns an instant shareable link. No viewer account, no watermark, AI titles + searchable auto-captioned transcripts, lightweight viewer analytics, ~12MB, no cookies/trackers. Angle: **"stop renting your screen recordings."**

---

## Primary audience

Four overlapping segments, all macOS, all already-bought into "I'd rather own my stuff than rent it."

### 1. Developers / engineers (the spearhead)
- **Who:** IC engineers, staff/senior devs, OSS maintainers, solo founders who code. Record bug repros, PR walkthroughs, async standups, "here's what I shipped" clips.
- **Why they convert:** MIT licence + ~12MB + "my own Dropbox" reads as *correct engineering*, not marketing. They will read the GitHub repo before the landing's CTA. They distrust SaaS that holds their data hostage.
- **Trigger:** hit Loom's 5-min / 25-video free wall mid-bug-repro; saw the watermark land on a client page; noticed the Atlassian-era lag and failed uploads.

### 2. Designers / product people
- **Who:** product designers, design engineers, PMs recording Figma walkthroughs, feedback, demo loops.
- **Why they convert:** care that the *viewer page* looks clean (no Loom branding bar, no "sign up to reply" wall). Taste-driven — the landing itself must look like a tool they'd respect.

### 3. Indie hackers / solo founders / build-in-public
- **Who:** ship demos to X/Discord, record customer onboarding, async investor updates.
- **Why they convert:** allergic to a 4th subscription. "Free forever + uses storage I already pay for" is the entire pitch. Cost-sensitive, autonomy-obsessed.

### 4. OSS / privacy-minded + async-remote teams
- **Who:** people who run their life on self-hosted / own-cloud tools; distributed teams who live in async video.
- **Why they convert:** "no cookies, no trackers, your footage on your Dropbox" is a values match, not a feature. For remote teams it removes the "everyone needs a Loom seat" tax.

---

## Top 3 pain points (ranked, sourced)

1. **Renting your own footage / data lock-in.** Recordings live on Loom's servers behind Loom's account, Loom's player, Loom's retention rules. Leave the plan or the company and the library is hostage. Cap's whole comparison page is built on this ("No more being locked into proprietary platforms", "platform dependent" vs "100% ownership"). This is the emotional core, not a feature gripe.
2. **The free wall + the watermark.** Loom free = 25 videos × 5 min × 720p, then a paywall; Loom branding on every viewer page. Active users hit the ceiling "within a week" (r/sales, r/SaaS). The watermark reads as cheap on client-facing work. (See sources.)
3. **Post-Atlassian decay + the subscription itself.** Since the Atlassian migration: lag, audio-sync issues, failed uploads, login friction (Trustpilot/G2/Reddit through 2025–26). Stacked on a per-seat subscription people resent paying for a glorified record button.

Secondary: viewers forced to load a heavy, cookie'd, account-gated page just to watch a 90-second clip.

---

## Desired outcomes

1. **Hit record, get a link, own the file** — in seconds, with zero thought about quotas, seats, or where the bytes live.
2. **Send a clip that looks like theirs, not the tool's** — clean viewer page, no watermark, no "make an account to watch."
3. **Never think about it again** — install once (~12MB), free forever, footage accrues in a Dropbox they already trust.

---

## Emotional drivers

- **On arrival:** mild resentment ("I'm paying to rent my own recordings"), fatigue with subscriptions, low-grade distrust of where their footage actually lives.
- **What we make them feel:** *relief and ownership.* The quiet satisfaction of reclaiming something. "Oh — it's just mine." Calm, in-control, slightly rebellious. The feeling of cancelling a subscription you resented.
- **The hero's job:** make the moment **record → your Dropbox → your link** feel like a small act of taking your stuff back. Cinematic, but the wow is *clarity*, not spectacle. Confidence, not hype.

---

## Language and tone

- **Words they respond to:** own, yours, your Dropbox, your footage, your link, no account, no watermark, no trackers, free forever, open source, MIT, ~12MB, instant, stop renting.
- **Words/registers to avoid:** "supercharge", "effortless", "seamless", "powerful", "revolutionize", "game-changer", "AI-powered" as a banner (use AI quietly, as a feature, never the headline), "solutions", "empower", enterprise-grade puffery, fake-scarcity, growth-hack tone. No "world's best." No buzzword chips.
- **Register:** plain, confident, technical-literate, a little contrarian. BBC-plain sentences. Talks to a smart peer, not a lead. Shows the mechanism instead of adjectives. Dry wit allowed; hype not.

## What we're NOT building for

- Non-Mac users (Windows/Linux/mobile — desktop-only build, mobile is a stub).
- Enterprise procurement / SSO / admin-console buyers (that's Loom's and Cap-Pro's lane).
- Course creators / YouTubers needing a heavy timeline editor (that's Screen Studio / Tella).
- People who *want* a managed cloud and don't care who holds the file. Tracer's pitch is the opposite of that person.

## Sources
- Cap (cap.so, cap.so/loom-alternative) — the ownership/"own every recording" framing and soft anti-lock-in tone we must out-sharpen.
- Loom (loom.com) — "One video is worth a thousand words", logo-wall + 14-section SaaS structure; blue/teal accent; no pricing on page.
- Loom free-plan limits + watermark + post-Atlassian decay — supademo.com/blog/loom-pricing, salesrobot.co/blogs/loom-review, vyds.io/blog/loom-pricing, saaspare.org (25 videos × 5 min × 720p; watermark; lag/sync/upload complaints).
- OSS/privacy sentiment — github.com/CapSoftware/Cap, github.com/anenthg/OpenLoom ("no analytics, no telemetry, no account required"), openalternative.co/alternatives/loom.
