import { GridPage } from "../GridPage";
import { ScrubReveal } from "../ScrubReveal";
import {
  HowItWorksScroll,
  RecordVisual,
  DropboxVisual,
  LinkVisual,
} from "../HowItWorksScroll";
import copy from "@content/copy.json";

/**
 * S3 - How it works (V3). The hero chain re-staged off-axis: a pinned HORIZONTAL
 * scrub of three panels (record / lands in your Dropbox / send the link). The H2
 * "Record, own, share." reveals via scroll (ScrubReveal / A4), server-rendered
 * above the sticky stage. The panels span the full 1-12 grid.
 *
 * V3 text cuts applied in RENDER ONLY (copy.json untouched, HANDOFF.md):
 *   - steps[0].body shortened from 3 sentences to 2:
 *     "Press the global hotkey. The red dot goes live."
 *   - steps[2].body: trailing "Done." sentence suppressed.
 * The ~/Dropbox/Tracer/ path renders in Geist Mono inline.
 */
const MONO_PATH = "~/Dropbox/Tracer/";

// Render-time cuts (SECTION_CONTRACT_V3 Part 5). Facts intact, nothing invented.
const STEP_BODY_OVERRIDES: Record<number, string> = {
  0: "Press the global hotkey. The red dot goes live.",
  2: "A clean tracer.nocorny.com/v/... link is already in your clipboard.",
};

function withMonoPath(body: string): React.ReactNode {
  if (!body.includes(MONO_PATH)) return body;
  const parts = body.split(MONO_PATH);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span
            key={i}
            className="font-[family-name:var(--font-mono)] text-[var(--color-text)]"
          >
            {MONO_PATH}
          </span>,
          part,
        ],
  );
}

export function HowItWorks() {
  const { how_it_works } = copy;
  const visuals = [<RecordVisual key="r" />, <DropboxVisual key="d" />, <LinkVisual key="l" />];

  const panels = how_it_works.steps.map((step, i) => ({
    title: step.title,
    body: withMonoPath(STEP_BODY_OVERRIDES[i] ?? step.body),
    visual: visuals[i],
  }));

  return (
    <section id="how" className="scroll-mt-24 bg-[var(--color-bg)]">
      <GridPage className="pt-24 md:pt-32">
        <div className="col-span-12 lg:col-span-7">
          <ScrubReveal variant="clip">
            <h2
              className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)]"
              style={{
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--lh-h2)",
                letterSpacing: "var(--ls-display)",
              }}
            >
              {how_it_works.heading}
            </h2>
          </ScrubReveal>
        </div>
      </GridPage>

      <GridPage className="mt-8">
        <div className="col-span-12">
          <HowItWorksScroll panels={panels} />
        </div>
      </GridPage>
    </section>
  );
}
