import { projects } from "@/data/projects";
import { archImage } from "@/lib/images";
import "./style.scss";

const featuredProject = projects.flatMap((row) => row.items)[0];

export default function FeaturedProject() {
  return (
    <section className="featured-project collection" id="featured-project">
      <div
        className="featured-project__mask collection-mask"
        aria-hidden="true"
      />

      <div className="featured-project__media slider">
        <div className="slider-wrapp">
          <div className="featured-project__slide slider-img">
            <img
              src={archImage}
              alt={featuredProject.alt}
              width={5413}
              height={2692}
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <div
              className="featured-project__gradient slider-gradient"
              aria-hidden="true"
            />
          </div>

        </div>

        <p className="featured-project__eyebrow slider-descr">
          Featured project
        </p>

        <div className="featured-project__title-track slider-title">
          <h2 className="featured-project__title slider-title__item">
            {featuredProject.title}
          </h2>
        </div>

        <a className="featured-project__link" href="#work">
          View project
        </a>

        <p className="featured-project__scroll" aria-hidden="true">
          [Scroll down]
        </p>

        <p className="featured-project__statement">
          AM Architecture is defined by strong, solid forms with subtle
          elegance, natural balance and enduring appeal.
        </p>
      </div>
    </section>
  );
}
