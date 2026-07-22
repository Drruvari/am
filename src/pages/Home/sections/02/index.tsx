import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const slides = [
  {
    stat: "01:01",
    proof:
      "Every commission stays in my hands from the first conversation onward",
  },
  {
    stat: "Tirana",
    proof:
      "Independent practice rooted in Albania and open to projects beyond it",
  },
] as const;

export default function PracticeOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    const tween = gsap.fromTo(
      progress,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 6,
        ease: "none",
        onComplete: () => {
          setActiveSlide((current) => (current + 1) % slides.length);
        },
      },
    );

    return () => {
      tween.kill();
    };
  }, [activeSlide]);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

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

          <aside className="featured-project__rail">
            <div className="featured-project__progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>

            <div className="featured-project__controls">
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous practice note"
              >
                ←
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next practice note"
              >
                →
              </button>
              <span className="featured-project__count mono" aria-live="polite">
                {String(activeSlide + 1).padStart(2, "0")}/
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="featured-project__proof" aria-live="polite">
              {slides.map((slide, index) => (
                <div
                  key={slide.stat}
                  className="featured-project__proof-slide"
                  data-active={index === activeSlide}
                  aria-hidden={index !== activeSlide}
                >
                  <strong>{slide.stat}</strong>
                  <p>{slide.proof}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="featured-project__copy">
            <p className="featured-project__statement">
              Each project starts with close attention: how the site changes
              through the day, how life moves through it, and what deserves to
              remain untouched.
            </p>

            <p className="featured-project__statement featured-project__statement--secondary">
              Architecture follows from those observations—quiet in gesture,
              exact in proportion, and grounded in material reality.
            </p>

            <div className="featured-project__signature">
              <span className="featured-project__avatar" aria-hidden="true">
                AM
              </span>
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
