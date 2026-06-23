import { GridPage } from "../GridPage";
import { ScrubReveal } from "../ScrubReveal";
import { FAQTwoCol } from "../FAQTwoCol";
import copy from "@content/copy.json";

/**
 * S6 - FAQ (V3). Seven plain questions as a full-width two-column accordion on
 * the ONE page grid. H2 "Questions." reveals via scroll (ScrubReveal / A4); the
 * open/close stays a DISCRETE sub-250ms interaction (a user click, not a scrub).
 * The global ScrollDot docks at the FAQ marker in its window. H2 spans cols 1-7;
 * the accordion spans the full 1-12. Single-open, the open marker is the
 * record-red dot (ring -> filled). Heading only, no subheading, no preamble.
 */
export function Faq() {
  const { faq } = copy;
  const items = faq.items.map((i) => ({ question: i.question, answer: i.answer }));

  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--color-bg)]">
      <GridPage className="py-24 md:py-32">
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
              {faq.heading}
            </h2>
          </ScrubReveal>
        </div>

        <div className="col-span-12 mt-12">
          <FAQTwoCol items={items} />
        </div>
      </GridPage>
    </section>
  );
}
