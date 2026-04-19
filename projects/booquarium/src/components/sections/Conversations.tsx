import { PressStrip } from "@kit/components/section/PressStrip";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Conversations.tsx";

export function Conversations() {
  const { conversations } = copy;
  return (
    <PressStrip
      eyebrow={conversations.eyebrow}
      headline={conversations.headline}
      items={conversations.items}
      dataSource={DATA_SOURCE}
    />
  );
}
