import Button from "@/components/Button";
import { archImage } from "@/lib/images";
import "./style.scss";

export default function Contact() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__intro">
        <h2 className="footer__headline" data-split-lines>
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
          data-reveal="up"
          data-hover="link"
        >
          <span>Tell us about your project</span>
        </Button>
      </div>
      <div className="footer__grid">
        <div
          className="footer__col footer__col--brand"
          data-reveal="mask"
        >
          <div className="footer__image">
            <img
              src={archImage}
              alt="Warm residential architecture with garden path"
              width={5413}
              height={2692}
              loading="lazy"
              decoding="async"
              data-parallax="6"
            />
            <span className="footer__mark" aria-hidden="true">
              AM
            </span>
          </div>
        </div>

        <nav
          className="footer__col footer__col--nav"
          data-reveal="up"
          data-reveal-group="footer-columns"
          aria-label="Footer navigation"
        >
          <span className="footer__label mono">(Navigation)</span>
          <div className="footer__nav">
            <a className="footer__nav-link" href="#top" data-hover="link">
              Home
            </a>
            <a className="footer__nav-link" href="#work" data-hover="link">
              Works
            </a>
            <span className="footer__nav-item is-disabled">In Progress</span>
            <a className="footer__nav-link" href="#work" data-hover="link">
              Archive
            </a>
            <span className="footer__nav-item is-disabled">Studio</span>
            <span className="footer__nav-item is-disabled">Process</span>
            <a className="footer__nav-link" href="#gallery" data-hover="link">
              Gallery
            </a>
            <a
              className="footer__nav-link"
              href="mailto:hello@arbermanga.com"
              data-hover="link"
            >
              Contact Us
            </a>
          </div>
        </nav>

        <div
          className="footer__col footer__col--info"
          data-reveal="up"
          data-reveal-group="footer-columns"
        >
          <div className="footer__block">
            <span className="footer__label mono">(Acknowledgement)</span>
            <p className="footer__block-text">
              AM Architecture projects from Tirana and acknowledges the
              builders, craftspeople, clients, and local communities that make
              each study possible.
            </p>
          </div>
          <div className="footer__block">
            <span className="footer__label mono">(Info)</span>
            <p className="footer__block-text">
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
      <div className="footer__bar mono" data-reveal="fade">
        <div className="footer__bar-col footer__bar-col--brand">
          <span>
            © <span id="footerYear">2026</span> AM Architecture
          </span>
          <span id="footerStatus" className="footer__status" />
        </div>
        <div className="footer__bar-col footer__bar-col--legal">
          <span className="footer__bar-item">Privacy Policy</span>
          <span className="footer__bar-item">Terms of Service</span>
        </div>
        <div className="footer__bar-col footer__bar-col--meta">
          <a className="footer__bar-link" href="#" data-hover="link">
            Instagram
          </a>
          <span className="footer__bar-credit">
            Site by{" "}
            <a className="footer__bar-link" href="#" data-hover="link">
              Kejdi Balla
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
