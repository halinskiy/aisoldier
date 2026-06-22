import { BentoGrid, BentoCell } from "@ui-kit/components/section/BentoGrid";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";

import copy from "@content/copy.json";

/**
 * S4 - Features. An icon-free hairline bento: a calm 3x2 field of equal cells,
 * each a short title + one terse line. No icons, no hero-card asymmetry, no
 * captions. Borders on every cell; staggered rise on scroll via the kit
 * scroll-timeline reveal (.st-reveal).
 */
export function Features() {
  const { features } = copy;

  return (
    <section id="features" className="scroll-mt-24 bg-[var(--color-bg)]">
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
            {features.heading}
          </h2>
        </BlurReveal>

        <div className="mt-16">
          <BentoGrid cols={12} rowMinHeight={200} gap={16}>
            {features.items.map((item, i) => (
              <BentoCell
                key={item.title}
                span={{ base: 12, md: 6, lg: 4 }}
                tone="surface"
                padding="lg"
                className={`st-reveal st-reveal-${(i % 4) + 1}`}
              >
                <h3
                  className="font-[family-name:var(--font-display)] text-[20px] font-semibold leading-[1.3] text-[var(--color-text)]"
                >
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[36ch] font-[family-name:var(--font-sans)] text-[16px] leading-[1.6] text-[var(--color-text-muted)]">
                  {item.body}
                </p>
              </BentoCell>
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
