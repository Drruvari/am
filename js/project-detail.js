function initProjectDetail() {
  const detailOverlay = document.getElementById("detail");
  const detailClose = document.getElementById("detailClose");
  const detailVisual = document.getElementById("detailVisual");
  const detailGallery = document.getElementById("detailGallery");

  if (!detailOverlay || !detailClose) return;

  let detailOpen = false;

  const populateDetail = (figure) => {
    const image = figure.querySelector(".works-visual img");
    const title = figure.getAttribute("data-title") || "Project Study";
    const loc = figure.getAttribute("data-loc") || "Location";
    const year = figure.getAttribute("data-year") || "Study";
    const imageSrc = image ? image.currentSrc || image.src : "";
    const imageAlt = image ? image.alt : title;

    detailVisual.innerHTML = imageSrc
      ? `<img src="${imageSrc}" alt="${imageAlt}">`
      : "";
    document.getElementById("detailTitle").textContent = title;
    document.getElementById("detailIndex").textContent =
      figure.getAttribute("data-index") || "A—00";
    document.getElementById("detailLoc").textContent = `${loc} — ${year}`;
    document.getElementById("detailDesc").textContent =
      figure.getAttribute("data-desc") || "";
    document.getElementById("detailMeta").innerHTML = `
      <div><span>Typology</span>${figure.getAttribute("data-type") || "Study"}</div>
      <div><span>Status</span>${figure.getAttribute("data-status") || "Concept"}</div>
      <div><span>Scale</span>${figure.getAttribute("data-scale") || "TBD"}</div>
      <div><span>Materials</span>${figure.getAttribute("data-materials") || "Material study"}</div>
    `;
    detailGallery.innerHTML = (figure.getAttribute("data-images") || "")
      .split("|")
      .filter(Boolean)
      .slice(1)
      .map(
        (src) => `<img src="${src}" alt="${title} study image" loading="lazy">`,
      )
      .join("");
  };

  const openDetail = (figure) => {
    if (detailOpen) return;
    detailOpen = true;

    populateDetail(figure);
    detailOverlay.classList.add("active");
    document.body.classList.add("is-detail-open");
    lenis.stop();

    gsap.killTweensOf([
      ".detail-info > *",
      ".detail-visual img",
      detailOverlay,
    ]);
    gsap.set(detailOverlay, { autoAlpha: 1 });
    gsap.fromTo(
      ".detail-visual img",
      {
        clipPath: "inset(8% 8% 8% 8%)",
        scale: 1.08,
        opacity: 0.7,
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
      },
    );
    gsap.fromTo(
      ".detail-info > *",
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.07,
        duration: 0.68,
        ease: "power3.out",
        delay: 0.12,
      },
    );
  };

  const closeDetail = () => {
    if (!detailOpen) return;

    gsap.killTweensOf([
      ".detail-info > *",
      ".detail-visual img",
      detailOverlay,
    ]);
    gsap.to(".detail-info > *", {
      opacity: 0,
      y: -18,
      duration: 0.28,
      ease: "power2.in",
    });
    gsap.to(".detail-visual img", {
      scale: 1.04,
      opacity: 0,
      duration: 0.42,
      ease: "power3.inOut",
    });
    gsap.to(detailOverlay, {
      autoAlpha: 0,
      duration: 0.48,
      ease: "power3.inOut",
      onComplete: () => {
        detailOpen = false;
        detailOverlay.classList.remove("active");
        document.body.classList.remove("is-detail-open");
        detailVisual.innerHTML = "";
        detailGallery.innerHTML = "";
        lenis.start();
      },
    });
  };

  document.querySelectorAll(".works-figure").forEach((figure) => {
    figure.addEventListener("click", () => openDetail(figure));
  });

  detailClose.addEventListener("click", closeDetail);
  detailOverlay.addEventListener("click", (e) => {
    if (e.target === detailOverlay) closeDetail();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}
