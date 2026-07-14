import { SectionEyebrow } from "@/components/SectionHeader";
import { archImage } from "@/lib/images";

export default function About() {
  return (
    <section className="architect-about" id="about">
      <div className="architect-about__image" data-reveal="mask">
        <img
          src={archImage}
          alt="Architectural studio detail"
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
          07 — About
        </SectionEyebrow>

        <h2 data-split-lines>Arbër Manga</h2>

        <p data-reveal="up" data-reveal-group="about-copy">
          Independent architect based in Tirana, working across private
          residences, refined interiors, and cultural spatial studies.
        </p>

        <div
          className="architect-about__facts mono"
          data-reveal="up"
          data-reveal-group="about-copy"
        >
          <span>Tirana, Albania</span>
          <span>Residential / Interior / Cultural</span>
          <span>Light, context, material, restraint</span>
        </div>
      </div>
    </section>
  );
}
