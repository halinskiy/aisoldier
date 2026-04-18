"use client";

import { SectionHeader } from "@kit/components/section/SectionHeader";
import { BlurbWall } from "@kit/components/section/BlurbWall";
import { useBookSection } from "@/hooks/useBookSection";
import { OPEN_ANGLE } from "@/contexts/BookContext";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Praise.tsx";

export function Praise() {
  const { praise } = copy;
  const ref = useBookSection({
    x: 1.6, scale: 0.76, coverAngle: OPEN_ANGLE, bookRotY: 0, pageIndex: 0,
  });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="praise"
      data-component="Praise"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,color-accent,font-serif"
      className="relative w-full bg-[var(--color-surface)]"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <div className="mb-14 lg:mb-20">
          <SectionHeader
            eyebrow={praise.eyebrow}
            headline={praise.headline}
            align="stacked"
            dataSource={DATA_SOURCE}
          />
        </div>

        <BlurbWall
          blurbs={praise.blurbs}
          cols={3}
          footnote="Sample copy for template demonstration"
          dataSource={DATA_SOURCE}
        />
      </div>
    </section>
  );
}
