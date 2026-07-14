import { SectionEyebrow } from "@/components/SectionHeader";
import { archImage } from "@/lib/images";

export default function About() {
  return (
    <section className="architect-about" id="about">
      <div className="architect-about__image">
        <img
          src={archImage}
          alt="Architectural studio detail"
          width={5413}
          height={2692}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="architect-about__content">
        <SectionEyebrow className="architect-about__eyebrow">
          07 — About
        </SectionEyebrow>

        <h2>Arbër Manga</h2>

        <p>
          Independent architect based in Tirana, working across private
          residences, refined interiors, and cultural spatial studies.
        </p>

        <div className="architect-about__facts mono">
          <span>Tirana, Albania</span>
          <span>Residential / Interior / Cultural</span>
          <span>Light, context, material, restraint</span>
        </div>
      </div>
    </section>
  );
}
