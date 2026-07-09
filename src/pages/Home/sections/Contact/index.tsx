import './style.scss'
import Button from '@/components/Button'
import { images } from '@/lib/images'

export default function Contact() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__intro">
        <h2 className="footer__headline">
          Focused on quality
          <br />
          driven by restraint
        </h2>
        <Button
          variant="pill"
          theme="dark"
          fill
          href="mailto:hello@arbermanga.com"
          className="footer__cta"
          data-hover="link"
        >
          <span>Tell us about your project</span>
        </Button>
      </div>

      <div className="footer__grid">
        <div className="footer__col footer__col--brand">
          <div className="footer__image">
            <picture>
              <source srcSet={images.webp[600]} type="image/webp" />
              <img
                src={images.jpg[600]}
                alt="Warm residential architecture with garden path"
                width={1470}
                height={980}
                loading="lazy"
                decoding="async"
              />
            </picture>
            <span className="footer__mark" aria-hidden="true">
              AM
            </span>
          </div>
        </div>

        <nav className="footer__col footer__col--nav" aria-label="Footer navigation">
          <span className="footer__label mono">(Navigation)</span>
          <div className="footer__links">
            <a href="#top" data-hover="link">
              Home
            </a>
            <a href="#work" data-hover="link">
              Works
            </a>
            <span>In Progress</span>
            <a href="#work" data-hover="link">
              Archive
            </a>
            <span>Studio</span>
            <span>Process</span>
            <a href="#gallery" data-hover="link">
              Gallery
            </a>
            <a href="mailto:hello@arbermanga.com" data-hover="link">
              Contact Us
            </a>
          </div>
        </nav>

        <div className="footer__col footer__col--info">
          <div className="footer__block">
            <span className="footer__label mono">(Acknowledgement)</span>
            <p>
              AM Architecture projects from Tirana and acknowledges the
              builders, craftspeople, clients, and local communities that make
              each study possible.
            </p>
          </div>
          <div className="footer__block">
            <span className="footer__label mono">(Info)</span>
            <p>
              A: Blloku District, Tirana, AL
              <br />
              E: hello@arbermanga.com
              <br />
              P: +355 69 000 0000
              <br />
              H: Monday to Friday, 8:30am – 5:00pm
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bar mono">
        <div className="footer__bar-col footer__bar-col--brand">
          <span>
            © <span id="footerYear">2026</span> AM Architecture
          </span>
          <span id="footerStatus" className="footer__status" />
        </div>
        <div className="footer__bar-col footer__bar-col--legal">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
        <div className="footer__bar-col footer__bar-col--meta">
          <a href="#" data-hover="link">
            Instagram
          </a>
          <span>
            Site by{' '}
            <a href="#" data-hover="link">
              Arbër Manga
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
