import { heroImage } from "@/lib/images";
import "./style.scss";

export default function Hero() {
  return (
    <section className="banner" id="hero">
      <img
        className="banner-media"
        src={heroImage}
        alt=""
        width={1132}
        height={750}
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <div className="banner-shade" aria-hidden="true" />
      <div className="banner-mask" aria-hidden="true" />

      <div className="banner-descr split">
        <span className="banner-reveal">
          <span className="banner-descr__lead">
            Architecture shaped through light, proportion, and the particular
            character of each site.
          </span>
          <span className="banner-descr__aside">
            <span>Direct collaboration from first sketch to built detail.</span>
          </span>
        </span>
      </div>

      <a className="banner-scroll" href="#featured-project" data-hover="link">
        [Scroll down]
      </a>

      <h1 className="banner-title split" id="heroTitle">
        <span className="banner-title__mask">
          <span className="banner-reveal">
            <span className="banner-title__text">
              SHAPING SPACE
            </span>
          </span>
        </span>
      </h1>
    </section>
  );
}
