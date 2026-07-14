import { projects } from "@/data/projects";
import ProjectCard, { ProjectPanel } from "../Work/ProjectCard";
import "../Work/style.scss";

const selectedProjects = projects.flatMap((row) => row.items).slice(0, 6);

export default function SelectedWorks() {
  return (
    <>
      <section className="selected-works" id="work">
        <div className="selected-works__intro">
          <p className="selected-works__eyebrow eyebrow mono">
            04 — Selected Works
          </p>

          <h2 className="selected-works__title">
            Selected
            <br />
            Works
          </h2>

          <p className="selected-works__lede">
            A concise portfolio preview of residential, interior, cultural, and
            conceptual spatial studies.
          </p>
        </div>

        <div className="selected-works__grid">
          {selectedProjects.map((project) => (
            <ProjectCard key={project.index} project={project} />
          ))}
        </div>
      </section>

      <ProjectPanel />
    </>
  );
}
