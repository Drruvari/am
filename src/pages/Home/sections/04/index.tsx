import arrow from "@/assets/arrow.svg";
import { projects } from "@/data/projects";
import { useRef } from "react";
import { imageSources, sections } from "./content";
import "./style.scss";

const videoSources = [
  `${import.meta.env.BASE_URL}assets/video/coastal-study.mp4`,
  `${import.meta.env.BASE_URL}assets/video/model-study.mp4`,
  `${import.meta.env.BASE_URL}assets/video/material-study.mp4`,
  `${import.meta.env.BASE_URL}assets/video/drafting-study.mp4`,
] as const;

type ProjectMediaProps = {
  index: number;
  title: string;
};

function ProjectMedia({ index, title }: ProjectMediaProps) {
  const image = imageSources[index];
  const video = videoSources[index % videoSources.length];
  const videoRef = useRef<HTMLVideoElement>(null);

  const playPreview = () => {
    void videoRef.current?.play().catch(() => undefined);
  };

  const stopPreview = () => {
    const element = videoRef.current;
    if (!element) return;
    element.pause();
    element.currentTime = 0;
  };

  return (
    <figure
      className="selected-works__media"
      data-hover="link"
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
    >
      <div className="selected-works__media-parallax" data-parallax="5">
        <img src={image} alt={title} loading={index === 0 ? "eager" : "lazy"} />
      </div>
      <div className="selected-works__video-frame" aria-hidden="true">
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </figure>
  );
}

export default function SelectedWorks() {
  return (
    <section id="work" className="selected-works">
      <header className="selected-works__header">
        <h2>Selected Works</h2>
        <p>
          Homes, adaptations, and rooms shaped by site, material, and everyday
          life.
        </p>
        <span className="mono">(Projects)</span>
      </header>

      <div className="selected-works__list">
        {sections.map((project, index) => (
          <article className="selected-works__story" key={project.number}>
            <ProjectMedia index={index} title={project.title} />

            <div className="selected-works__info">
              <p className="selected-works__index mono">
                Project — {project.number}/
                {String(sections.length).padStart(2, "0")}
              </p>
              <h3>{project.title}</h3>
              <p className="selected-works__description">
                {project.description}
              </p>
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
        <img src={arrow} alt="" aria-hidden="true" />
        <strong>View all projects</strong>
        <span>({String(projects.length).padStart(2, "0")})</span>
      </a>
    </section>
  );
}
