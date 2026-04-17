import { SectionHeader } from "@kit/components/section/SectionHeader";
import { SplitText } from "@kit/components/motion/SplitText";
import { Button } from "@kit/components/ui/Button";
import { BlurReveal } from "@kit/components/motion/BlurReveal";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/About.tsx";

/**
 * Section 2 — About the Author.
 *
 * 2-column layout:
 *   Left: square "photo" placeholder — dot-grid surface + oversized serif
 *         initials "E.V." centred (a literary-editorial stand-in, not stock
 *         photography).
 *   Right: eyebrow + headline + word-reveal bio + "Write to Elena" CTA.
 */
export function About() {
  const { about } = copy;

  return (
    <section
      id="about"
      data-component="About"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,font-serif,radius-window"
      className="relative w-full"
      style={{ paddingTop: "clamp(96px,14vh,200px)", paddingBottom: "clamp(96px,14vh,200px)" }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[520fr_600fr] lg:gap-20">
          {/* Photo placeholder */}
          <BlurReveal delay={0.05}>
            <PhotoPlaceholder initials="E.V." caption="Elena Voss · Edinburgh · 2026" />
          </BlurReveal>

          {/* Content */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
              eyebrow={about.eyebrow}
              headline={about.headline}
              align="stacked"
              headingLevel="h2"
              dataSource={DATA_SOURCE}
            />

            <SplitText
              text={about.body}
              className="max-w-[560px] font-sans text-[18px] leading-[1.6] text-[var(--color-text-muted)]"
              stagger={0.025}
            />

            <BlurReveal delay={0.2}>
              <div>
                <Button
                  href={about.cta.href}
                  variant="secondary"
                  size="lg"
                  className="text-[16px]"
                >
                  {about.cta.label}
                </Button>
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function PhotoPlaceholder({ initials, caption }: { initials: string; caption: string }) {
  return (
    <figure
      data-component="AuthorPhotoPlaceholder"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-subtle,radius-window,font-serif"
      className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[12px] border border-[var(--color-border)]"
      style={{
        backgroundColor: "var(--color-surface)",
        backgroundImage:
          "radial-gradient(circle, rgba(33,33,33,0.14) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Accent corner mark */}
      <span
        aria-hidden
        className="absolute left-6 top-6 inline-block h-[10px] w-[10px] rounded-full"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      {/* Initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-serif font-medium text-[var(--color-text)]"
          style={{
            fontSize: "clamp(96px, 14vw, 180px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Caption */}
      <figcaption
        className="absolute bottom-4 left-6 right-6 flex items-center justify-between gap-3 font-sans text-[12px] font-semibold uppercase tracking-[0.062em] text-[var(--color-text-subtle)]"
      >
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
