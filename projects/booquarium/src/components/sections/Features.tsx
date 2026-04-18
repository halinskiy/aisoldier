"use client";

import { SectionHeader } from "@kit/components/section/SectionHeader";
import { StickyFeatureList } from "@kit/components/section/StickyFeatureList";
import { useBookSection } from "@/hooks/useBookSection";
import { OPEN_ANGLE } from "@/contexts/BookContext";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Features.tsx";

export function Features() {
  const { features } = copy;
  const ref = useBookSection({
    x: 1.6, scale: 0.55, coverAngle: OPEN_ANGLE, bookRotY: 0, pageIndex: 0,
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
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
          cardStyle={{ height: "calc(100dvh - 300px)", aspectRatio: "unset" }}
          header={
            <SectionHeader
              eyebrow={features.eyebrow}
              headline={features.headline}
              align="stacked"
              dataSource={DATA_SOURCE}
              className="pb-6 lg:pb-8"
            />
          }
          itemMinHeight="65vh"
          dataSource={DATA_SOURCE}
        />
      </div>
    </section>
  );
}
