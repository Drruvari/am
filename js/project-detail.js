function initProjectDetail() {
  const detailOverlay = document.getElementById("detail");
  const detailClose = document.getElementById("detailClose");
  const detailVisual = document.getElementById("detailVisual");
  const detailGallery = document.getElementById("detailGallery");

  if (!detailOverlay || !detailClose) return;

  let detailOpen = false;

  const getTriggerImageSrc = (trigger) => {
    const embeddedImage = trigger.querySelector(".works-visual img");
    const dataImages = (trigger.getAttribute("data-images") || "")
      .split("|")
      .filter(Boolean);

    return (
      trigger.getAttribute("data-image") ||
      dataImages[0] ||
      (embeddedImage ? embeddedImage.currentSrc || embeddedImage.src : "")
    );
  };

  const populateDetail = (trigger) => {
    const title = trigger.getAttribute("data-title") || "Project Study";
    const loc = trigger.getAttribute("data-loc") || "Location";
    const year = trigger.getAttribute("data-year") || "Study";
    const imageSrc = getTriggerImageSrc(trigger);
    const embeddedImage = trigger.querySelector(".works-visual img");
    const imageAlt = embeddedImage?.alt || title;

    detailVisual.innerHTML = imageSrc
      ? `<img src="${imageSrc}" alt="${imageAlt}">`
      : "";
    document.getElementById("detailTitle").textContent = title;
    document.getElementById("detailIndex").textContent =
      trigger.getAttribute("data-index") || "A—00";
    document.getElementById("detailLoc").textContent = `${loc} — ${year}`;
    document.getElementById("detailDesc").textContent =
      trigger.getAttribute("data-desc") || "";
    document.getElementById("detailMeta").innerHTML = `
      <div><span>Typology</span>${trigger.getAttribute("data-type") || "Study"}</div>
      <div><span>Status</span>${trigger.getAttribute("data-status") || "Concept"}</div>
      <div><span>Scale</span>${trigger.getAttribute("data-scale") || "TBD"}</div>
      <div><span>Materials</span>${trigger.getAttribute("data-materials") || "Material study"}</div>
    `;
    detailGallery.innerHTML = (trigger.getAttribute("data-images") || "")
      .split("|")
      .filter(Boolean)
      .slice(1)
      .map(
        (src) => `<img src="${src}" alt="${title} study image" loading="lazy">`,
      )
      .join("");
  };

  const openDetail = (trigger) => {
    if (detailOpen) return;
    detailOpen = true;

    populateDetail(trigger);
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

  const bindDetailTrigger = (trigger) => {
    const activate = () => openDetail(trigger);

    trigger.addEventListener("click", activate);
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activate();
    });
  };

  document
    .querySelectorAll(".works-figure, .project-item")
    .forEach(bindDetailTrigger);

  detailClose.addEventListener("click", closeDetail);
  detailOverlay.addEventListener("click", (e) => {
    if (e.target === detailOverlay) closeDetail();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}
