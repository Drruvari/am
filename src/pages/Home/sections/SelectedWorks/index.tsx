import { useRef } from "react";
import SplitCanvasComp from "./SplitCanvasComp";
import { sections } from "./content";
import "./style.scss";

export default function SelectedWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" className="selected-works">
      <div
        ref={wrapperRef}
        className="selected-works__track"
        style={{ height: `${sections.length * 100}svh` }}
      >
        <div className="selected-works__sticky">
          <SplitCanvasComp wrapperRef={wrapperRef} />
        </div>

        <div className="selected-works__content">
          {sections.map((section) => (
            <div key={section.number} className="selected-works__panel">
              <div className="selected-works__meta">
                <span>Selected Work</span>
                <span className="selected-works__number">{section.number}</span>
                <span className="selected-works__period">22–26’</span>
              </div>

              <h2 className="selected-works__title">{section.title}</h2>

              <div className="selected-works__summary">
                <p className="selected-works__description">
                  {section.description}
                </p>
                <span className="selected-works__year">{section.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="selected-works__exit-mask" aria-hidden="true" />
    </section>
  );
}
