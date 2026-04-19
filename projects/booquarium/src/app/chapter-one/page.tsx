import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Chapter One — The Map Room | The Cartographer's Daughter",
  description: "Read the opening chapter of The Cartographer's Daughter by Elena Voss.",
  robots: { index: false, follow: false },
};

export default function ChapterOne() {
  return (
    <main
      className="min-h-screen bg-[#fafaf8] font-serif"
      style={{ padding: "clamp(48px, 8vh, 96px) clamp(24px, 6vw, 48px)" }}
    >
      <article className="mx-auto" style={{ maxWidth: "660px" }}>

        {/* Back link */}
        <a
          href={`${BASE}/`}
          className="mb-16 inline-flex items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--color-text-subtle)] transition-colors duration-150 hover:text-[var(--color-text)]"
          style={{ display: "block", marginBottom: "clamp(48px, 8vh, 96px)" }}
        >
          ← Back
        </a>

        {/* Chapter header */}
        <header style={{ marginBottom: "clamp(40px, 6vh, 72px)" }}>
          <p
            className="font-sans font-medium uppercase tracking-[0.1em] text-[var(--color-accent)]"
            style={{ fontSize: "12px", marginBottom: "16px" }}
          >
            Chapter One
          </p>
          <h1
            className="font-serif font-medium text-[var(--color-text)]"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            The Map Room
          </h1>
          <div
            aria-hidden
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "var(--color-accent)",
              marginTop: "28px",
            }}
          />
        </header>

        {/* Body */}
        <div className="chapter-body">

          <p className="drop-cap">
            The maps were the first thing Mara noticed. Not the smell of the flat — that familiar
            compound of old paper and pipe tobacco and whatever her father had been cooking on
            the single gas ring — nor the particular silence that settles into a room when its
            inhabitant will never return. She noticed the maps.
          </p>

          <p>
            They covered every wall of the study. Floor to ceiling, overlapping at the edges,
            pinned with small brass tacks he had always kept in a ceramic bowl by the door.
            She remembered that bowl. She had knocked it over once, aged seven, and spent a
            long afternoon on her hands and knees recovering tacks from the gaps between
            floorboards while her father watched from his chair without helping.
          </p>

          <p>
            He had believed in consequences. He had believed in most things quietly and without
            explanation, which was part of why she had stopped calling.
          </p>

          <p>
            The solicitor had given her a key and a cardboard box and the address of the flat in
            Leith, close enough to the water that she could smell the Firth on the walk from the
            tram stop. The box contained: one wristwatch with a cracked crystal, a bundle of
            letters tied with kitchen twine, a passport issued eleven years ago and never used,
            and a folded note in her father's handwriting that read <em>For Mara, when she is
            ready.</em> He had not left a date. He had not left anything to indicate what she
            was supposed to be ready for.
          </p>

          <p>
            She had not opened the letters yet. They sat on the kitchen table of her flat in
            Glasgow, still tied, while she came here instead — to the maps, to the smell, to
            the particular weight of a room that had contained someone and no longer did.
          </p>

          <p>
            There were continents she recognised and some she did not. Europe, certainly —
            Edinburgh rendered in extraordinary detail on a sheet that covered most of the
            south wall, every close and wynd marked in his precise italic hand. The Baltic
            coast. The outline of a peninsula she thought might be Crimea, though it was drawn
            from a perspective she had never seen in any atlas. And then, taking up most of the
            east wall, a map of somewhere she could not name at all.
          </p>

          <p>
            She moved closer. The paper was older than the others, the colour of weak tea,
            and the coastline described a territory that did not correspond to anything in her
            memory. Mountains were indicated by small hatched triangles, rivers by thin curved
            lines, and at the centre of the map, circled twice in red ink that had faded to
            rust, a name she could not read.
          </p>

          <p>
            She had not known her father to invent. He was not that kind of man. He had been
            a surveyor for thirty years, precise and methodical, a man who believed that the
            world was a problem of measurement and that measurement, done honestly, could
            answer almost anything. He had not believed in things that could not be located.
          </p>

          <p>
            And yet.
          </p>

          <p>
            She stood in front of the unknown coast for a long time. The light through the
            single window moved across the floor. Somewhere below, a door opened and closed.
            She heard, distantly, the sound of the river.
          </p>

          <p>
            When she finally looked away, she noticed something she had missed on first
            entering: a second bundle of letters, these ones not tied, fanned open on the
            desk as though her father had been reading them when he died. The handwriting on
            the uppermost envelope was not his.
          </p>

          <p>
            It was hers.
          </p>

          <p>
            Letters she had written and never sent, a whole decade of them, retrieved from
            somewhere she had no memory of leaving them.
          </p>

          <p>
            She sat down in his chair. Outside, Edinburgh went on being Edinburgh — grey and
            steady and indifferent to the things people kept from each other. She picked up
            the first letter. She began to read.
          </p>

        </div>

        {/* End ornament */}
        <div
          aria-hidden
          className="text-center"
          style={{ margin: "clamp(48px, 8vh, 80px) 0 clamp(40px, 6vh, 64px)" }}
        >
          <span style={{ color: "var(--color-accent)", fontSize: "24px", letterSpacing: "0.4em" }}>
            ✦ ✦ ✦
          </span>
        </div>

        {/* CTA */}
        <div
          className="border-t border-[var(--color-border)] text-center"
          style={{ paddingTop: "clamp(40px, 6vh, 64px)", paddingBottom: "clamp(48px, 8vh, 80px)" }}
        >
          <p
            className="font-sans text-[var(--color-text-muted)]"
            style={{ fontSize: "16px", lineHeight: 1.6, marginBottom: "28px" }}
          >
            <em>The Cartographer's Daughter</em> is available now.
          </p>
          <a
            href={`${BASE}/#books`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-text)] px-8 font-sans text-[16px] font-medium text-[var(--color-bg)] transition-opacity duration-150 hover:opacity-80"
            style={{ height: "48px" }}
          >
            Pre-order now
          </a>
        </div>

      </article>

      <style>{`
        .chapter-body p {
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(17px, 1.8vw, 20px);
          line-height: 1.85;
          color: var(--color-text);
          margin-bottom: 1.6em;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .chapter-body p.drop-cap::first-letter {
          float: left;
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(64px, 8vw, 88px);
          font-weight: 500;
          line-height: 0.78;
          color: var(--color-accent);
          margin-right: 10px;
          margin-top: 6px;
          letter-spacing: -0.02em;
        }
      `}</style>
    </main>
  );
}
