import { SectionHeader } from "@kit/components/section/SectionHeader";
import { EventCards } from "@kit/components/section/EventCards";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Appearances.tsx";

export function Appearances() {
  const { appearances } = copy;

  return (
    <section
      id="appearances"
      data-component="Appearances"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-accent,font-serif"
      className="relative w-full bg-[var(--color-surface)]"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <SectionHeader
          eyebrow={appearances.eyebrow}
          headline={appearances.headline}
          align="split"
          dataSource={DATA_SOURCE}
          className="mb-14 lg:mb-20"
        />
        <EventCards events={appearances.events} dataSource={DATA_SOURCE} />
      </div>
    </section>
  );
}
