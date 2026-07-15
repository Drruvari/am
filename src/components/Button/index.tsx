import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import './style.scss'

type ButtonVariant = 'pill' | 'rect' | 'circle'
type ButtonTheme = 'default' | 'dark' | 'soft'

type SharedProps = {
  variant?: ButtonVariant
  theme?: ButtonTheme
  fill?: boolean
  panel?: boolean
  className?: string
  labelClassName?: string
  innerClassName?: string
  children: ReactNode
}

type ButtonAsLink = SharedProps & {
  href: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>

type ButtonAsButton = SharedProps & {
  href?: undefined
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export type ButtonProps = ButtonAsLink | ButtonAsButton

function buildClassName({
  variant = 'pill',
  theme = 'default',
  fill,
  panel,
  className,
}: Pick<ButtonProps, 'variant' | 'theme' | 'fill' | 'panel' | 'className'>) {
  return [
    'btn',
    `btn--${variant}`,
    theme !== 'default' && `btn--${theme}`,
    fill && 'btn--fill',
    panel && 'btn--panel',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export default function Button({
  variant,
  theme,
  fill,
  panel,
  className,
  labelClassName,
  innerClassName,
  children,
  href,
  ...rest
}: ButtonProps) {
  const wrapperClass = buildClassName({ variant, theme, fill, panel, className })
  const innerClass = innerClassName
  const label = (
    <span className={['btn__label', labelClassName].filter(Boolean).join(' ')}>
      {children}
    </span>
  )

  if (href) {
    return (
      <div className={wrapperClass}>
        <a
          href={href}
          className={innerClass}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {label}
        </a>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        className={innerClass}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {label}
      </button>
    </div>
  )
}
