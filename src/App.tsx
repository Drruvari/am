import CustomCursor from "@/components/CustomCursor/index";
import Noise from "@/components/Noise";
import PageTransition from "@/components/PageTransition";
import { lazy, Suspense, useEffect, useState } from "react";

const BubbleMenu = lazy(() => import("@/components/BubbleMenu"));
const Header = lazy(() => import("@/components/Header/index"));
const Home = lazy(() => import("@/pages/Home/index"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const ProcessPage = lazy(() => import("@/pages/Process"));
const Studio = lazy(() => import("@/pages/Studio"));
const Works = lazy(() => import("@/pages/Works"));

const baseUrl = import.meta.env.BASE_URL;

const mobileNavigation = [
  {
    label: "Home",
    href: baseUrl,
    ariaLabel: "Home",
    rotation: -8,
  },
  {
    label: "Studio",
    href: `${baseUrl}studio`,
    ariaLabel: "Studio",
    rotation: 8,
  },
  {
    label: "Work",
    href: `${baseUrl}work`,
    ariaLabel: "Selected work",
    rotation: -5,
  },
  {
    label: "Process",
    href: `${baseUrl}process`,
    ariaLabel: "Process",
    rotation: 7,
  },
  {
    label: "Contact",
    href: "#contact",
    ariaLabel: "Contact",
    rotation: -8,
  },
] as const;

export default function App() {
  const [noiseEnabled, setNoiseEnabled] = useState(() => {
    try {
      return window.localStorage.getItem("am-noise") !== "off";
    } catch {
      return true;
    }
  });
  const isWorksPage = /\/works?\/?$/.test(window.location.pathname);
  const isStudioPage = window.location.pathname.includes("/studio");
  const isProcessPage = window.location.pathname.includes("/process");
  const isGalleryPage = window.location.pathname.includes("/gallery");

  useEffect(() => {
    if (isGalleryPage) {
      document.documentElement.classList.remove("is-entering", "is-loading");
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("@/lib/init-app").then(({ disposeApp, initApp }) => {
      if (cancelled) return;
      initApp();
      cleanup = disposeApp;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [isGalleryPage]);

  const toggleNoise = () => {
    setNoiseEnabled((enabled) => {
      const next = !enabled;
      try {
        window.localStorage.setItem("am-noise", next ? "on" : "off");
      } catch {
        // Preference remains active for the current session.
      }
      return next;
    });
  };

  return (
    <>
      <PageTransition />
      {noiseEnabled && (
        <Noise
          className="noise-overlay--fixed"
          patternAlpha={2}
          patternRefreshInterval={8}
          patternScaleX={1}
          patternScaleY={1}
          patternSize={512}
        />
      )}
      <CustomCursor />
      <Suspense fallback={null}>
        {!isGalleryPage && (
          <Header noiseEnabled={noiseEnabled} onNoiseToggle={toggleNoise} />
        )}
        {!isGalleryPage && (
          <BubbleMenu
            logo={<span>ARBËR MANGA</span>}
            items={mobileNavigation}
            menuAriaLabel="Toggle navigation"
            menuBg="#d1d1c7"
            menuContentColor="#ffffff"
            useFixedPosition
            animationEase="back.out(1.5)"
            animationDuration={0.5}
            staggerDelay={0.12}
          />
        )}
        {isGalleryPage ? (
          <Gallery />
        ) : isWorksPage ? (
          <Works />
        ) : isStudioPage ? (
          <Studio />
        ) : isProcessPage ? (
          <ProcessPage />
        ) : (
          <Home />
        )}
      </Suspense>
    </>
  );
}
