import { useRef } from "react";
import SplitCanvasComp from "./SplitCanvasComp";
import { sections } from "./content";

export default function SelectedWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" className="min-h-screen bg-(--bg) text-(--fg)">
      <div
        ref={wrapperRef}
        className="relative"
        style={{ height: `${sections.length * 100}svh` }}
      >
        <div className="sticky top-0 z-20 flex h-svh w-full translate-y-[clamp(1rem,5svh,4rem)] items-center justify-center overflow-hidden max-sm:translate-y-[2svh]">
          <SplitCanvasComp wrapperRef={wrapperRef} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 px-(--content-inset)">
          {sections.map((section) => (
            <div
              key={section.number}
              className="relative mx-auto h-svh w-full max-w-[120rem] pt-[clamp(5.75rem,12svh,10rem)] pb-[clamp(2rem,5svh,4rem)] max-sm:pt-[clamp(5.25rem,11svh,6.5rem)] max-sm:pb-5"
            >
              <div className="grid grid-cols-3 items-center border-b border-(--fg) pb-[clamp(.65rem,.8vw,.9rem)] text-[clamp(.82rem,1.35vw,1.35rem)] leading-none font-bold tracking-tight uppercase max-sm:text-[.7rem]">
                <span>Selected Work</span>
                <span className="text-center opacity-15">{section.number}</span>
                <span className="text-right">22–26’</span>
              </div>

              <h2 className="absolute top-[clamp(9.5rem,23svh,15rem)] left-[clamp(0rem,6vw,7rem)] w-[min(24vw,24rem)] font-(--font-body) text-[clamp(1.35rem,1.6vw,1.9rem)] leading-[1.12] tracking-[-.045em] normal-case max-lg:left-0 max-lg:w-[26%] max-lg:text-[clamp(1.15rem,2.2vw,1.5rem)] max-sm:top-[clamp(8rem,17svh,9.5rem)] max-sm:w-full max-sm:px-5 max-sm:text-center max-sm:text-[clamp(1rem,4.8vw,1.2rem)] max-sm:leading-[1.1]">
                {section.title}
              </h2>

              <div className="absolute right-[clamp(0rem,2vw,2.5rem)] bottom-[clamp(2rem,6svh,5rem)] w-[min(19vw,20rem)] max-lg:right-0 max-lg:w-[25%] max-sm:bottom-[clamp(1.25rem,3svh,2rem)] max-sm:w-full max-sm:px-6 max-sm:text-center">
                <p className="font-(--font-body) text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.4] text-(--fg) opacity-55 max-lg:text-[clamp(.9rem,1.7vw,1.05rem)] max-sm:text-[.88rem] max-sm:leading-[1.35]">
                  {section.description}
                </p>
                <span className="mt-3 block font-(--font-body) text-[clamp(.7rem,.75vw,.8rem)] tracking-[.08em] opacity-35 max-sm:mt-2">
                  {section.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
