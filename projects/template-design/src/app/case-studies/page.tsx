import type { Metadata } from "next";

import { ImageCardGrid } from "@kit/components/section/ImageCardGrid";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import { FooterEditorial } from "@/components/sections/FooterEditorial";
import { Nav } from "@/components/sections/Nav";

import copy from "@content/copy.json";

const DATA_SOURCE = "projects/template-design/src/app/case-studies/page.tsx";

export const metadata: Metadata = {
  title: "Case Studies | Template Design",
  description:
    "Six client engagements, anonymised and compliance-reviewed. See how Template Design approaches post-liquidity events, estate coordination, retirement planning, and more.",
};

export default function CaseStudiesIndexPage() {
  const { caseStudies } = copy;

  return (
    <>
      <Nav />
      <main
        data-component="CaseStudiesIndex"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text"
      >
        <section className="relative w-full py-[120px]">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
            <SectionHeader
              align="stacked"
              eyebrow="Case Studies"
              headline="Proven outcomes"
              headingLevel="h1"
              dataSource={DATA_SOURCE}
            />
            <div className="mt-16 lg:mt-20">
              <ImageCardGrid
                cards={caseStudies.cards}
                cols={2}
                dataSource={DATA_SOURCE}
              />
            </div>
          </div>
        </section>
      </main>
      <FooterEditorial />
    </>
  );
}
