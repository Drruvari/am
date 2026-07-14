import collectionImagePrimary from "@/assets/images/unsplash-collection-a.jpg";
import collectionImageSecondary from "@/assets/images/unsplash-collection-b.jpg";
import { projects } from "@/data/projects";

const featuredProjects = projects.flatMap((row) => row.items).slice(0, 2);

export default function FeaturedProject() {
  const [primary, secondary] = featuredProjects;

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
              src={collectionImagePrimary}
              alt={primary.alt}
              width={1800}
              height={1224}
              loading="eager"
              decoding="async"
            />
            <div
              className="featured-project__gradient slider-gradient"
              aria-hidden="true"
            />
          </div>

          <div className="featured-project__slide slider-img active">
            <img
              src={collectionImageSecondary}
              alt={secondary.alt}
              width={1800}
              height={1200}
              loading="eager"
              decoding="async"
            />
            <div
              className="featured-project__gradient slider-gradient"
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="featured-project__eyebrow slider-descr">
          Our considered collection of residential studies
        </p>

        <div
          className="featured-project__title-track slider-title"
          aria-label={secondary.title}
        >
          <h2 className="featured-project__title slider-title__item">
            {primary.title}
          </h2>
          <div className="featured-project__title slider-title__item" />
          <h2 className="featured-project__title slider-title__item">
            {secondary.title}
          </h2>
        </div>

        <div
          className="featured-project__numeric slider-numeric"
          aria-label="Project 01 of 02, then project 02 of 02"
        >
          <div className="featured-project__numeric-active slider-numeric__active">
            <span className="slider-numeric__item">01</span>
            <span className="slider-numeric__item">02</span>
          </div>
          <span>-</span>
          <span className="slider-numeric__total">02</span>
        </div>
      </div>
    </section>
  );
}
