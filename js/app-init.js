(() => {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 900,
    easing: "ease-in-out",
    once: true,
  });
})();

(() => {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        timeline.classList.add("timeline--reveal");
        observer.disconnect();
      });
    },
    {
      threshold: 0.35,
    }
  );

  observer.observe(timeline);
})();
