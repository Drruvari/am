import Silk from "@/components/Silk";
import TextPressure from "@/components/TextPressure";
import "./style.scss";

export default function Hero() {
  return (
    <section className="banner" id="hero">
      <div className="banner-media" aria-hidden="true">
        <Silk noiseIntensity={0.35} />
      </div>
      <div className="banner-shade" aria-hidden="true" />
      <div className="banner-mask" aria-hidden="true" />

      <div className="banner-descr split">
        <span className="banner-reveal">
          <span className="banner-descr__lead">
            I shape architecture through light, proportion, and the particular
            character of each site.
          </span>
          <span className="banner-descr__aside">
            <span>From first sketch to built detail.</span>
          </span>
        </span>
      </div>

      <div className="banner-title split" id="heroTitle">
        <TextPressure
          characterClassName="banner-title__char"
          className="banner-title__text"
          text="ARBËR MANGA"
          textColor="var(--color-on-dark)"
        />
      </div>
    </section>
  );
}
