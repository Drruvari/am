import { useEffect, useRef } from "react";
import Silk from "@/components/Silk";
import "./style.scss";

const heroTitle = "Architecture";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!hero || !title || reducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame: number | undefined;

    const renderShadow = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      title.style.setProperty("--hero-shadow-x", `${currentX}px`);
      title.style.setProperty("--hero-shadow-y", `${currentY}px`);
      title.style.setProperty("--hero-shadow-soft-x", `${currentX * 0.45}px`);
      title.style.setProperty("--hero-shadow-soft-y", `${currentY * 0.45}px`);

      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        frame = window.requestAnimationFrame(renderShadow);
      } else {
        currentX = targetX;
        currentY = targetY;
        frame = undefined;
      }
    };

    const startShadowAnimation = () => {
      if (frame === undefined) {
        frame = window.requestAnimationFrame(renderShadow);
      }
    };

    const updateShadow = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const bounds = title.getBoundingClientRect();
      targetX = Math.max(
        -28,
        Math.min(28, (event.clientX - (bounds.left + bounds.width / 2)) / -28),
      );
      targetY = Math.max(
        -20,
        Math.min(20, (event.clientY - (bounds.top + bounds.height / 2)) / -28),
      );
      startShadowAnimation();
    };

    const resetShadow = () => {
      targetX = 0;
      targetY = 0;
      startShadowAnimation();
    };

    hero.addEventListener("pointermove", updateShadow);
    hero.addEventListener("pointerleave", resetShadow);

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", updateShadow);
      hero.removeEventListener("pointerleave", resetShadow);
    };
  }, []);

  return (
    <section className="banner" id="hero" ref={heroRef} data-header-theme="dark">
      <div className="banner-media" aria-hidden="true">
        <Silk noiseIntensity={0.35} />
      </div>
      <div className="banner-shade" aria-hidden="true" />
      <div className="banner-mask" aria-hidden="true" />

      <div className="banner-descr split">
        <p className="banner-descr__lead">
          Architecture shaped through light, proportion, and the particular
          character of each site.
        </p>
        <p className="banner-descr__aside">
          Direct collaboration from first sketch to built detail on everything.
        </p>
      </div>

      <h1 className="banner-title split" id="heroTitle" ref={titleRef}>
        <span className="banner-title__text">
          {Array.from(heroTitle).map((character, index) => (
            <span className="banner-title__char" key={`${character}-${index}`}>
              {character === " " ? "\u00a0" : character}
            </span>
          ))}
        </span>
      </h1>

      <a className="banner-scroll" href="#work" data-hover="link">
        <span aria-hidden="true">[</span>
        Scroll down
        <span aria-hidden="true">]</span>
      </a>
    </section>
  );
}
