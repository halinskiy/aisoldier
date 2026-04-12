import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { Banner } from "@/components/sections/Banner";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";
import { FooterEditorial } from "@/components/sections/FooterEditorial";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/sections/Nav";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { ServicesList } from "@/components/sections/ServicesList";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main
        data-component="HomePage"
        data-source="projects/template-design/src/app/page.tsx"
        data-tokens="color-bg,color-text"
      >
        <Hero />
        <About />
        <Approach />
        <Services />
        <ServicesList />
        <CaseStudies />
        <Banner />
        <Testimonials />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <FooterEditorial />
    </>
  );
}
