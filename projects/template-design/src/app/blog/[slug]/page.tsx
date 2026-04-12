import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";

import { FooterEditorial } from "@/components/sections/FooterEditorial";
import { Nav } from "@/components/sections/Nav";

import fiduciaryDuty from "@content/blog/fiduciary-duty.json";
import taxLossHarvesting from "@content/blog/tax-loss-harvesting.json";
import riskAfter2022 from "@content/blog/risk-after-2022.json";

const DATA_SOURCE = "projects/template-design/src/app/blog/[slug]/page.tsx";

type Article = typeof fiduciaryDuty;

const articles: Article[] = [fiduciaryDuty, taxLossHarvesting, riskAfter2022];

function findBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findBySlug(slug);
  if (!article) return { title: "Article Not Found | Template Design" };

  return {
    title: `${article.title} | Blog | Template Design`,
    description: article.body[0].slice(0, 160),
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <Nav />
      <main
        data-component="BlogArticle"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text,font-serif,font-sans"
      >
        <article className="mx-auto w-full max-w-[720px] px-6 pb-20 pt-[120px] md:px-8">
          {/* Eyebrow: date + read time */}
          <div className="mb-6">
            <EyebrowLabel dataSource={DATA_SOURCE}>
              {article.eyebrow} · {article.readTime}
            </EyebrowLabel>
          </div>

          {/* Title */}
          <h1
            className="font-serif font-medium text-[var(--color-text)]"
            style={{
              fontSize: "var(--text-h1)",
              lineHeight: "var(--lh-h1)",
              letterSpacing: "var(--ls-h1)",
            }}
          >
            {article.title}
          </h1>

          {/* Body paragraphs */}
          <div className="mt-10 flex flex-col gap-6">
            {article.body.map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-[16px] leading-[1.625] text-[var(--color-text-muted)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author block */}
          <div className="mt-16 border-t border-[var(--color-border)] pt-8">
            <p className="font-sans text-[16px] font-semibold text-[var(--color-text)]">
              {article.author.name}
            </p>
            <p className="mt-1 font-sans text-[14px] text-[var(--color-text-subtle)]">
              {article.author.role}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button href="/#contact" variant="primary" size="lg">
              Book a review
            </Button>
            <Button href="/blog" variant="secondary" size="lg">
              Back to blog
            </Button>
          </div>
        </article>
      </main>
      <FooterEditorial />
    </>
  );
}
