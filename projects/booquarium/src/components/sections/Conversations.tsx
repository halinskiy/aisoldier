import { SectionHeader } from "@kit/components/section/SectionHeader";
import { PressStrip } from "@kit/components/section/PressStrip";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Conversations.tsx";

export function Conversations() {
  const { conversations } = copy;

  return (
    <section
      id="conversations"
      data-component="Conversations"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,font-serif"
      className="relative w-full bg-[var(--color-bg)]"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <SectionHeader
          eyebrow={conversations.eyebrow}
          headline={conversations.headline}
          align="split"
          dataSource={DATA_SOURCE}
          className="mb-14 lg:mb-20"
        />
        <PressStrip items={conversations.items} dataSource={DATA_SOURCE} />
      </div>
    </section>
  );
}
