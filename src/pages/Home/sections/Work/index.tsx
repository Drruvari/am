import './style.scss'
import { ResponsiveCardImage } from '@/lib/responsive-image'
import { projectGalleryImages } from '@/lib/images'

const archiveItems = [
  { alt: 'Villa Lura', label: '01 / Villa Lura, Coastal Retreat' },
  { alt: 'Dajt Pavilion', label: '02 / Dajt Mountain Pavilion' },
  { alt: 'Krujë Studio', label: '03 / Timber Studio, Krujë' },
  { alt: 'Courtyard House', label: '04 / Courtyard Residence, South' },
]

type Project = {
  size: 'large' | 'small'
  alt: string
  label: string
  title: string
  loc: string
  desc: string
  index: string
  type: string
  status: string
  scale: string
  year: string
  materials: string
  note: string
}

const projects: { rowClass?: string; items: Project[] }[] = [
  {
    items: [
      {
        size: 'large',
        alt: 'Cliff House',
        label: 'A—01 / The Cliff House, Vlorë',
        title: 'The Cliff House',
        loc: 'Vlorë Riviera',
        desc: 'A coastal house set into limestone terrain. Concrete walls take the load and salt exposure; deep glazing is held back where the rooms need shade and opened where the view matters.',
        index: 'A—01',
        type: 'Residential',
        status: 'Concept Study',
        scale: '420 SQM',
        year: '2026',
        materials: 'Board-formed concrete, limestone, low-iron glass',
        note: 'north light / cliff datum',
      },
      {
        size: 'small',
        alt: 'Industrial Loft',
        label: 'A—02 / Factory Loft, Tirana',
        title: 'Industrial Loft',
        loc: 'Tirana Center',
        desc: 'A former textile floor converted into a compact live-work interior. Brick and steel stay visible; new oak and limewash volumes organize storage, services, and work rooms.',
        index: 'A—02',
        type: 'Adaptive Reuse',
        status: 'Interior Concept',
        scale: '280 SQM',
        year: '2025',
        materials: 'Existing brick, blackened steel, pale oak',
        note: 'service core / retained shell',
      },
    ],
  },
  {
    rowClass: 'reverse',
    items: [
      {
        size: 'small',
        alt: 'Botanical Pavilion',
        label: 'A—03 / Botanical Pavilion, Lundër',
        title: 'Botanical Spine',
        loc: 'Lundër',
        desc: 'A small research pavilion built around a glulam spine. The structure sets the rhythm, while the skin filters heat, rain, and glare without hiding the frame.',
        index: 'A—03',
        type: 'Research Pavilion',
        status: 'Schematic Design',
        scale: '190 SQM',
        year: '2026',
        materials: 'Glulam timber, lime plaster, polycarbonate',
        note: 'glulam rhythm / passive skin',
      },
      {
        size: 'large',
        alt: 'Monolith Sanctuary',
        label: 'A—04 / Monolith Sanctuary, Theth',
        title: 'Monolith Sanctuary',
        loc: 'Theth National Park',
        desc: 'A mountain retreat with a heavy mineral shell and a single roof opening. The study tests how little a room needs when the site already carries the atmosphere.',
        index: 'A—04',
        type: 'Retreat',
        status: 'Research Proposal',
        scale: '310 SQM',
        year: '2025',
        materials: 'Local aggregate, darkened timber, mineral render',
        note: 'roof aperture / stone mass',
      },
    ],
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
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
      data-images={projectGalleryImages}
    >
      <div className="project-card__media">
        <ResponsiveCardImage alt={project.alt} />
      </div>
      <div className="project-card__label mono">{project.label}</div>
    </div>
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
