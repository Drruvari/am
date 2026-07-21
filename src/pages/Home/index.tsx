import Hero from "./sections/01";
import PracticeOverview from "./sections/02";
import Philosophy from "./sections/03";
import SelectedWorks from "./sections/04";
import Process from "./sections/05";
import About from "./sections/06";
import Contact from "./sections/07";
import "./style.scss";

export default function Home() {
  return (
    <>
      <main id="top" className="home-page">
        <Hero />
        <PracticeOverview />
        <Philosophy />
        <SelectedWorks />
        <Process />
        <About />
      </main>

      <Contact />
    </>
  );
}
