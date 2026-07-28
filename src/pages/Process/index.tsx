import ProjectInvitation from "@/pages/Home/sections/06";
import Contact from "@/pages/Home/sections/07";
import InteractiveProcessList from "./InteractiveProcessList";
import ProcessReveal from "./ProcessReveal";
import "./style.scss";

export default function ProcessPage() {
  return (
    <>
      <main id="top" className="process-page">
        <ProcessReveal />
        <InteractiveProcessList />
        <ProjectInvitation />
      </main>
      <Contact />
    </>
  );
}
