import {
  cardSizes,
  cardSrcsetJpg,
  cardSrcsetWebp,
  images,
} from '@/lib/images'

export function ResponsiveCardImage({
  alt,
  className,
}: {
  alt: string
  className?: string
}) {
  return (
    <picture>
      <source type="image/webp" srcSet={cardSrcsetWebp} sizes={cardSizes} />
      <source type="image/jpeg" srcSet={cardSrcsetJpg} sizes={cardSizes} />
      <img
        className={className}
        src={images.jpg[600]}
        alt={alt}
        width={1470}
        height={980}
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
      <picture>
        <source srcSet={images.webp[480]} type="image/webp" />
        <img
          src={images.jpg[480]}
          alt=""
          width={1470}
          height={980}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </span>
  )
}
