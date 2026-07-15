import { useEffect, useRef } from "react";
import gsap from "gsap";

const TRIGGER_DISTANCE = 56;
const SMOOTHING = 0.18;
const TRAIL_IMAGES = [
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80",
] as const;

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
    let smoothX = 0;
    let smoothY = 0;
    let hasPointerPosition = false;

    const showImage = (event: PointerEvent) => {
      if (!hasPointerPosition) {
        smoothX = event.clientX;
        smoothY = event.clientY;
        hasPointerPosition = true;
      } else {
        smoothX += (event.clientX - smoothX) * SMOOTHING;
        smoothY += (event.clientY - smoothY) * SMOOTHING;
      }

      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);

      if (distance < TRIGGER_DISTANCE) return;

      const image = imagesRef.current[imageIndex];

      if (!image) return;

      const bounds = root.getBoundingClientRect();
      const startX = smoothX - bounds.left - image.offsetWidth / 2;
      const startY = smoothY - bounds.top - image.offsetHeight / 2;
      const endX = event.clientX - bounds.left - image.offsetWidth / 2;
      const endY = event.clientY - bounds.top - image.offsetHeight / 2;

      gsap.killTweensOf(image);
      gsap
        .timeline()
        .set(image, {
          autoAlpha: 1,
          x: startX,
          y: startY,
          scale: 0.35,
          rotation: gsap.utils.random(-20, 20),
          zIndex,
        })
        .to(image, {
          scale: 1,
          rotation: 0,
          x: endX,
          y: endY,
          duration: 0.9,
          ease: "expo.out",
        })
        .to(
          image,
          {
            autoAlpha: 0,
            scale: 0,
            rotation: gsap.utils.random(-12, 12),
            duration: 0.8,
            ease: "power4.inOut",
          },
          0.35,
        );

      lastX = event.clientX;
      lastY = event.clientY;
      zIndex += 1;
      imageIndex = (imageIndex + 1) % TRAIL_IMAGES.length;

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
      {TRAIL_IMAGES.map((src, index) => (
        <img
          key={src}
          ref={(image) => {
            imagesRef.current[index] = image;
          }}
          src={src}
          alt=""
          draggable={false}
        />
      ))}
    </div>
  );
}
