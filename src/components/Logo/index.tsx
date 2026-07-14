import logoSvgInner from './logo.svg?raw'
import './style.scss'

type LogoProps = {
  idPrefix?: string
  className?: string
}

function prefixSvgIds(svg: string, idPrefix: string) {
  if (!idPrefix) return svg

  return svg
    .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${idPrefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${idPrefix}${id})`)
}

export default function Logo({ idPrefix = '', className }: LogoProps) {
  const svg = prefixSvgIds(logoSvgInner, idPrefix)
  const classes = ['logo', className].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
