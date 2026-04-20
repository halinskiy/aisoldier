import Image from "next/image";

const DATA_SOURCE = "projects/booquarium/src/components/sections/FullBleedImage.tsx";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function FullBleedImage() {
  return (
    <section
      id="full-bleed"
      data-component="FullBleedImage"
      data-source={DATA_SOURCE}
      data-tokens="color-bg"
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <Image
        src={`${BASE}/covers/spread.jpg`}
        alt="The Cartographer's Daughter — book cover"
        fill
        priority={false}
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </section>
  );
}
