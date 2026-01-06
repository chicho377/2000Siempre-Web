(() => {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 900,
    easing: "ease-in-out",
    once: true,
  });
})();

(() => {
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (!timelineItems.length) return;

  if (!("IntersectionObserver" in window)) {
    timelineItems.forEach((item) => item.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  timelineItems.forEach((item) => observer.observe(item));
})();

(() => {
  const carousels = document.querySelectorAll(".carousel-wipe");
  if (!carousels.length) return;

  const triggerWipe = (item) => {
    if (!item) return;
    item.classList.remove("is-revealed");
    void item.offsetWidth;
    item.classList.add("is-revealed");
  };

  const activateCarousel = (carousel) => {
    if (carousel.dataset.wipeVisible === "true") return;
    carousel.dataset.wipeVisible = "true";
    const activeItem = carousel.querySelector(".carousel-item.active");
    triggerWipe(activeItem);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          activateCarousel(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    carousels.forEach((carousel) => observer.observe(carousel));
  } else {
    carousels.forEach((carousel) => activateCarousel(carousel));
  }

  carousels.forEach((carousel) => {
    carousel.addEventListener("slide.bs.carousel", (event) => {
      if (carousel.dataset.wipeVisible !== "true") return;
      triggerWipe(event.relatedTarget);
    });
  });
})();

(() => {
  const sectionTitles = Array.from(document.querySelectorAll(".section-title"));
  if (!sectionTitles.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    sectionTitles.forEach((title) =>
      title.style.setProperty("--underline-progress", "1")
    );
    return;
  }

  let ticking = false;

  const updateProgress = () => {
    const viewportHeight = window.innerHeight || 1;
    const startPoint = viewportHeight * 0.85;
    const endPoint = viewportHeight * 0.2;
    const range = Math.max(1, startPoint - endPoint);

    sectionTitles.forEach((title) => {
      const rect = title.getBoundingClientRect();
      const rawProgress = (startPoint - rect.top) / range;
      const clamped = Math.min(1, Math.max(0, rawProgress));
      title.style.setProperty("--underline-progress", clamped.toFixed(3));
    });

    ticking = false;
  };

  const requestTick = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
})();
