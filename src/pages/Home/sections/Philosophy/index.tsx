import { useGSAP } from "@gsap/react";
import { archImage } from "@/lib/images";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const philosophyImages = [
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  archImage,
] as const;

const IMAGE_CYCLE_INTERVAL = 2.35;

export default function Philosophy() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const stage = root.querySelector<HTMLElement>(".philosophy__stage");
      const leftHeadline = root.querySelector<HTMLElement>(
        ".philosophy__headline--left",
      );
      const rightHeadline = root.querySelector<HTMLElement>(
        ".philosophy__headline--right",
      );
      const image = root.querySelector<HTMLElement>(".philosophy__image");
      const imageItems = gsap.utils.toArray<HTMLElement>(
        ".philosophy__image-item",
        root,
      );
      const copy = root.querySelector<HTMLElement>(".philosophy__copy");

      if (
        !stage ||
        !leftHeadline ||
        !rightHeadline ||
        !image ||
        !copy ||
        imageItems.length === 0
      ) {
        return;
      }

      const media = gsap.matchMedia();

      const setupDesktop = () => {
        // Hide type immediately so nothing flashes before scroll
        gsap.set([leftHeadline, rightHeadline], { autoAlpha: 1 });
        gsap.set(copy, { y: 24, autoAlpha: 0 });
        gsap.set(image, {
          scale: 1,
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(imageItems, {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          autoAlpha: 0,
        });
        gsap.set(imageItems[0], { autoAlpha: 1 });

        const leftSplit = SplitText.create(leftHeadline, {
          type: "chars",
          charsClass: "philosophy__char",
        });
        const rightSplit = SplitText.create(rightHeadline, {
          type: "chars",
          charsClass: "philosophy__char",
        });
        const leftChars = leftSplit.chars;
        const rightChars = rightSplit.chars;
        const chars = [...leftChars, ...rightChars];

        gsap.set(chars, { opacity: 0 });
        gsap.set(leftHeadline, { xPercent: -40 });
        gsap.set(rightHeadline, { xPercent: 40 });

        root.classList.add("is-motion-ready");

        let activeIndex = 0;
        let cycleCall: gsap.core.Tween | undefined;

        const stopCycle = () => {
          cycleCall?.kill();
          cycleCall = undefined;
        };

        const showImage = (nextIndex: number) => {
          if (nextIndex === activeIndex) return;

          gsap.to(imageItems[activeIndex], {
            autoAlpha: 0,
            duration: 0.55,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          gsap.to(imageItems[nextIndex], {
            autoAlpha: 1,
            duration: 0.55,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          activeIndex = nextIndex;
        };

        const startCycle = () => {
          stopCycle();
          const tick = () => {
            showImage((activeIndex + 1) % imageItems.length);
            cycleCall = gsap.delayedCall(IMAGE_CYCLE_INTERVAL, tick);
          };
          cycleCall = gsap.delayedCall(IMAGE_CYCLE_INTERVAL, tick);
        };

        const syncCycle = (self: ScrollTrigger) => {
          if (self.isActive) startCycle();
          else stopCycle();
        };

        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onEnter: startCycle,
          onEnterBack: startCycle,
          onLeave: stopCycle,
          onLeaveBack: stopCycle,
          onRefresh: syncCycle,
        });

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
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: -1,
            onRefresh: stackCover,
            onEnter: stackCover,
            onEnterBack: stackCover,
          });

          // Featured Project (top): rises, zooms out, fades as Philosophy covers it
          gsap.fromTo(
            previousSurface,
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              transformOrigin: "50% 50%",
            },
            {
              yPercent: -10,
              scale: 0.97,
              opacity: 0.35,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "top top",
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        gsap.fromTo(
          stage,
          { borderRadius: "22px 22px 0 0" },
          {
            borderRadius: "0px 0px 0 0",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "top top",
              scrub: 0.45,
            },
          },
        );

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Letter-by-letter reveal (left then right), driven only by scroll
        timeline
          .to(
            leftChars,
            {
              opacity: 1,
              stagger: 0.05,
              duration: 0.42,
            },
            0.02,
          )
          .to(
            rightChars,
            {
              opacity: 1,
              stagger: 0.05,
              duration: 0.42,
            },
            0.08,
          )
          // Headlines ease toward the image while letters appear
          .to(leftHeadline, { xPercent: 0, duration: 0.4 }, 0)
          .to(rightHeadline, { xPercent: 0, duration: 0.4 }, 0)
          .to(copy, { y: 0, autoAlpha: 1, duration: 0.16 }, 0.34)
          .to(leftHeadline, { xPercent: 5, duration: 0.28 }, 0.58)
          .to(rightHeadline, { xPercent: -5, duration: 0.28 }, 0.58);

        return () => {
          stopCycle();
          root.classList.remove("is-motion-ready");
          leftSplit.revert();
          rightSplit.revert();
        };
      };

      media.add(
        "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Pre-hide before fonts so type never shows early
          gsap.set([leftHeadline, rightHeadline, copy], { autoAlpha: 0 });
          gsap.set(image, {
            scale: 1,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            transformOrigin: "50% 50%",
          });

          let disposed = false;
          let cleanupDesktop: (() => void) | undefined;
          const fontsReady = document.fonts?.ready ?? Promise.resolve();

          fontsReady.then(() => {
            if (disposed) return;
            cleanupDesktop = setupDesktop();
            ScrollTrigger.refresh();
          });

          return () => {
            disposed = true;
            cleanupDesktop?.();
          };
        },
      );

      media.add("(max-width: 768px), (prefers-reduced-motion: reduce)", () => {
        root.classList.add("is-motion-ready");
        gsap.set([leftHeadline, rightHeadline, image, imageItems, copy], {
          clearProps: "all",
        });
        gsap.set(imageItems.slice(1), { autoAlpha: 0 });
        gsap.set(imageItems[0], { autoAlpha: 1 });
        gsap.set(copy, { autoAlpha: 1 });
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="philosophy" id="philosophy">
      <div className="philosophy__stage">
        <div className="philosophy__composition">
          <h2 className="philosophy__headline philosophy__headline--left">
            We shape
          </h2>

          <figure className="philosophy__image">
            {philosophyImages.map((imageSrc, index) => (
              <img
                className={`philosophy__image-item philosophy__image-item--${["one", "two", "three"][index]}`}
                src={imageSrc}
                alt={
                  index === 0
                    ? "Grounded contemporary architecture framed by landscape"
                    : "Architecture study in material, light, and proportion"
                }
                width={1000}
                height={1000}
                loading="lazy"
                decoding="async"
                key={imageSrc}
              />
            ))}
          </figure>

          <h2 className="philosophy__headline philosophy__headline--right">
            lasting space
          </h2>
        </div>

        <p className="philosophy__copy">
          We begin with land, light, and the rhythms of everyday life—then
          refine structure, material, and proportion until each place feels
          clear, calm, and inevitable.
        </p>
      </div>
    </section>
  );
}
