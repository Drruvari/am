import Dither from "@/components/Dither";
import { useState } from "react";
import "./style.scss";

const footerWaveColor: [number, number, number] = [0.5, 0.5, 0.5];

export default function Contact() {
  const [isHoldingDither, setIsHoldingDither] = useState(false);
  const [isHoveringDither, setIsHoveringDither] = useState(false);

  const updateTooltipPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--footer-tooltip-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--footer-tooltip-y",
      `${event.clientY - bounds.top}px`,
    );
  };

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
              href="/studio"
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
          <a
            className="footer__text-link footer__text-link--social"
            href="#"
            data-hover="link"
          >
            Instagram
          </a>
          <a
            className="footer__text-link footer__text-link--social"
            href="#"
            data-hover="link"
          >
            LinkedIn
          </a>
          <a
            className="footer__text-link footer__text-link--social"
            href="#"
            data-hover="link"
          >
            Pinterest
          </a>
        </div>
      </div>
      <div className="footer__bar mono" data-reveal="fade">
        <div className="footer__bar-col">
          <span>Tirana, Albania</span>
          <span id="footerStatus" className="footer__status" />
        </div>
        <div className="footer__bar-col">
          <a className="footer__bar-link" href="#top" data-hover="link">
            Back to top
          </a>
          <span>Direct commissions · 2026</span>
        </div>
        <div className="footer__bar-col footer__bar-col--copyright">
          © <span id="footerYear">2026</span> Arbër Manga
        </div>
      </div>
      <div
        className={`footer__image ${
          isHoldingDither ? "is-holding" : ""
        } ${isHoveringDither ? "is-tooltip-visible" : ""}`}
        onPointerEnter={(event) => {
          updateTooltipPosition(event);
          setIsHoveringDither(true);
        }}
        onPointerLeave={() => setIsHoveringDither(false)}
        onPointerDown={(event) => {
          updateTooltipPosition(event);
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsHoldingDither(true);
        }}
        onPointerMove={updateTooltipPosition}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          setIsHoldingDither(false);
        }}
        onPointerCancel={() => setIsHoldingDither(false)}
      >
        <div className="footer__dither-zoom">
          <Dither
            waveColor={footerWaveColor}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        </div>
        <div className="footer__image-meta mono" aria-hidden="true">
          <span>ARBËR MANGA</span>
          <span>ARCHITECTURE STUDIO</span>
        </div>
        <span className="footer__dither-tooltip" aria-hidden="true">
          Move to shape · Hold to intensify
        </span>
      </div>
    </footer>
  );
}
