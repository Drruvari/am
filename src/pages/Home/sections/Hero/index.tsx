import { heroImage } from "@/lib/images";
import { useLayoutEffect, useRef } from "react";
import HeroCanvas from "./HeroCanvas";
import "./style.scss";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleTextRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    const text = titleTextRef.current;
    if (!title || !text) return;

    const fitTitle = () => {
      const naturalWidth = text.offsetWidth;
      if (naturalWidth > 0) {
        const safeWidth = Math.max(0, title.clientWidth - 32);
        text.style.setProperty(
          "--banner-title-scale",
          `${safeWidth / naturalWidth}`,
        );
      }
    };
    const observer = new ResizeObserver(fitTitle);

    observer.observe(title);
    document.fonts?.ready.then(fitTitle);
    fitTitle();

    return () => observer.disconnect();
  }, []);

  return (
    <section className="banner" id="hero">
      <img
        className="banner-media"
        src={heroImage}
        alt=""
        width={6446}
        height={3635}
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <HeroCanvas image={heroImage} />
      <div className="banner-shade" aria-hidden="true" />
      <div className="banner-mask" aria-hidden="true" />

      <div className="banner-descr split">
        <span className="banner-reveal">
          <span className="banner-descr__lead">
            Architecture shaped through light, proportion, and the particular
            character of each site.
          </span>
          <span className="banner-descr__aside">
            Direct collaboration from first sketch to built detail.
          </span>
        </span>
      </div>

      <h1 ref={titleRef} className="banner-title split" id="heroTitle">
        <span className="banner-title__mask">
          <span className="banner-reveal">
            <span ref={titleTextRef} className="banner-title__text">
              ARBËR MANGA
            </span>
          </span>
        </span>
      </h1>
    </section>
  );
}
