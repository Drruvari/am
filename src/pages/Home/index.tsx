import About from "./sections/About";
import Contact from "./sections/Contact";
import FeaturedProject from "./sections/FeaturedProject";
import Hero from "./sections/Hero";
import Philosophy from "./sections/Philosophy";
import Process from "./sections/Process";
import SelectedWorks from "./sections/SelectedWorks";
import Services from "./sections/Services";
import "./style.scss";

export default function Home() {
  return (
    <>
      <main id="top" className="home-page">
        <Hero />
        <FeaturedProject />
        <Philosophy />
        <SelectedWorks />
        <Services />
        <Process />
        <About />
      </main>

      <Contact />
    </>
  );
}
