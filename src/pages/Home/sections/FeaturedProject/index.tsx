import collectionImagePrimary from "@/assets/images/unsplash-collection-a.jpg";
import { projects } from "@/data/projects";

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
              src={collectionImagePrimary}
              alt={featuredProject.alt}
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

        </div>

        <p className="featured-project__eyebrow slider-descr">
          Our considered collection of residential studies
        </p>

        <div className="featured-project__title-track slider-title">
          <h2 className="featured-project__title slider-title__item">
            {featuredProject.title}
          </h2>
        </div>
      </div>
    </section>
  );
}
