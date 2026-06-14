# AI-tells ban list + naturalness scorecard

Source of truth for **3mpq-naturalist**. Refresh roughly every 30 days:
vocabulary tells decay as models route around named words ("delve" rose
then fell once it became a known tell), so weight STRUCTURE over words.
One banned word proves nothing; three or more in a short passage is the
verdict. Grounded in: Kobak et al. Science Advances (Jul 2025, excess
vocabulary), Originality.ai (perplexity/burstiness, Oct 2025), Nature
variance study via CommsTrader (2025), Wikipedia "Signs of AI writing"
(2025-26).

## BAN LIST (flag on sight; cluster = block)

### Hype verbs
delve, delve into, leverage, utilize, employ, harness, unlock, unleash,
unveil, uncover, elevate, supercharge, turbocharge, skyrocket, empower,
streamline, foster, cultivate, embark, navigate (metaphor), craft,
curate, boast, underscore, showcase, resonate, enhance, garner, dive
into, deep dive, unpack

### Filler adjectives
seamless, seamlessly, robust, cutting-edge, next-gen, state-of-the-art,
world-class, best-in-class, revolutionary, groundbreaking, game-changing,
transformative, paradigm-shifting, powerful, comprehensive, crucial,
critical, pivotal, vital, key (filler), innovative, vibrant, rich,
profound, meticulous, compelling, engaging, fast-paced, nimble,
future-ready

### Abstract-noun filler
landscape (metaphor), realm, arena, tapestry, ecosystem, testament, a
testament to, synergy, journey, cornerstone, backbone, foundation
(metaphor), paradigm, arsenal, toolkit, secret sauce, valuable insights

### Opener cliches
in today's fast-paced world, in today's world, in the ever-evolving
landscape, imagine a world where, picture this, as we move forward, ever
wondered, let's dive in, let's explore, in the realm of

### Connective / hedging cliches
it's important to note, it's worth noting, that being said, when it comes
to, at the end of the day, needless to say, furthermore/moreover/
additionally (stacked), generally speaking, may potentially, in
conclusion, ultimately

### Banned constructions (HIGH-CONFIDENCE -> blocking)
- "it's not just X, it's Y" / "it's not about X, it's about Y"
- "not only ... but also"
- "X is a testament to Y"
- "No X. No Y. Just Z."
- "whether you're A or B"
- "despite [challenges], X continues to thrive"
- "the catch? / the kicker?" (one-word question + answer)
- "serves as / stands as / represents / marks a" instead of "is"
- "not X, but rather Y"

### Punctuation / typography (also enforced by the linter)
em-dash overuse, en-dash where a hyphen/comma belongs, minus sign,
bullet, middle dot, curly quotes in raw copy, rule-of-three triads on
autopilot, emoji in headers, Title Case Everywhere, bold in nearly every
paragraph.

## NATURALNESS SCORECARD (pass/fail; weight structure over words)

```
Vocabulary (fast filter)
[ ] no tier-1 banned verbs        [ ] no filler adjectives
[ ] no abstract-noun filler       [ ] no opener cliche
[ ] no hedging cliche             [ ] stacked connectors 0-1

Constructions (block on fail)
[ ] no "not just X, it's Y" / "not only...but also"
[ ] no "is a testament to"
[ ] no "whether you're A or B" (a specific reader is named)
[ ] plain "is/has", not "serves as / represents"

Punctuation / typography
[ ] em-dashes within budget, no clusters   [ ] straight quotes in copy
[ ] no rule-of-three triads                [ ] no emoji in headers
[ ] bold sparing (<=1 per section)

Structure & rhythm (weight heaviest)
[ ] burstiness: a <8-word line AND a 20+-word line per section
[ ] sentence length varies (not all 15-22)
[ ] paragraphs vary in shape
[ ] no sentence restating the heading
[ ] fails the reshuffle test (paragraphs reference each other)
[ ] low hedging density

Positive voice
[ ] concrete specifics (numbers/names/mechanisms), not "significant"
[ ] contractions where natural
[ ] a detectable point of view
[ ] shows rather than announces
```

Block on any FAIL in the Constructions block, on a burstiness FAIL, or on
a 3+ cluster in the Vocabulary block. Refresh this file ~monthly.
