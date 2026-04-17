import { SectionHeader } from "@kit/components/section/SectionHeader";
import { StickyFeatureList } from "@kit/components/section/StickyFeatureList";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Features.tsx";

/**
 * Section 3 — Inside the Book.
 *
 * Sticky-left-visual + scrolling-right-list pattern (Apple product pages).
 * 4 chapters from `copy.features.items`.
 *
 * Section id "books" — the nav link `01 Books` scrolls here.
 */
export function Features() {
  const { features } = copy;

  return (
    <section
      id="books"
      data-component="FeaturesStickyList"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-accent,font-serif,ease-out"
      className="relative w-full"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <StickyFeatureList
          items={features.items}
          header={
            <SectionHeader
              eyebrow={features.eyebrow}
              headline={features.headline}
              align="stacked"
              dataSource={DATA_SOURCE}
            />
          }
          dataSource={DATA_SOURCE}
        />
      </div>
    </section>
  );
}
