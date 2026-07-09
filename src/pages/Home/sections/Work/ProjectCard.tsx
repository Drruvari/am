import Button from '@/components/Button'
import { ResponsiveCardImage } from '@/lib/responsive-image'
import { projectGalleryImages } from '@/lib/images'
import type { Project } from '@/data/projects'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <button
      type="button"
      className={`project-card project-card--${project.size}`}
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

export function ProjectPanel() {
  return (
    <div className="project-panel" id="project-panel">
      <Button
        variant="pill"
        panel
        className="project-panel__close"
        innerClassName="project-panel__close-button mono"
        id="project-panel-close"
        data-hover="close"
      >
        Close
      </Button>
      <div className="project-panel__visual" id="project-panel-visual" />
      <div className="project-panel__info">
        <p className="project-panel__index mono" id="project-panel-index">
          A—01
        </p>
        <h3 className="project-panel__title" id="project-panel-title">
          Project Title
        </h3>
        <p className="project-panel__location mono" id="project-panel-location">
          Location — Year
        </p>
        <p className="project-panel__description" id="project-panel-description">
          Project description goes here.
        </p>
        <div className="project-panel__meta mono" id="project-panel-meta">
          <div className="project-panel__meta-item">
            <span className="project-panel__meta-label">Typology</span>Residential
          </div>
          <div className="project-panel__meta-item">
            <span className="project-panel__meta-label">Status</span>Concept
          </div>
          <div className="project-panel__meta-item">
            <span className="project-panel__meta-label">Scale</span>420 SQM
          </div>
          <div className="project-panel__meta-item">
            <span className="project-panel__meta-label">Materials</span>Concrete
          </div>
        </div>
        <div className="project-panel__gallery" id="project-panel-gallery" />
      </div>
    </div>
  )
}
