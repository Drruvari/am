import Button from '@/components/Button'
import { ResponsiveCardImage } from '@/lib/responsive-image'
import { projectGalleryImages } from '@/lib/images'
import type { Project } from '@/data/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <button
      type="button"
      className={`card card--${project.size}`}
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
      <span className="card__media">
        <ResponsiveCardImage alt={project.alt} />
      </span>
      <span className="card__label mono">{project.label}</span>
    </button>
  )
}

export function ProjectPanel() {
  return (
    <div className="panel" id="project-panel">
      <Button
        variant="pill"
        panel
        className="panel__close-wrap"
        innerClassName="panel__close mono"
        id="project-panel-close"
        data-hover="close"
      >
        Close
      </Button>
      <div className="panel__visual" id="project-panel-visual" />
      <div className="panel__info">
        <p className="mono panel__index" id="project-panel-index">
          A—01
        </p>
        <h3 id="project-panel-title">Project Title</h3>
        <p className="panel__location mono" id="project-panel-location">
          Location — Year
        </p>
        <p className="panel__description" id="project-panel-description">
          Project description goes here.
        </p>
        <div className="panel__meta mono" id="project-panel-meta">
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
        <div className="panel__gallery" id="project-panel-gallery" />
      </div>
    </div>
  )
}
