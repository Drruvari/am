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
              yPercent: 12,
              rotate: 2,
              transformOrigin: "0% 50%",
            },
            {
              yPercent: 0,
              rotate: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: block,
                start: "top 92%",
                end: "bottom 38%",
                scrub: 1.4,
              },
            },
          );

          gsap.fromTo(
            split.words,
            {
              filter: "blur(7px)",
              opacity: 0.06,
              yPercent: 24,
              willChange: "filter, opacity",
            },
            {
              filter: "blur(0px)",
              opacity: 1,
              yPercent: 0,
              stagger: 0.09,
              ease: "power2.out",
              scrollTrigger: {
                trigger: block,
                start: "top 88%",
                end: "bottom 32%",
                scrub: 1.6,
              },
            },
          );
        });

        gsap.from(
          [
            ".featured-project__marker",
            ".featured-project__label",
            ".featured-project__details",
          ],
          {
            y: 40,
            autoAlpha: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".featured-project__details",
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
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
      data-header-theme="dark"
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
