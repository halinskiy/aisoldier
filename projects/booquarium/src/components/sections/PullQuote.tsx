import { EditorialQuote } from "@kit/components/section/EditorialQuote";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/PullQuote.tsx";

export function PullQuote() {
  const { pullquote } = copy;

  return (
    <section
      id="pullquote"
      data-component="PullQuote"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-accent,font-serif"
      className="relative w-full bg-[var(--color-bg)]"
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        paddingTop: "clamp(64px,10vh,120px)",
        paddingBottom: "clamp(64px,10vh,120px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <EditorialQuote
          quote={pullquote.quote}
          attribution={pullquote.attribution}
          attributionDetail={pullquote.attribution_detail}
          dataSource={DATA_SOURCE}
        />
      </div>
    </section>
  );
}
