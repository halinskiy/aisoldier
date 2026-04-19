import { SectionHeader } from "@kit/components/section/SectionHeader";
import { ContactStrip } from "@kit/components/section/ContactStrip";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Contact.tsx";

export function Contact() {
  const { contact } = copy;

  return (
    <section
      id="contact"
      data-component="Contact"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-accent,font-serif"
      className="relative w-full bg-[var(--color-bg)]"
      style={{
        paddingTop: "clamp(96px,14vh,200px)",
        paddingBottom: "clamp(96px,14vh,200px)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-10">
        <SectionHeader
          eyebrow={contact.eyebrow}
          headline={contact.headline}
          align="split"
          dataSource={DATA_SOURCE}
          className="mb-14 lg:mb-20"
        />
      </div>
      <ContactStrip columns={contact.columns} dataSource={DATA_SOURCE} />
    </section>
  );
}
