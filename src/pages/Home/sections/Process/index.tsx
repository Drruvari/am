import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import "./style.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ProcessItem = {
  stage: string;
  title: string;
  services: string;
  image: string;
};

const items: ProcessItem[] = [
  {
    stage: "01",
    title: "Listen",
    services: "Brief, site, budget, and daily rituals",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
  },
  {
    stage: "02",
    title: "Read the place",
    services: "Climate, orientation, context, and opportunity",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  },
  {
    stage: "03",
    title: "Develop",
    services: "Plans, proportions, materials, and daylight",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  },
  {
    stage: "04",
    title: "Resolve",
    services: "Details, consultants, costs, and approvals",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
  },
  {
    stage: "05",
    title: "Make",
    services: "Site review, craft coordination, and final detail",
    image:
      "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  },
];

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const table = tableRef.current;
      const highlight = highlightRef.current;
      if (!root || !table || !highlight) return;

      const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
      const rows = rowRefs.current.filter(Boolean) as HTMLTableRowElement[];
      if (!images.length || rows.length !== images.length) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(images, { clearProps: "all", visibility: "hidden" });
        gsap.set(highlight, { autoAlpha: 0 });
        return;
      }

      gsap.set(images, { clipPath: "inset(50%)", autoAlpha: 0 });
      gsap.set(highlight, { autoAlpha: 0, y: 0, height: 0 });

      let activeIndex: number | null = null;
      let zIndex = 10;
      const pendingLeave: Record<number, boolean> = {};
      const generation: Record<number, number> = {};

      const nextGeneration = (index: number) => {
        generation[index] = (generation[index] ?? 0) + 1;
        return generation[index];
      };

      const setRowColor = (index: number, color: string) => {
        gsap.to(rows[index].querySelectorAll("td"), {
          color,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const hideImage = (index: number) => {
        const image = images[index];
        const gen = nextGeneration(index);
        gsap.killTweensOf(image);
        gsap.to(image, {
          clipPath: "inset(50%)",
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.inOut",
          onComplete: () => {
            if (generation[index] === gen) {
              gsap.set(image, { visibility: "hidden" });
            }
          },
        });
      };

      const showItem = (index: number) => {
        const image = images[index];
        const row = rows[index];
        pendingLeave[index] = false;
        zIndex += 1;
        const gen = nextGeneration(index);
        const tableBounds = table.getBoundingClientRect();
        const rowBounds = row.getBoundingClientRect();

        gsap.killTweensOf(image);
        gsap.set(image, {
          zIndex,
          visibility: "visible",
          clipPath: "inset(50%)",
          autoAlpha: 1,
        });
        gsap.to(image, {
          clipPath: "inset(0%)",
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            if (generation[index] === gen && pendingLeave[index]) {
              hideImage(index);
            }
          },
        });

        if (activeIndex !== null && activeIndex !== index) {
          setRowColor(activeIndex, "var(--fg)");
          hideImage(activeIndex);
        }
        activeIndex = index;
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
        if (gsap.isTweening(images[index])) pendingLeave[index] = true;
        else hideImage(index);
      };

      const leaveList = () => {
        if (activeIndex !== null) setRowColor(activeIndex, "var(--fg)");
        activeIndex = null;
        gsap.to(highlight, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const media = gsap.matchMedia();

      // Desktop / fine pointer: hover + focus (same as before)
      media.add("(hover: hover) and (pointer: fine)", () => {
        const onLeaveList = () => {
          images.forEach((_, index) => leaveItem(index));
          leaveList();
        };

        table.addEventListener("mouseleave", onLeaveList);

        const cleanups = rows.map((row, index) => {
          const onEnter = () => showItem(index);
          const onLeave = () => leaveItem(index);
          const onFocus = () => showItem(index);
          const onBlur = () => leaveList();

          row.addEventListener("mouseenter", onEnter);
          row.addEventListener("mouseleave", onLeave);
          row.addEventListener("focus", onFocus);
          row.addEventListener("blur", onBlur);

          return () => {
            row.removeEventListener("mouseenter", onEnter);
            row.removeEventListener("mouseleave", onLeave);
            row.removeEventListener("focus", onFocus);
            row.removeEventListener("blur", onBlur);
          };
        });

        return () => {
          table.removeEventListener("mouseleave", onLeaveList);
          cleanups.forEach((cleanup) => cleanup());
          leaveList();
          images.forEach((_, index) => {
            gsap.killTweensOf(images[index]);
            gsap.set(images[index], {
              clipPath: "inset(50%)",
              autoAlpha: 0,
              visibility: "hidden",
            });
          });
        };
      });

      // Touch / coarse pointer: same clip + highlight, driven by scroll
      media.add("(hover: none), (pointer: coarse)", () => {
        const activateClosest = () => {
          const mid = window.innerHeight * 0.5;
          let closest = -1;
          let closestDist = Number.POSITIVE_INFINITY;
          rows.forEach((row, index) => {
            const rect = row.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(center - mid);
            if (dist < closestDist) {
              closestDist = dist;
              closest = index;
            }
          });
          if (closest >= 0) showItem(closest);
        };

        const triggers = rows.map((row, index) =>
          ScrollTrigger.create({
            trigger: row,
            start: "top 65%",
            end: "bottom 35%",
            onToggle: (self) => {
              if (self.isActive) showItem(index);
            },
          }),
        );

        const onRefresh = () => activateClosest();
        ScrollTrigger.addEventListener("refresh", onRefresh);
        activateClosest();

        return () => {
          ScrollTrigger.removeEventListener("refresh", onRefresh);
          triggers.forEach((trigger) => trigger.kill());
          leaveList();
          images.forEach((image) => {
            gsap.killTweensOf(image);
            gsap.set(image, {
              clipPath: "inset(50%)",
              autoAlpha: 0,
              visibility: "hidden",
            });
          });
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="process" id="process">
      <header className="process__header">
        <span className="process__eyebrow mono">04 — Process</span>
        <h2>From idea to place</h2>
        <p>
          Five connected stages carry a commission from first questions to a
          finished place.
        </p>
      </header>

      <div className="process__stage">
        <div
          ref={highlightRef}
          className="process__highlight"
          aria-hidden="true"
        />
        <div className="process__images" aria-hidden="true">
          {items.map((item, index) => (
            <div
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              className="process__image"
              key={item.stage}
            >
              <img src={item.image} alt="" />
            </div>
          ))}
        </div>

        <div ref={tableRef} className="process__table">
          <table>
            <colgroup>
              <col className="process__col--stage" />
              <col className="process__col--title" />
              <col className="process__col--gap" />
              <col className="process__col--services" />
            </colgroup>
            <tbody>
              {items.map((item, index) => (
                <tr
                  ref={(element) => {
                    rowRefs.current[index] = element;
                  }}
                  key={item.stage}
                  tabIndex={0}
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
    </section>
  );
}
