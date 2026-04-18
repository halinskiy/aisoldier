import { SectionHeader } from "@kit/components/section/SectionHeader";
import { BlurbWall } from "@kit/components/section/BlurbWall";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Praise.tsx";

export function Praise() {
  const { praise } = copy;

  return (
    <section
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
        {/* Header in right column — aligns with all other section headers */}
        <div className="mb-14 grid grid-cols-1 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <div aria-hidden />
          <SectionHeader
            eyebrow={praise.eyebrow}
            headline={praise.headline}
            align="stacked"
            dataSource={DATA_SOURCE}
          />
        </div>

        {/* Blurbs full width */}
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
