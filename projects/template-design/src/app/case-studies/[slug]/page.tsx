import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";

import { FooterEditorial } from "@/components/sections/FooterEditorial";
import { Nav } from "@/components/sections/Nav";

import techFounder from "@content/case-studies/tech-founder-after-exit.json";
import familyEstate from "@content/case-studies/family-estate-coordination.json";
import physicianRetirement from "@content/case-studies/physician-retirement-plan.json";
import nonProfitEndowment from "@content/case-studies/non-profit-endowment.json";
import internationalRelocation from "@content/case-studies/international-relocation.json";
import founderEquityHedge from "@content/case-studies/founder-equity-hedge.json";

const DATA_SOURCE = "projects/template-design/src/app/case-studies/[slug]/page.tsx";

type CaseStudy = typeof techFounder;

const caseStudies: CaseStudy[] = [
  techFounder,
  familyEstate,
  physicianRetirement,
  nonProfitEndowment,
  internationalRelocation,
  founderEquityHedge,
];

function findBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = findBySlug(slug);
  if (!cs) return { title: "Case Study Not Found | Template Design" };

  return {
    title: `${cs.title} | Case Studies | Template Design`,
    description: `${cs.eyebrow}: ${cs.sections.situation.paragraphs[0].slice(0, 155)}...`,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = findBySlug(slug);
  if (!cs) notFound();

  return (
    <>
      <Nav />
      <main
        data-component="CaseStudyDetail"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text,font-serif"
      >
        {/* Hero banner with full-bleed image */}
        <section
          data-component="CaseStudyHero"
          data-source={DATA_SOURCE}
          data-tokens="color-accent,font-serif"
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "1440/480" }}
        >
          <Image
            src={cs.image.src}
            alt={cs.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.15)_100%)]"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[1440px] px-6 pb-12 md:px-8 lg:px-8 lg:pb-16">
            <EyebrowLabel accent>{cs.eyebrow}</EyebrowLabel>
            <h1
              className="mt-4 max-w-[720px] font-serif font-medium text-white"
              style={{
                fontSize: "var(--text-h1)",
                lineHeight: "var(--lh-h1)",
                letterSpacing: "var(--ls-h1)",
              }}
            >
              {cs.title}
            </h1>
          </div>
        </section>

        {/* Content sections */}
        <div className="mx-auto w-full max-w-[720px] px-6 md:px-8">
          {/* The situation */}
          <section
            className="py-16 lg:py-20"
            data-component="CaseStudySection"
            data-source={DATA_SOURCE}
          >
            <h2
              className="font-serif font-normal text-[var(--color-text)]"
              style={{
                fontSize: "var(--text-h3)",
                lineHeight: "var(--lh-h3)",
                letterSpacing: "var(--ls-h3)",
              }}
            >
              {cs.sections.situation.headline}
            </h2>
            <div
              className="mt-1 h-px w-full bg-[var(--color-border)]"
              aria-hidden
            />
            <div className="mt-8 flex flex-col gap-5">
              {cs.sections.situation.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[16px] leading-[1.625] text-[var(--color-text-muted)]"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Our approach */}
          <section
            className="pb-16 lg:pb-20"
            data-component="CaseStudySection"
            data-source={DATA_SOURCE}
          >
            <h2
              className="font-serif font-normal text-[var(--color-text)]"
              style={{
                fontSize: "var(--text-h3)",
                lineHeight: "var(--lh-h3)",
                letterSpacing: "var(--ls-h3)",
              }}
            >
              {cs.sections.approach.headline}
            </h2>
            <div
              className="mt-1 h-px w-full bg-[var(--color-border)]"
              aria-hidden
            />
            <div className="mt-8 flex flex-col gap-5">
              {cs.sections.approach.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[16px] leading-[1.625] text-[var(--color-text-muted)]"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* The outcome */}
          <section
            className="pb-16 lg:pb-20"
            data-component="CaseStudySection"
            data-source={DATA_SOURCE}
          >
            <h2
              className="font-serif font-normal text-[var(--color-text)]"
              style={{
                fontSize: "var(--text-h3)",
                lineHeight: "var(--lh-h3)",
                letterSpacing: "var(--ls-h3)",
              }}
            >
              {cs.sections.outcome.headline}
            </h2>
            <div
              className="mt-1 h-px w-full bg-[var(--color-border)]"
              aria-hidden
            />
            <div className="mt-8 flex flex-col gap-5">
              {cs.sections.outcome.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[16px] leading-[1.625] text-[var(--color-text-muted)]"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="flex flex-col items-start gap-4 pb-20 sm:flex-row sm:items-center sm:gap-6">
            <Button href="/#contact" variant="primary" size="lg">
              Book a 30-minute review
            </Button>
            <Button href="/case-studies" variant="secondary" size="lg">
              See all case studies
            </Button>
          </section>
        </div>
      </main>
      <FooterEditorial />
    </>
  );
}
