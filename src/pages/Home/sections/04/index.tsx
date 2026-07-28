import arrow from "@/assets/arrow.svg";
import { projects } from "@/data/projects";
import { useEffect, useRef } from "react";
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
  const mediaRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const touchQuery = window.matchMedia(
      "(max-width: 768px), (hover: none), (pointer: coarse)",
    );
    if (!touchQuery.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting;
        media.classList.toggle("is-scroll-active", active);

        if (active) {
          playPreview();
        } else {
          stopPreview();
        }
      },
      {
        rootMargin: "-28% 0px -28%",
        threshold: 0.2,
      },
    );

    observer.observe(media);

    return () => {
      observer.disconnect();
      media.classList.remove("is-scroll-active");
      stopPreview();
    };
  }, []);

  return (
    <figure
      ref={mediaRef}
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
        <h2>Works</h2>
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

      <a
        className="selected-works__more"
        href={`${import.meta.env.BASE_URL}process`}
        data-hover="link"
      >
        <img src={arrow} alt="" aria-hidden="true" />
        <strong>View all projects</strong>
        <span>({String(projects.length).padStart(2, "0")})</span>
      </a>
    </section>
  );
}
