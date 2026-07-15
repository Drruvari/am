import "./style.scss";
import PhantomImageTrail from "./PhantomImageTrail";

export default function Hero() {
  return (
    <section className="banner" id="hero">
      <div className="banner-mask" aria-hidden="true" />
      <PhantomImageTrail />

      <div className="banner-text split">
        <span className="banner-reveal">Inspired house solutions</span>
      </div>

      <div className="banner-title split" id="heroTitle">
        <span className="banner-reveal">Your home, your reflect/on.</span>
      </div>

      <div className="banner-descr split">
        <span className="banner-reveal">
          Independent residential, interior, and spatial studies focused on
          restraint, proportion, and atmosphere.
        </span>
      </div>
    </section>
  );
}
