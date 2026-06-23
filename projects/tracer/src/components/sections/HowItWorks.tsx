import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";

import { GridPage } from "../GridPage";
import {
  HowItWorksScroll,
  RecordVisual,
  DropboxVisual,
  LinkVisual,
} from "../HowItWorksScroll";
import copy from "@content/copy.json";

/**
 * S3 - How it works. The hero chain re-staged at reading pace as three
 * full-width scroll panels (record / lands in your Dropbox / send the link),
 * with the record-red dot threading down a rail as the through-line. On the ONE
 * page grid: H2 spans cols 1-7, the panels span the full 1-12. Replaces the v1
 * StickyFeatureList. The ~/Dropbox/Tracer/ path renders in Geist Mono inline.
 */
const MONO_PATH = "~/Dropbox/Tracer/";

function withMonoPath(body: string) {
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
    body: withMonoPath(step.body),
    visual: visuals[i],
  }));

  return (
    <section id="how" className="scroll-mt-24 bg-[var(--color-bg)]">
      <GridPage className="py-24 md:py-32">
        <div className="col-span-12 lg:col-span-7">
          <BlurReveal>
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
          </BlurReveal>
        </div>

        <div className="col-span-12 mt-12">
          <HowItWorksScroll panels={panels} />
        </div>
      </GridPage>
    </section>
  );
}
