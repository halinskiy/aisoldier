import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/components/sections/Process.tsx";

type Step = {
  number: string;
  label: string;
  description: string;
};

/**
 * Section 9 — Our Process.
 *
 * Geometry (FIGMA_SPEC §9, desktop 1440 baseline):
 *   - py-[120px] symmetric
 *   - SectionHeader split: eyebrow "How We Work" + H3 "Our Process" / body + CTA
 *   - 4-step horizontal row of numbered circles sitting on a horizontal line
 *
 * Gaps fixed here:
 *   🔴 #6 circles overflow parent by 16px top/bottom
 *        → parent connector row `h-9 overflow-visible`, circle sits ABSOLUTE
 *          on top of its own row and extends outside via `-translate-y-1/2`.
 *          NO negative margins (they fight Framer Motion transforms).
 *   🟠 #9 fractional x positions for pill labels (123.5, 127, 114)
 *        → pills are `justify-self-center` inside a grid cell. Zero
 *          hardcoded px offsets.
 *
 * Structure:
 *   ProcessSteps (local)
 *     grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
 *     ├── ProcessStep 01 (Discovery)
 *     │     pill / connector-row-with-circle / description
 *     ├── ProcessStep 02 (Strategy)
 *     ├── ProcessStep 03 (Execution)
 *     └── ProcessStep 04 (Optimization)
 *
 * Connector line: each step owns its own line segment inside its own
 * connector row. `first:` and `last:` trim the line so it starts and
 * ends at the circle centers of step 1 and step 4. Hidden below `lg`
 * because the 2-col / 1-col responsive grids can't carry a horizontal
 * connector meaningfully.
 */
export function Process() {
  const { process } = copy;
  const steps = process.steps as Step[];

  return (
    <section
      id="process"
      data-component="Process"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-border,color-accent,font-serif"
      className="relative w-full py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
        <SectionHeader
          align="split"
          eyebrow={process.eyebrow}
          headline={process.headline}
          body={process.body}
          cta={process.cta}
          dataSource={DATA_SOURCE}
        />

        <ProcessSteps steps={steps} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol
      data-component="ProcessSteps"
      data-source={DATA_SOURCE}
      data-tokens="color-border,color-accent,color-bg"
      className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:mt-20 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0"
    >
      {steps.map((step, i) => (
        <ProcessStep
          key={step.number}
          step={step}
          index={i}
          isFirst={i === 0}
          isLast={i === steps.length - 1}
        />
      ))}
    </ol>
  );
}

function ProcessStep({
  step,
  index,
  isFirst,
  isLast,
}: {
  step: Step;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li
      data-component="ProcessStep"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-text-muted,color-accent,color-border,font-serif"
      data-motion="blur-reveal"
      data-motion-index={index}
      className="flex flex-col items-center text-center"
    >
      {/* Pill label — center via flex, NO hardcoded x offset */}
      <EyebrowLabel dataSource={DATA_SOURCE}>{step.label}</EyebrowLabel>

      {/* Connector row — overflow-visible so the 56×56 circle (and its 68×68
          halo) can extend beyond the 36px row height without clipping. */}
      <div
        data-component="ProcessConnectorRow"
        data-source={DATA_SOURCE}
        data-tokens="color-border,color-accent"
        className="relative mt-6 h-9 w-full overflow-visible"
      >
        {/* Horizontal line — hidden below lg.
            first: line starts at column center (no left segment).
            last: line ends at column center (no right segment).
            The MotionProvider observes `data-motion="line-draw"` and
            transitions from `scaleX(0)` → `scaleX(1)` on enter. */}
        <span
          aria-hidden
          data-motion="line-draw"
          className={
            "absolute top-1/2 hidden h-px -translate-y-1/2 bg-[var(--color-border-strong)] lg:block " +
            (isFirst ? "left-1/2 right-0 " : "") +
            (isLast ? "left-0 right-1/2 " : "") +
            (!isFirst && !isLast ? "left-0 right-0 " : "")
          }
        />

        {/* Circle — absolute center, lives ABOVE the line via z-10.
            56×56 inner circle wrapped in a 68×68 halo ring (matches Figma
            Frame 530 / Frame 572 hierarchy). */}
        <span
          data-component="ProcessCircle"
          data-source={DATA_SOURCE}
          data-tokens="color-accent,color-bg,color-text,font-serif"
          className="absolute left-1/2 top-1/2 z-10 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-accent)]/25 bg-transparent"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)] font-serif font-medium text-[var(--color-text)]"
            style={{
              fontSize: "24px",
              lineHeight: "1",
              letterSpacing: "-0.021em",
            }}
          >
            {step.number}
          </span>
        </span>
      </div>

      {/* Description — centered below the connector */}
      <p className="mt-8 max-w-[280px] text-[14px] leading-[1.5] text-[var(--color-text-muted)]">
        {step.description}
      </p>
    </li>
  );
}
