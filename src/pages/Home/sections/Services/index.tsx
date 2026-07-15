import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useLayoutEffect, useMemo, useRef } from "react";

const services = [
  "Architecture",
  "Interior design",
  "Renovation",
  "Concept design",
  "Planning and permits",
  "3D visualization",
];

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const text = useMemo(() => services.join(". "), []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const textElement = textRef.current;
    const intro = introRef.current;

    if (!section || !textElement || !intro) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const split = SplitText.create(textElement, { type: "chars,words" });

      const rootStyles = getComputedStyle(document.documentElement);
      const lightBackground = rootStyles.getPropertyValue("--bg").trim();
      const darkBackground = rootStyles.getPropertyValue("--dark").trim();
      const darkText = rootStyles.getPropertyValue("--fg").trim();
      const lightText = rootStyles.getPropertyValue("--white").trim();
      const sticky = section.querySelector<HTMLElement>(".services__sticky");
      const outgoingSection = section.previousElementSibling as HTMLElement | null;

      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top 35%",
          scrub: true,
        },
      });

      transition.fromTo(
        sticky,
        { backgroundColor: lightBackground, color: darkText },
        { backgroundColor: darkBackground, color: lightText, ease: "none" },
        0,
      );

      if (outgoingSection) {
        transition.fromTo(
          outgoingSection,
          {
            backgroundColor: lightBackground,
            color: darkText,
            "--bg": lightBackground,
            "--fg": darkText,
          },
          {
            backgroundColor: darkBackground,
            color: lightText,
            "--bg": darkBackground,
            "--fg": lightText,
            ease: "none",
          },
          0,
        );
      }

      if (reducedMotion) {
        gsap.set(textElement, { xPercent: -82 });
        gsap.set(intro, { autoAlpha: 0 });
        return;
      }

      const scrollTween = gsap.to(textElement, {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom 70%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(intro, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120",
          scrub: true,
        },
      });

      split.chars.forEach((character) => {
        gsap.from(character, {
          yPercent: gsap.utils.random(-200, 200),
          rotation: gsap.utils.random(-20, 20),
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: character,
            containerAnimation: scrollTween,
            start: "left 100%",
            end: "left 30%",
            scrub: 0.4,
          },
        });
      });
    }, section);

    return () => context.revert();
  }, [text]);

  return (
    <section ref={sectionRef} className="services" id="services">
      <div className="services__sticky">
        <h3 ref={textRef} className="services__kinetic-text">
          {text}
        </h3>

        <div ref={introRef} className="services__cover">
          <div className="services__glow" />
          <div className="services__intro">
            <p className="services__kicker mono">03</p>
            <h2>Expertise</h2>
          </div>
          <span className="services__credit mono">gsap · splittext</span>
          <span className="services__bottom-rule" />
        </div>
      </div>
    </section>
  );
}
