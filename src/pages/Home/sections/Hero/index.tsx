import './style.scss'
import Button from '@/components/Button'
import arrowIcon from '@/assets/arrow.svg'
import { heroSrcsetJpg, heroSrcsetWebp, images } from '@/lib/images'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__body">
        <div className="hero__meta mono">
          <span className="hero__meta-item">Arbër Manga</span>
          <span className="hero__meta-item">Architecture / Studies</span>
        </div>

        <div className="hero__content">
          <h1 className="hero__title" id="heroTitle">
            <span className="hero__title-line">Quiet</span>
            <span className="hero__title-line">architecture</span>
            <span className="hero__title-line">shaped by light,</span>
            <span className="hero__title-line">material, and place.</span>
          </h1>

          <div className="hero__aside">
            <p className="hero__lede">
              Independent residential, interior, and spatial studies focused on
              restraint, proportion, and atmosphere.
            </p>

            <Button
              variant="rect"
              href="#work"
              className="hero__cta"
              data-hover="link"
            >
              <span>View work</span>
              <img
                className="hero__cta-icon"
                src={arrowIcon}
                alt=""
                width={17}
                height={17}
                decoding="async"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>

        <div className="hero__media">
          <picture>
            <source type="image/webp" srcSet={heroSrcsetWebp} sizes="100vw" />
            <source type="image/jpeg" srcSet={heroSrcsetJpg} sizes="100vw" />
            <img
              className="hero__img"
              src={images.jpg[600]}
              width={1470}
              height={980}
              alt="Architectural study shaped by light and material restraint"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  )
}
