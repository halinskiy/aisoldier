import { MarqueeInfinite } from "@kit/components/motion/MarqueeInfinite";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Marquee.tsx";

export function Marquee() {
  const { marquee } = copy;

  return (
    <div
      data-component="Marquee"
      data-source={DATA_SOURCE}
      data-tokens="accent,color-text-subtle"
      style={{
        padding: "clamp(20px, 3vh, 32px) 0",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <MarqueeInfinite
        items={marquee.items}
        speed={55}
        dataSource={DATA_SOURCE}
      />
    </div>
  );
}
