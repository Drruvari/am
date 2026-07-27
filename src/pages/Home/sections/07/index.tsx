import "./style.scss";

export default function Contact() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__grid">
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
              Work
            </a>
            <a
              className="footer__nav-link"
              href="#featured-project"
              data-hover="link"
            >
              Studio
            </a>
            <a className="footer__nav-link" href="#process" data-hover="link">
              Services
            </a>
            <a className="footer__nav-link" href="#work" data-hover="link">
              Archive
            </a>
            <a
              className="footer__nav-link"
              href="mailto:hello@arbermanga.com"
              data-hover="link"
            >
              Contact
            </a>
          </div>
        </nav>

        <div
          className="footer__col footer__col--details"
          data-reveal="up"
          data-reveal-group="footer-columns"
        >
          <span className="footer__label mono">(Practice details)</span>
          <a
            className="footer__text-link"
            href="mailto:hello@arbermanga.com"
            data-hover="link"
          >
            hello@arbermanga.com
          </a>
          <p className="footer__block-text">
            Based in Tirana, Albania.
            <br />
            Working across the region.
          </p>
        </div>

        <div
          className="footer__col footer__col--social"
          data-reveal="up"
          data-reveal-group="footer-columns"
        >
          <span className="footer__label mono">(Socials)</span>
          <a className="footer__text-link" href="#" data-hover="link">
            Instagram ↗
          </a>
          <a className="footer__text-link" href="#" data-hover="link">
            LinkedIn ↗
          </a>
          <a className="footer__text-link" href="#" data-hover="link">
            Pinterest ↗
          </a>
        </div>

        <div
          className="footer__col footer__col--tools"
          aria-label="Practice links"
        >
          <span className="footer__label mono">(Links)</span>
          <div className="footer__tools" aria-hidden="true">
            <span>AM</span>
            <span>✦</span>
            <span>◇</span>
            <span>↗</span>
          </div>
        </div>
      </div>
      <div className="footer__bar mono" data-reveal="fade">
        <div className="footer__bar-col">
          <span>Tirana, Albania</span>
          <span id="footerStatus" className="footer__status" />
        </div>
        <div className="footer__bar-col">
          <a className="footer__bar-link" href="#top" data-hover="link">
            Back to top ↑
          </a>
          <span>Direct commissions · 2026</span>
        </div>
        <div className="footer__bar-col footer__bar-col--copyright">
          © <span id="footerYear">2026</span> Arbër Manga
        </div>
      </div>
    </footer>
  );
}
