import './style.scss'
import { archiveItems, projects } from '@/data/projects'
import { ResponsiveCardImage } from '@/lib/responsive-image'
import { projectGalleryImages } from '@/lib/images'
import type { Project } from '@/data/projects'

function ProjectCard({ project }: { project: Project }) {
  return (
    <button
      type="button"
      className={`project-card ${project.size}`}
      data-hover="view"
      data-title={project.title}
      data-loc={project.loc}
      data-desc={project.desc}
      data-index={project.index}
      data-type={project.type}
      data-status={project.status}
      data-scale={project.scale}
      data-year={project.year}
      data-materials={project.materials}
      data-note={project.note}
      data-images={projectGalleryImages.join('|')}
    >
      <span className="project-card__media">
        <ResponsiveCardImage alt={project.alt} />
      </span>
      <span className="project-card__label mono">{project.label}</span>
    </button>
  )
}

function ProjectPanel() {
  return (
    <div className="project-panel" id="project-panel">
      <div className="btn btn--pill btn--panel">
        <button
          className="project-panel__close mono"
          id="project-panel-close"
          type="button"
          data-hover="close"
        >
          <span className="btn__label">Close</span>
        </button>
      </div>
      <div className="project-panel__visual" id="project-panel-visual" />
      <div className="project-panel__info">
        <p className="mono project-panel__index" id="project-panel-index">
          A—01
        </p>
        <h3 id="project-panel-title">Project Title</h3>
        <p className="project-panel__location mono" id="project-panel-location">
          Location — Year
        </p>
        <p className="project-panel__description" id="project-panel-description">
          Project description goes here.
        </p>
        <div className="project-panel__meta mono" id="project-panel-meta">
          <div>
            <span>Typology</span>Residential
          </div>
          <div>
            <span>Status</span>Concept
          </div>
          <div>
            <span>Scale</span>420 SQM
          </div>
          <div>
            <span>Materials</span>Concrete
          </div>
        </div>
        <div className="project-panel__gallery" id="project-panel-gallery" />
      </div>
    </div>
  )
}

export default function Work() {
  return (
    <>
      <section className="archive work" id="work">
        <div className="archive__inner">
          <div className="archive__intro">
            <div className="archive__index mono">02 — Project Archive</div>
            <h2>
              SELECTED
              <br />
              STUDIES
            </h2>
            <p>
              Four studies arranged by atmosphere and massing. No campaign
              language, just the image, the place, and the architectural
              problem.
            </p>
          </div>
          <div className="archive__track" id="archive-track">
            {archiveItems.map((item) => (
              <div className="archive-card" key={item.label}>
                <ResponsiveCardImage alt={item.alt} />
                <div className="archive-card__label mono">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="archive__scroll-hint mono">
            Scroll through archive &rarr;
          </div>
        </div>
      </section>

      <section className="projects" id="gallery">
        <div className="projects__intro">
          <p className="eyebrow mono">03 — Built Environments</p>
          <h2>
            FOUR WAYS
            <br />
            OF BUILDING
          </h2>
          <p>
            Different sites, same discipline: clear structure, useful rooms,
            controlled openings, and materials that can take wear.
          </p>
        </div>
        {projects.map((row) => (
          <div
            className={`projects__row${row.rowClass ? ` ${row.rowClass}` : ''}`}
            key={row.items.map((p) => p.index).join('-')}
          >
            {row.items.map((project) => (
              <ProjectCard key={project.index} project={project} />
            ))}
          </div>
        ))}
      </section>

      <ProjectPanel />
    </>
  )
}
