import { Loader } from "@/components/Loader";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Praise } from "@/components/sections/Praise";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Loader />
      <Nav />
      <Hero />
      <About />
      <Features />
      <Praise />
      <Newsletter />
      <Footer />
    </main>
  );
}
