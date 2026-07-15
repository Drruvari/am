import { archImage } from "@/lib/images";
import "./style.scss";

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="philosophy__top">
        <figure className="philosophy__image" data-reveal="mask">
          <img
            src={archImage}
            alt="Concrete architecture detail"
            loading="lazy"
            decoding="async"
            data-parallax="6"
          />
        </figure>

        <p className="philosophy__eyebrow" data-reveal="fade">
          <span className="philosophy__eyebrow-number">01</span>
          Philosophy
        </p>

        <p className="philosophy__intro" data-reveal="up-large">
          Working across Albania and the Mediterranean, we design with close
          attention to land, climate, craft, and the lives each place will hold.
        </p>
      </div>

      <div className="philosophy__body">
        <p data-animate="philosophy-line">
          AM is a Tirana-based architecture studio shaping grounded spaces
          through strong form, natural balance, and lasting material character.
        </p>
      </div>

      <div className="philosophy__footer">
        <p
          className="philosophy__label"
          data-reveal="up"
          data-reveal-group="philosophy-footer"
        >
          Architecture
          <br />
          &amp; Interior Design
        </p>

        <p
          className="philosophy__detail"
          data-reveal="up"
          data-reveal-group="philosophy-footer"
        >
          From private homes and interiors to cultural and hospitality spaces,
          each project begins with context and is refined through proportion,
          light, and honest materials.
        </p>
      </div>
    </section>
  );
}
