import CustomCursor from "@/components/CustomCursor/index";
import Header from "@/components/Header/index";
import Noise from "@/components/Noise";
import { disposeApp, initApp } from "@/lib/init-app";
import Home from "@/pages/Home/index";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    initApp();
    return () => disposeApp();
  }, []);

  return (
    <>
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
      <Home />
    </>
  );
}
