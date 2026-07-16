import gsap from "gsap";
import { useEffect, useRef, type MouseEvent } from "react";
import "./style.scss";

type ProcessItem = {
  stage: string;
  title: string;
  services: string;
  image: string;
};

const items: ProcessItem[] = [
  { stage: "01", title: "Consultation", services: "Goals, site, budget, and constraints", image: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg" },
  { stage: "02", title: "Concept", services: "Atmosphere, references, and spatial direction", image: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg" },
  { stage: "03", title: "Design development", services: "Plans, materials, lighting, and refinement", image: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg" },
  { stage: "04", title: "Technical drawings", services: "Coordination, pricing, and permit documents", image: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg" },
  { stage: "05", title: "Execution support", services: "Site review, coordination, and detail guidance", image: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg" },
];

export default function Process() {
  const tableRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});
  const activeIndexRef = useRef<number | null>(null);
  const pendingLeaveRef = useRef<Record<number, boolean>>({});
  const generationRef = useRef<Record<number, number>>({});
  const zIndexRef = useRef(10);

  useEffect(() => {
    imageRefs.current.forEach((image) => {
      if (image) gsap.set(image, { clipPath: "inset(50%)", visibility: "hidden" });
    });
    gsap.set(highlightRef.current, { opacity: 0, y: 0, height: 0 });
  }, []);

  const nextGeneration = (index: number) => {
    generationRef.current[index] = (generationRef.current[index] ?? 0) + 1;
    return generationRef.current[index];
  };

  const setRowColor = (index: number, color: string) => {
    const row = rowRefs.current[index];
    if (!row) return;
    gsap.to(row.querySelectorAll("td"), { color, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };

  const hideImage = (index: number) => {
    const image = imageRefs.current[index];
    if (!image) return;
    const generation = nextGeneration(index);
    gsap.killTweensOf(image);
    gsap.to(image, {
      clipPath: "inset(50%)",
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        if (generationRef.current[index] === generation) gsap.set(image, { visibility: "hidden" });
      },
    });
  };

  const showItem = (index: number) => {
    const image = imageRefs.current[index];
    const row = rowRefs.current[index];
    const table = tableRef.current;
    const highlight = highlightRef.current;
    if (!image || !row || !table || !highlight) return;

    pendingLeaveRef.current[index] = false;
    zIndexRef.current += 1;
    const generation = nextGeneration(index);
    const tableBounds = table.getBoundingClientRect();
    const rowBounds = row.getBoundingClientRect();

    gsap.killTweensOf(image);
    gsap.set(image, { zIndex: zIndexRef.current, visibility: "visible", clipPath: "inset(50%)", opacity: 1 });
    gsap.to(image, {
      clipPath: "inset(0%)",
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        if (generationRef.current[index] === generation && pendingLeaveRef.current[index]) hideImage(index);
      },
    });

    if (activeIndexRef.current !== null && activeIndexRef.current !== index) {
      setRowColor(activeIndexRef.current, "var(--fg)");
    }
    activeIndexRef.current = index;
    setRowColor(index, "var(--bg)");
    gsap.to(highlight, {
      y: rowBounds.top - tableBounds.top,
      height: rowBounds.height,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const leaveItem = (index: number) => {
    const image = imageRefs.current[index];
    if (!image) return;
    if (gsap.isTweening(image)) pendingLeaveRef.current[index] = true;
    else hideImage(index);
  };

  const leaveList = () => {
    if (activeIndexRef.current !== null) setRowColor(activeIndexRef.current, "var(--fg)");
    activeIndexRef.current = null;
    gsap.to(highlightRef.current, { autoAlpha: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  };

  const moveImages = (event: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    gsap.to(imageContainerRef.current, {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 20,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 20,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <section className="process" id="process">
      <header className="process__header">
        <span className="process__eyebrow mono">04 — Process</span>
        <h2>How we shape space</h2>
        <p>Hover each stage to follow an idea from first conversation to finished place.</p>
      </header>

      <div className="process__desktop" onMouseMove={moveImages}>
        <div ref={highlightRef} className="process__highlight" aria-hidden="true" />
        <div ref={imageContainerRef} className="process__images" aria-hidden="true">
          {items.map((item, index) => (
            <div ref={(element) => { imageRefs.current[index] = element; }} className="process__image" key={item.stage}>
              <img src={item.image} alt="" />
            </div>
          ))}
        </div>

        <div ref={tableRef} className="process__table" onMouseLeave={leaveList}>
          <table>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <tbody>
              {items.map((item, index) => (
                <tr
                  ref={(element) => { rowRefs.current[index] = element; }}
                  key={item.stage}
                  tabIndex={0}
                  onMouseEnter={() => showItem(index)}
                  onMouseLeave={() => leaveItem(index)}
                  onFocus={() => showItem(index)}
                  onBlur={leaveList}
                >
                  <td className="mono">{item.stage}</td>
                  <td>{item.title}</td>
                  <td aria-hidden="true" />
                  <td>{item.services}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="process__mobile">
        {items.map((item) => (
          <article className="process__card" key={item.stage}>
            <div className="process__card-copy">
              <span className="mono">{item.stage}</span>
              <h3>{item.title}</h3>
              <p>{item.services}</p>
            </div>
            <img src={item.image} alt="" />
          </article>
        ))}
      </div>
    </section>
  );
}
