import BubbleMenu from "@/components/BubbleMenu";
import CustomCursor from "@/components/CustomCursor/index";
import Header from "@/components/Header/index";
import Noise from "@/components/Noise";
import PageTransition from "@/components/PageTransition";
import { disposeApp, initApp } from "@/lib/init-app";
import Home from "@/pages/Home/index";
import ProcessPage from "@/pages/Process";
import Studio from "@/pages/Studio";
import Works from "@/pages/Works";
import { useEffect } from "react";

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
  const isWorksPage = /\/works?\/?$/.test(window.location.pathname);
  const isStudioPage = window.location.pathname.includes("/studio");
  const isProcessPage = window.location.pathname.includes("/process");

  useEffect(() => {
    initApp();
    return () => disposeApp();
  }, []);

  return (
    <>
      <PageTransition />
      <Noise
        className="noise-overlay--fixed"
        patternAlpha={6}
        patternRefreshInterval={4}
        patternScaleX={1}
        patternScaleY={1}
        patternSize={1024}
      />
      <CustomCursor />
      <Header />
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
      {isWorksPage ? (
        <Works />
      ) : isStudioPage ? (
        <Studio />
      ) : isProcessPage ? (
        <ProcessPage />
      ) : (
        <Home />
      )}
    </>
  );
}
