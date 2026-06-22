"use client";

import { StickyFeatureList } from "@ui-kit/components/section/StickyFeatureList";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";

import { RecordPanel, DropboxPanel, LinkPanel } from "../MorphPanels";
import copy from "@content/copy.json";

/**
 * S3 - How it works. The hero morph restaged at reading pace as a scroll-driven
 * 3-step: Hit record / It lands in your Dropbox / Send the link. Uses the kit
 * StickyFeatureList (pinned visual + scrolling list); each step's visual is a
 * static frame of the matching hero beat. The ~/Dropbox/Tracer/ path renders in
 * Geist Mono inside the Dropbox panel.
 */
const MONO_PATH = "~/Dropbox/Tracer/";

/** Render any "~/Dropbox/Tracer/" substring inside a step body in Geist Mono. */
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
  const visuals = [<RecordPanel key="r" />, <DropboxPanel key="d" />, <LinkPanel key="l" />];

  const items = how_it_works.steps.map((step, i) => ({
    number: `0${i + 1}`,
    title: step.title,
    body: withMonoPath(step.body),
    visual: visuals[i],
  }));

  return (
    <section id="how" className="scroll-mt-24 bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1200px] px-8 py-24 md:py-32">
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

        <div className="mt-16">
          {/* No itemMinHeight override: the kit's natural per-item rhythm
              (py-10) keeps the three steps compact instead of stretching the
              sticky runway into large empty voids. */}
          <StickyFeatureList items={items} />
        </div>
      </div>
    </section>
  );
}
