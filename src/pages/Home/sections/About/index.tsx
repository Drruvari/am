import './style.scss'
import { InlineImage } from '@/lib/responsive-image'

export default function About() {
  return (
    <section className="manifesto about">
      <p className="manifesto__eyebrow eyebrow mono">01 — Philosophy</p>
      <div className="manifesto__body">
        <div className="manifesto__line manifesto__line--1">
          <span>The work starts with</span>
          <InlineImage className="manifesto__image--raise" />
          <span>what is</span>
        </div>
        <div className="manifesto__line manifesto__line--2">
          <span>already there:</span>
          <InlineImage variant="lg" />
        </div>
        <div className="manifesto__line manifesto__line--3">
          <span>slope, shade, wind,</span>
        </div>
        <div className="manifesto__line manifesto__line--4">
          <span>access, budget, and the material</span>
        </div>
        <div className="manifesto__line manifesto__line--5">
          <span>close at hand.</span>
          <InlineImage variant="sm" className="manifesto__image--drop" />
        </div>
        <div className="manifesto__line manifesto__line--6">
          <span>Form follows those</span>
          <InlineImage className="manifesto__image--drop" />
          <span>constraints,</span>
        </div>
        <div className="manifesto__line manifesto__line--7">
          <span>then gets edited until</span>
          <InlineImage className="manifesto__image--raise" />
          <span>nothing extra remains.</span>
        </div>
      </div>
    </section>
  )
}
