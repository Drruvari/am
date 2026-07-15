import { useGSAP } from "@gsap/react";
import { archImage } from "@/lib/images";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Philosophy() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from('[data-animate="philosophy-line"]', {
          yPercent: 45,
          autoAlpha: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 72%",
            once: true,
          },
        });

        gsap.fromTo(
          ".philosophy__image img",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ".philosophy__image",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="philosophy" id="philosophy">
      <div className="philosophy__top">
        <figure className="philosophy__image" data-reveal="mask">
          <img
            src={archImage}
            alt="Concrete architecture detail"
            loading="lazy"
            decoding="async"
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
