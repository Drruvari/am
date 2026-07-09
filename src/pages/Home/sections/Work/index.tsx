import './style.scss'
import { archiveItems, projects } from '@/data/projects'
import { ResponsiveCardImage } from '@/lib/responsive-image'
import ProjectCard, { ProjectPanel } from './ProjectCard'

export default function Work() {
  return (
    <>
      <section className="archive" id="work">
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

      <section className="gallery" id="gallery">
        <div className="gallery__intro">
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
            className={[
              'gallery__row',
              row.rowClass === 'reverse' && 'gallery__row--reverse',
            ]
              .filter(Boolean)
              .join(' ')}
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
