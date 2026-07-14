import "./style.scss";

export default function Hero() {
  return (
    <section className="banner" id="hero">
      <div className="banner-mask" aria-hidden="true" />

      <div className="banner-text split">Inspired house solutions</div>

      <div className="banner-title split" id="heroTitle">
        Your home, your reflect/on.
      </div>

      <div className="banner-descr split">
        Independent residential, interior, and spatial studies focused on
        restraint, proportion, and atmosphere.
      </div>
    </section>
  );
}
