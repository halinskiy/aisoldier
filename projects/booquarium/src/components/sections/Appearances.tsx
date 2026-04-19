import { EventCards } from "@kit/components/section/EventCards";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Appearances.tsx";

export function Appearances() {
  const { appearances } = copy;
  return (
    <EventCards
      eyebrow={appearances.eyebrow}
      headline={appearances.headline}
      events={appearances.events}
      dataSource={DATA_SOURCE}
    />
  );
}
