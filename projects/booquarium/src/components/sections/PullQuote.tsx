import { EditorialQuote } from "@kit/components/section/EditorialQuote";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/PullQuote.tsx";

export function PullQuote() {
  const { pullquote } = copy;

  return (
    <EditorialQuote
      quote={pullquote.quote}
      attribution={pullquote.attribution}
      attributionDetail={pullquote.attribution_detail}
      dataSource={DATA_SOURCE}
    />
  );
}
