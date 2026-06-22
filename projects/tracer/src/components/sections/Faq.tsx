import { FAQAccordion } from "@ui-kit/components/section/FAQAccordion";
import { BlurReveal } from "@ui-kit/components/motion/BlurReveal";

import copy from "@content/copy.json";

/**
 * S6 - FAQ. Seven plain questions, single-open accordion (the open question is
 * the focal point). Heading only, no subheading, no preamble.
 */
export function Faq() {
  const { faq } = copy;
  const items = faq.items.map((i) => ({ question: i.question, answer: i.answer }));

  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[840px] px-8 py-24 md:py-32">
        <BlurReveal>
          <h2
            className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-text)]"
            style={{
              fontSize: "var(--text-display-md)",
              lineHeight: "var(--lh-h2)",
              letterSpacing: "var(--ls-display)",
            }}
          >
            {faq.heading}
          </h2>
        </BlurReveal>

        <div className="mt-12">
          <FAQAccordion items={items} mode="single" />
        </div>
      </div>
    </section>
  );
}
