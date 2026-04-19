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
        <SectionHeader
          eyebrow={praise.eyebrow}
          headline={praise.headline}
          align="split"
          dataSource={DATA_SOURCE}
          className="mb-8 lg:mb-10"
        />

        {/* Blurbs full width */}
        <BlurbWall
          blurbs={praise.blurbs}
          cols={3}
dataSource={DATA_SOURCE}
        />
      </div>
    </section>
  );
}
