(() => {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 900,
    easing: "ease-in-out",
    once: true,
  });
})();

(() => {
  const clientsMarquee = document.querySelector(".clients-marquee");
  const clientsTrack = clientsMarquee?.querySelector(".clients-track");
  if (!clientsTrack) return;

  const originalCards = Array.from(clientsTrack.querySelectorAll(".client-card"));
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    const logo = clone.querySelector("img");
    if (logo) logo.alt = "";
    clientsTrack.appendChild(clone);
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
  const characterTrigger = document.querySelector(".process-character-trigger");
  if (!characterTrigger) return;

  const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    characterTrigger.classList.add("is-ios-fallback");
  }
})();
