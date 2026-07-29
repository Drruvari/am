import gsap from "gsap";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import "./style.scss";

type BubbleMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

type BubbleMenuProps = {
  logo: ReactNode;
  logoHref?: string;
  items: readonly BubbleMenuItem[];
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  noiseEnabled: boolean;
  onNoiseToggle: () => void;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

type PillStyle = CSSProperties & {
  "--item-rot": string;
  "--pill-bg": string;
  "--pill-color": string;
  "--hover-bg": string;
  "--hover-color": string;
};

export default function BubbleMenu({
  logo,
  logoHref = "/",
  items,
  menuAriaLabel = "Toggle navigation",
  menuBg = "#d1d1c7",
  menuContentColor = "#080807",
  noiseEnabled,
  onNoiseToggle,
  useFixedPosition = true,
  animationEase = "power3.out",
  animationDuration = 0.55,
  staggerDelay = 0.08,
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const positionClass = useFixedPosition ? "fixed" : "absolute";

  const closeMenu = () => setIsMenuOpen(false);

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;

    gsap.killTweensOf([overlay, ...bubbles, ...labels]);

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex", autoAlpha: 0 });
      gsap.to(overlay, {
        autoAlpha: 1,
        duration: 0.38,
        ease: "power2.out",
      });
      bubbles.forEach((bubble, index) => {
        gsap.set(bubble, {
          scale: 0.88,
          autoAlpha: 0,
          y: 28,
          rotation: items[index]?.rotation ?? 0,
          transformOrigin: "50% 50%",
        });
      });
      gsap.set(labels, { y: 18, autoAlpha: 0 });

      bubbles.forEach((bubble, index) => {
        const timeline = gsap.timeline({ delay: index * staggerDelay });
        timeline.to(bubble, {
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: animationDuration,
          ease: animationEase,
        });
        timeline.to(
          labels[index],
          {
            y: 0,
            autoAlpha: 1,
            duration: animationDuration * 0.85,
            ease: "power3.out",
          },
          `-=${animationDuration * 0.75}`,
        );
      });
    } else if (showOverlay) {
      const closeTimeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => setShowOverlay(false),
      });

      closeTimeline
        .to(labels, {
          y: 12,
          autoAlpha: 0,
          duration: 0.28,
          stagger: { each: 0.03, from: "end" },
          ease: "power2.in",
        })
        .to(
          bubbles,
          {
            scale: 0.92,
            y: -12,
            autoAlpha: 0,
            duration: 0.36,
            stagger: { each: 0.04, from: "end" },
            ease: "power3.inOut",
          },
          0.04,
        )
        .to(
          overlay,
          {
            autoAlpha: 0,
            duration: 0.34,
            ease: "power2.inOut",
          },
          "-=0.18",
        );
    }
  }, [
    animationDuration,
    animationEase,
    isMenuOpen,
    items,
    showOverlay,
    staggerDelay,
  ]);

  useEffect(() => {
    document.body.classList.toggle("is-bubble-menu-open", isMenuOpen);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    let savedY = 0;
    if (isMenuOpen) {
      savedY = window.scrollY;
      document.body.style.top = `-${savedY}px`;
      document.body.classList.add("is-scroll-locked");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("is-bubble-menu-open");
      window.removeEventListener("keydown", handleKeyDown);
      if (document.body.classList.contains("is-scroll-locked")) {
        document.body.classList.remove("is-scroll-locked");
        document.body.style.top = "";
        window.scrollTo(0, savedY);
      }
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={`bubble-menu ${positionClass}`}
        aria-label="Mobile navigation"
      >
        <a
          className="bubble logo-bubble"
          href={logoHref}
          aria-label="Arbër Manga home"
        >
          <span className="logo-content">{logo}</span>
        </a>

        <div className="bubble-controls">
          <button
            type="button"
            className="bubble grain-switch"
            onClick={onNoiseToggle}
            aria-label={`${noiseEnabled ? "Turn off" : "Turn on"} grain`}
            aria-pressed={noiseEnabled}
          >
            <span className="grain-switch__field" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`bubble toggle-bubble menu-btn ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={menuAriaLabel}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-bubble-menu"
          >
            <span className="menu-line" />
            <span className="menu-line short" />
          </button>
        </div>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${positionClass}`}
          id="mobile-bubble-menu"
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list">
            {items.map((item, index) => {
              const pillStyle: PillStyle = {
                "--item-rot": `${item.rotation ?? 0}deg`,
                "--pill-bg": menuBg,
                "--pill-color": menuContentColor,
                "--hover-bg": item.hoverStyles?.bgColor ?? "#f2f2ee",
                "--hover-color":
                  item.hoverStyles?.textColor ?? "#080807",
              };

              return (
                <li className="pill-col" key={item.label}>
                  <a
                    href={item.href}
                    aria-label={item.ariaLabel ?? item.label}
                    className="pill-link"
                    style={pillStyle}
                    onClick={closeMenu}
                    ref={(element) => {
                      bubblesRef.current[index] = element;
                    }}
                  >
                    <span
                      className="pill-label"
                      ref={(element) => {
                        labelRefs.current[index] = element;
                      }}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
