import arrow from "@/assets/arrow.svg";
import { archImage } from "@/lib/images";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function PracticeOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const textBlocks = gsap.utils.toArray<HTMLElement>(
        "[data-scroll-reveal]",
      );
      const splits = textBlocks.map((block) =>
        SplitText.create(block, {
          type: "words",
          wordsClass: "featured-project__word",
        }),
      );

      if (reducedMotion) {
        gsap.set(textBlocks, { clearProps: "transform" });
        gsap.set(splits.flatMap((split) => split.words), {
          clearProps: "filter,opacity,willChange",
        });
      } else {
        splits.forEach((split, index) => {
          const block = textBlocks[index];

          gsap.fromTo(
            block,
            {
              rotate: 3,
              transformOrigin: "0% 50%",
            },
            {
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            split.words,
            {
              filter: "blur(4px)",
              opacity: 0.1,
              willChange: "filter, opacity",
            },
            {
              filter: "blur(0px)",
              opacity: 1,
              stagger: 0.05,
              ease: "none",
              scrollTrigger: {
                trigger: block,
                start: "top 80%",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
        });
      }

      return () => splits.forEach((split) => split.revert());
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="featured-project collection"
      id="featured-project"
    >
      <div className="featured-project__surface">
        <div
          className="featured-project__mask collection-mask"
          aria-hidden="true"
        />

        <div className="featured-project__frame slider">
          <div
            className="featured-project__background slider-img"
            aria-hidden="true"
          />

          <div className="featured-project__marker" aria-hidden="true">
            <img src={arrow} alt="" />
          </div>

          <p className="featured-project__statement" data-scroll-reveal>
            Each project begins with close observation—reading the ground,
            tracing daily rituals, and turning constraints into spaces that
            belong.
          </p>

          <p className="featured-project__label mono">(Practice)</p>

          <div className="featured-project__details">
            <p className="featured-project__intro">
              What is already there becomes the first design material.
            </p>

            <div className="featured-project__body">
              <p>
                I study orientation, climate, existing structures, and patterns
                of daily life before drawing a line. Those observations become
                the foundation for spaces that feel specific rather than
                imposed.
              </p>
              <p>
                From the first sketch through site review, each decision is
                tested for clarity, proportion, and material purpose.
              </p>
            </div>

            <div className="featured-project__signature">
              <img
                className="featured-project__avatar"
                src={archImage}
                alt=""
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
              />
              <p>
                <strong>Arbër Manga</strong>
                <span>Architect, AM Architecture</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
