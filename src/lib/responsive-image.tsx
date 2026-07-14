import { archImage } from '@/lib/images'

export function ResponsiveCardImage({
  alt,
  className,
}: {
  alt: string
  className?: string
}) {
  return (
    <picture>
      <img
        className={className}
        src={archImage}
        alt={alt}
        width={5413}
        height={2692}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

export function InlineImage({
  className,
  variant = 'md',
}: {
  className?: string
  variant?: 'sm' | 'md' | 'lg'
}) {
  const variantClass =
    variant === 'sm'
      ? 'about__image--sm'
      : variant === 'lg'
        ? 'about__image--lg'
        : 'about__image--md'

  return (
    <span className={`about__image ${variantClass} ${className ?? ''}`.trim()}>
      <img
        src={archImage}
        alt=""
        width={5413}
        height={2692}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
