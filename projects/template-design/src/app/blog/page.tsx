import type { Metadata } from "next";

import { ImageCardGrid } from "@kit/components/section/ImageCardGrid";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import { FooterEditorial } from "@/components/sections/FooterEditorial";
import { Nav } from "@/components/sections/Nav";

import fiduciaryDuty from "@content/blog/fiduciary-duty.json";
import taxLossHarvesting from "@content/blog/tax-loss-harvesting.json";
import riskAfter2022 from "@content/blog/risk-after-2022.json";

const DATA_SOURCE = "projects/template-design/src/app/blog/page.tsx";

export const metadata: Metadata = {
  title: "Blog | Template Design",
  description:
    "Practical writing on fiduciary duty, tax strategy, and portfolio risk. No jargon, no sales pitches. Written by the Template Design advisory team.",
};

const articles = [fiduciaryDuty, taxLossHarvesting, riskAfter2022];

const cards = articles.map((article) => ({
  title: article.title,
  eyebrow: `${article.eyebrow} · ${article.readTime}`,
  description: article.body[0].slice(0, 120) + "...",
  image: article.image,
  href: `/blog/${article.slug}`,
}));

export default function BlogIndexPage() {
  return (
    <>
      <Nav />
      <main
        data-component="BlogIndex"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text"
      >
        <section className="relative w-full py-[120px]">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
            <SectionHeader
              align="stacked"
              eyebrow="Blog"
              headline="Thinking in public"
              body="Practical writing on wealth management, tax strategy, and risk. No jargon, no sales pitches."
              headingLevel="h1"
              dataSource={DATA_SOURCE}
            />
            <div className="mt-16 lg:mt-20">
              <ImageCardGrid
                cards={cards}
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
