import { SectionEyebrow } from "@/components/SectionHeader";
import { archImage } from "@/lib/images";
import "./style.scss";

export default function About() {
  return (
    <section className="architect-about" id="about">
      <div className="architect-about__image" data-reveal="mask">
        <img
          src={archImage}
          alt="Material and light study by Arbër Manga"
          width={5413}
          height={2692}
          loading="lazy"
          decoding="async"
          data-parallax="8"
        />
      </div>

      <div className="architect-about__content">
        <SectionEyebrow
          className="architect-about__eyebrow"
          data-reveal="fade"
          data-reveal-group="about-copy"
        >
          05 — About Me
        </SectionEyebrow>

        <h2 data-split-lines>Arbër Manga</h2>

        <p data-reveal="up" data-reveal-group="about-copy">
          I am an independent architect based in Tirana. My work moves between
          houses, interiors, adaptive reuse, and small cultural commissions,
          with direct involvement at every stage.
        </p>

        <div
          className="architect-about__facts mono"
          data-reveal="up"
          data-reveal-group="about-copy"
        >
          <span>Based in Tirana, Albania</span>
          <span>Architecture / Interiors / Reuse</span>
          <span>My direction, close collaboration</span>
        </div>
      </div>
    </section>
  );
}
