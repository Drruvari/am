import { useEffect, useRef } from "react";
import gsap from "gsap";

const TRAIL_SIZE = 12;
const TRIGGER_DISTANCE = 85;

export default function PhantomImageTrail() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.parentElement;

    if (
      !root ||
      !hero ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let imageIndex = 0;
    let zIndex = 1;
    let lastX = -9999;
    let lastY = -9999;

    const showImage = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);

      if (distance < TRIGGER_DISTANCE) return;

      const image = imagesRef.current[imageIndex];

      if (!image) return;

      const bounds = root.getBoundingClientRect();
      const x = event.clientX - bounds.left - image.offsetWidth / 2;
      const y = event.clientY - bounds.top - image.offsetHeight / 2;

      gsap.killTweensOf(image);
      gsap
        .timeline()
        .set(image, {
          autoAlpha: 1,
          x,
          y,
          scale: 0.2,
          rotation: gsap.utils.random(-28, 28),
          zIndex,
        })
        .to(image, {
          scale: 1,
          rotation: 0,
          duration: 0.75,
          ease: "expo.out",
        })
        .to(
          image,
          {
            autoAlpha: 0,
            scale: 0,
            rotation: gsap.utils.random(-12, 12),
            duration: 0.65,
            ease: "power4.inOut",
          },
          0.35,
        );

      lastX = event.clientX;
      lastY = event.clientY;
      zIndex += 1;
      imageIndex = (imageIndex + 1) % TRAIL_SIZE;

      if (zIndex > 1000) zIndex = 1;
    };

    hero.addEventListener("pointermove", showImage);

    return () => {
      hero.removeEventListener("pointermove", showImage);
      imagesRef.current.forEach((image) => gsap.killTweensOf(image));
    };
  }, []);

  return (
    <div ref={rootRef} className="phantom-trail" aria-hidden="true">
      {Array.from({ length: TRAIL_SIZE }, (_, index) => (
        <img
          key={index}
          ref={(image) => {
            imagesRef.current[index] = image;
          }}
          src="/assets/images/arch.jpg"
          alt=""
          draggable={false}
        />
      ))}
    </div>
  );
}
