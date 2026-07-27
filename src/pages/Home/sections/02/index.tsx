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
      const paragraphs = gsap.utils.toArray<HTMLElement>(
        ".featured-project__statement",
      );
      const splits = paragraphs.map((paragraph) =>
        SplitText.create(paragraph, { type: "words" }),
      );

      if (reducedMotion) {
        gsap.set(
          splits.flatMap((split) => split.words),
          { opacity: 1 },
        );
      } else {
        splits.forEach((split, index) => {
          gsap.fromTo(
            split.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: {
                trigger: paragraphs[index],
                start: "top 82%",
                end: "bottom 48%",
                scrub: 1,
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

          <p className="featured-project__statement">
            I shape architecture around the rhythms of a site—light, movement,
            material, and the lives held within it.
          </p>

          <p className="featured-project__label mono">(Practice)</p>

          <div className="featured-project__details">
            <p className="featured-project__intro">
              Every project begins by understanding what is already there.
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
