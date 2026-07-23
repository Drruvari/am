import arrow from "@/assets/arrow.svg";
import { imageSources, sections } from "./content";
import "./style.scss";

type ProjectMediaProps = {
  index: number;
  title: string;
};

function ProjectMedia({ index, title }: ProjectMediaProps) {
  const image = imageSources[index];
  const preview = imageSources[(index + 1) % imageSources.length];

  return (
    <figure className="selected-works__media" data-hover="link">
      <div className="selected-works__media-parallax" data-parallax="5">
        <img
          src={image}
          alt={title}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
      <div className="selected-works__media-preview" aria-hidden="true">
        <img src={preview} alt="" />
      </div>
    </figure>
  );
}

export default function SelectedWorks() {
  return (
    <section id="work" className="selected-works">
      <header className="selected-works__header">
        <span className="selected-works__dot" aria-hidden="true" />
        <h2>Selected Works</h2>
      </header>

      <div className="selected-works__list">
        {sections.map((project, index) => (
          <article className="selected-works__story" key={project.number}>
            <ProjectMedia
              index={index}
              title={project.title}
            />

            <div className="selected-works__info">
              <p className="selected-works__index mono">
                SS — {project.number}/{String(sections.length).padStart(2, "0")}
              </p>
              <h3>{project.title}</h3>
              <p className="selected-works__description">{project.description}</p>
              <div className="selected-works__result">
                <strong>{project.metric}</strong>
                <p>{project.detail}</p>
              </div>
              <span className="selected-works__year mono">{project.year}</span>
            </div>
          </article>
        ))}
      </div>

      <a className="selected-works__more" href="#process" data-hover="link">
        <span>{String(sections.length).padStart(2, "0")}</span>
        <strong>View the Process</strong>
        <img src={arrow} alt="" aria-hidden="true" />
      </a>
    </section>
  );
}
