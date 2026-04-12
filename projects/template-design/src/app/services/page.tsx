import type { Metadata } from "next";

import { Button } from "@kit/components/ui/Button";
import { EyebrowLabel } from "@kit/components/section/EyebrowLabel";
import { SectionHeader } from "@kit/components/section/SectionHeader";

import { FooterEditorial } from "@/components/sections/FooterEditorial";
import { Nav } from "@/components/sections/Nav";

import servicesData from "@content/services-detail.json";

const DATA_SOURCE = "projects/template-design/src/app/services/page.tsx";

export const metadata: Metadata = {
  title: "Services | Template Design",
  description:
    "Six areas of practice: wealth planning, investment management, tax strategy, estate planning, retirement planning, and business exit planning. Fee-only, fiduciary-first.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main
        data-component="ServicesPage"
        data-source={DATA_SOURCE}
        data-tokens="color-bg,color-text"
      >
        {/* Page header */}
        <section className="relative w-full pt-[120px] pb-16">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
            <SectionHeader
              align="stacked"
              eyebrow={servicesData.eyebrow}
              headline={servicesData.headline}
              body={servicesData.body}
              headingLevel="h1"
              dataSource={DATA_SOURCE}
            />
          </div>
        </section>

        {/* Individual services */}
        {servicesData.services.map((service, i) => (
          <section
            key={service.id}
            id={service.id}
            data-component="ServiceDetail"
            data-source={DATA_SOURCE}
            data-tokens="color-border,color-text,color-text-muted,font-serif"
            className="relative w-full"
          >
            <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
              {/* Top divider */}
              <div className="h-px w-full bg-[var(--color-border)]" aria-hidden />

              <div className="grid grid-cols-1 gap-y-8 py-16 lg:grid-cols-[501fr_200fr_676fr] lg:gap-y-0 lg:py-20">
                {/* Left column: number + title */}
                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[14px] font-semibold text-[var(--color-text-subtle)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-serif font-normal text-[var(--color-text)]"
                    style={{
                      fontSize: "var(--text-h3)",
                      lineHeight: "var(--lh-h3)",
                      letterSpacing: "var(--ls-h3)",
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Gutter */}
                <div aria-hidden className="hidden lg:block" />

                {/* Right column: content */}
                <div className="flex max-w-[676px] flex-col gap-8">
                  {/* Body paragraphs */}
                  <div className="flex flex-col gap-5">
                    {service.paragraphs.map((p, j) => (
                      <p
                        key={j}
                        className="text-[16px] leading-[1.625] text-[var(--color-text-muted)]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Who it's for */}
                  <div>
                    <h4 className="font-sans text-[16px] font-semibold text-[var(--color-text)]">
                      Who it is for
                    </h4>
                    <p className="mt-3 text-[16px] leading-[1.625] text-[var(--color-text-muted)]">
                      {service.whoItsFor}
                    </p>
                  </div>

                  {/* How we work */}
                  <div>
                    <h4 className="font-sans text-[16px] font-semibold text-[var(--color-text)]">
                      How we work
                    </h4>
                    <p className="mt-3 text-[16px] leading-[1.625] text-[var(--color-text-muted)]">
                      {service.howWeWork}
                    </p>
                  </div>

                  {/* Per-service CTA */}
                  <div>
                    <Button href="/#contact" variant="secondary" size="md">
                      Book a consultation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <section className="relative w-full pb-[120px] pt-8">
          <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-8">
            <div className="h-px w-full bg-[var(--color-border)]" aria-hidden />
            <div className="flex flex-col items-center gap-6 pt-16 text-center">
              <h2
                className="font-serif font-normal text-[var(--color-text)]"
                style={{
                  fontSize: "var(--text-h3)",
                  lineHeight: "var(--lh-h3)",
                  letterSpacing: "var(--ls-h3)",
                }}
              >
                Ready to start?
              </h2>
              <p className="max-w-[480px] text-[16px] leading-[1.625] text-[var(--color-text-muted)]">
                Every engagement begins with a free 30-minute review. Tell us about your situation and we will outline next steps.
              </p>
              <Button href="/#contact" variant="primary" size="lg">
                {servicesData.bottomCta.label}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <FooterEditorial />
    </>
  );
}
