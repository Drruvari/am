import './style.scss'
import { InlineImage } from '@/lib/responsive-image'

export default function About() {
  return (
    <section className="about" id="about">
      <p className="about__eyebrow eyebrow mono">01 — Philosophy</p>
      <div className="about__body">
        <div className="about__line about__line--1">
          <span className="about__line-text">The work starts with</span>
          <InlineImage className="about__image--raise" />
          <span className="about__line-text">what is</span>
        </div>
        <div className="about__line about__line--2">
          <span className="about__line-text">already there:</span>
          <InlineImage variant="lg" />
        </div>
        <div className="about__line about__line--3">
          <span className="about__line-text">slope, shade, wind,</span>
        </div>
        <div className="about__line about__line--4">
          <span className="about__line-text">access, budget, and the material</span>
        </div>
        <div className="about__line about__line--5">
          <span className="about__line-text">close at hand.</span>
          <InlineImage variant="sm" className="about__image--drop" />
        </div>
        <div className="about__line about__line--6">
          <span className="about__line-text">Form follows those</span>
          <InlineImage className="about__image--drop" />
          <span className="about__line-text">constraints,</span>
        </div>
        <div className="about__line about__line--7">
          <span className="about__line-text">then gets edited until</span>
          <InlineImage className="about__image--raise" />
          <span className="about__line-text">nothing extra remains.</span>
        </div>
      </div>
    </section>
  )
}
