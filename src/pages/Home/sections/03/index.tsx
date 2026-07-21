import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const services = [
  "Residential architecture",
  "Spatial interiors",
  "Adaptive reuse",
  "Early-stage strategy",
  "Approvals and coordination",
  "Visual studies",
];

export default function Philosophy() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const stage = root.querySelector<HTMLElement>(".philosophy__stage");
      const serviceText = root.querySelector<HTMLElement>(
        ".philosophy__services-text",
      );

      if (!stage || !serviceText) return;

      const media = gsap.matchMedia();

      const setupMotion = (context: gsap.Context) => {
        const isNarrow = context.conditions?.narrow ?? false;
        const pinType = ScrollTrigger.isTouch === 1 ? "transform" : "fixed";
        const scrollEnd = isNarrow ? "+=140%" : "+=175%";
        const radiusFrom = isNarrow ? "16px 16px 0 0" : "22px 22px 0 0";

        const textSplit = SplitText.create(serviceText, {
          type: "chars",
          charsClass: "philosophy__char",
        });
        const characters = textSplit.chars;

        gsap.set(serviceText, { autoAlpha: 1, xPercent: 0 });
        gsap.set(characters, { autoAlpha: 1 });

        root.classList.add("is-motion-ready");

        if (isNarrow) {
          gsap.set(serviceText, { clearProps: "transform" });
          gsap.fromTo(
            characters,
            { yPercent: 45, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.012,
              ease: "power3.out",
              scrollTrigger: {
                trigger: root,
                start: "top 72%",
                once: true,
              },
            },
          );

          gsap.fromTo(
            stage,
            { borderRadius: radiusFrom },
            {
              borderRadius: "0px",
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "top 35%",
                scrub: true,
              },
            },
          );

          return () => {
            root.classList.remove("is-motion-ready");
            textSplit.revert();
          };
        }

        const previous = root.previousElementSibling;
        if (previous instanceof HTMLElement) {
          const previousSurface =
            previous.querySelector<HTMLElement>(".featured-project__surface") ??
            previous;
          const stackCover = () => {
            gsap.set(previous, { zIndex: 1 });
            gsap.set(root, { zIndex: 5 });
          };

          ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "top top",
            pin: previous,
            pinSpacing: false,
            pinType,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 2,
            onRefresh: stackCover,
            onEnter: stackCover,
            onEnterBack: stackCover,
          });

          gsap.fromTo(
            previousSurface,
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              transformOrigin: "50% 50%",
            },
            {
              yPercent: isNarrow ? -6 : -10,
              scale: 0.97,
              opacity: 0.35,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "top top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        gsap.fromTo(
          stage,
          { borderRadius: radiusFrom },
          {
            borderRadius: "0px 0px 0 0",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          },
        );

        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: scrollEnd,
          pin: true,
          pinType,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        });

        const scrollTween = gsap.to(serviceText, {
          xPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: scrollEnd,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        characters.forEach((character) => {
          gsap.from(character, {
            yPercent: gsap.utils.random(-200, 200),
            rotation: gsap.utils.random(-20, 20),
            ease: "elastic.out(1, 0.8)",
            scrollTrigger: {
              trigger: character,
              containerAnimation: scrollTween,
              start: "left 100%",
              end: "left 30%",
              scrub: 1,
            },
          });
        });

        return () => {
          root.classList.remove("is-motion-ready");
          textSplit.revert();
        };
      };

      // Same motion on all viewports — only reduced-motion opts out.
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 768px)",
          wide: "(min-width: 769px)",
        },
        (context) => {
          if (!context.conditions?.motion) return;

          gsap.set(serviceText, { autoAlpha: 0 });

          let disposed = false;
          let cleanupMotion: (() => void) | undefined;
          const fontsReady = document.fonts?.ready ?? Promise.resolve();

          fontsReady.then(() => {
            if (disposed) return;
            cleanupMotion = setupMotion(context);
            ScrollTrigger.refresh();
          });

          return () => {
            disposed = true;
            cleanupMotion?.();
          };
        },
      );

      media.add("(prefers-reduced-motion: reduce)", () => {
        root.classList.add("is-motion-ready");
        gsap.set(serviceText, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="philosophy" id="services">
      <div className="philosophy__stage">
        <h2 className="philosophy__services-text">{services.join(". ")}</h2>
      </div>
    </section>
  );
}
