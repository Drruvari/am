import CustomCursor from "@/components/CustomCursor/index";
import Header from "@/components/Header/index";
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
      <CustomCursor />
      <Header />
      <Home />
    </>
  );
}
