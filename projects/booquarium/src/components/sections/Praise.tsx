import { SectionHeader } from "@kit/components/section/SectionHeader";
import { BlurbWall } from "@kit/components/section/BlurbWall";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Praise.tsx";

/**
 * Section 4 — Early Praise.
 *
 * Dense 3-column BlurbWall of 6 editorial quotes. Not a carousel: all
 * blurbs are visible at once, like the back cover of a paperback.
 */
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
        <BlurbWall
          blurbs={praise.blurbs}
          cols={3}
          header={
            <SectionHeader
              eyebrow={praise.eyebrow}
              headline={praise.headline}
              align="stacked"
              dataSource={DATA_SOURCE}
            />
          }
          footnote="Sample copy for template demonstration"
          dataSource={DATA_SOURCE}
        />
      </div>
    </section>
  );
}
