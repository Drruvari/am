export type Project = {
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

export const archiveItems = [
  { alt: 'Villa Lura', label: '01 / Villa Lura, Coastal Retreat' },
  { alt: 'Dajt Pavilion', label: '02 / Dajt Mountain Pavilion' },
  { alt: 'Krujë Studio', label: '03 / Timber Studio, Krujë' },
  { alt: 'Courtyard House', label: '04 / Courtyard Residence, South' },
]

export const projects: { rowClass?: string; items: Project[] }[] = [
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
