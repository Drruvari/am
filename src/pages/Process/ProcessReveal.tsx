import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const revealImages = [
  {
    className: "process-reveal__image process-reveal__image--site",
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=85",
  },
];

export default function ProcessReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) return;

      const media = gsap.matchMedia();

      media.add("(min-width: 769px)", () => {
        const halves = section.querySelectorAll<HTMLElement>(
          ".process-reveal__heading-half",
        );
        const contentItems = gsap.utils.toArray<HTMLElement>(
          ".process-reveal__eyebrow, .process-reveal__copy > *, .process-reveal__image",
          section,
        );

        if (halves.length < 2) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(halves[0], { yPercent: -52, ease: "power2.inOut" }, 0)
          .to(halves[1], { yPercent: 52, ease: "power2.inOut" }, 0)
          .fromTo(
            contentItems,
            { y: 36, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.055,
              duration: 0.62,
              ease: "power2.out",
            },
            0.14,
          );
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="process-reveal"
      aria-labelledby="process-reveal-title"
    >
      <div className="process-reveal__stage">
        <div className="process-reveal__header">
          <div
            className="process-reveal__heading-half process-reveal__heading-half--top"
            data-header-theme="light"
          >
            <h1 id="process-reveal-title">From idea to place.</h1>
          </div>
          <div
            className="process-reveal__heading-half process-reveal__heading-half--bottom"
            aria-hidden="true"
          >
            <p>From idea to place.</p>
          </div>
        </div>

        <div className="process-reveal__content" data-header-theme="dark">
          <span className="mono process-reveal__eyebrow">(My approach)</span>
          <div className="process-reveal__copy">
            <p>
              Every project begins by listening: to the site, to the brief, and
              to the way daily life needs to unfold.
            </p>
            <p>
              I carry one clear architectural idea through each decision, from
              the first sketch to the final built detail.
            </p>
          </div>

          <div className="process-reveal__images" aria-hidden="true">
            {revealImages.map((image) => (
              <img
                className={image.className}
                src={image.src}
                alt=""
                key={image.src}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
