import { ContactStrip } from "@kit/components/section/ContactStrip";
import copy from "@content/copy.json";

const DATA_SOURCE = "projects/booquarium/src/components/sections/Contact.tsx";

export function Contact() {
  const { contact } = copy;
  return (
    <ContactStrip
      eyebrow={contact.eyebrow}
      headline={contact.headline}
      columns={contact.columns}
      dataSource={DATA_SOURCE}
    />
  );
}
