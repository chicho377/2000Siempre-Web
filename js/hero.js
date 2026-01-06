(() => {
  const heroVideo = document.querySelector(".hero-video");
  const heroVideoProgress = document.querySelector(".hero-video-progress__fill");
  const heroSection = document.querySelector(".hero");
  const heroOrbs = document.querySelectorAll(".hero-orb");
  const heroModal = document.getElementById("heroVideoModal");
  const heroModalVideo = document.querySelector(".hero-modal-video");

  const updateHeroVideoProgress = () => {
    if (!heroVideo || !heroVideoProgress) return;
    if (!heroVideo.duration || Number.isNaN(heroVideo.duration)) return;
    const progress = Math.min(100, (heroVideo.currentTime / heroVideo.duration) * 100);
    heroVideoProgress.style.width = `${progress}%`;
  };

  if (heroVideo && heroVideoProgress) {
    heroVideo.addEventListener("loadedmetadata", updateHeroVideoProgress);
    heroVideo.addEventListener("timeupdate", updateHeroVideoProgress);
    heroVideo.addEventListener("seeked", updateHeroVideoProgress);
    heroVideo.addEventListener("ended", () => {
      heroVideoProgress.style.width = "0%";
    });
  }

  if (heroSection && heroOrbs.length) {
    let heroTicking = false;

    const handleHeroMove = (event) => {
      if (heroTicking) return;
      heroTicking = true;
      window.requestAnimationFrame(() => {
        const { left, top, width, height } = heroSection.getBoundingClientRect();
        const x = (event.clientX - left - width / 2) / (width / 2);
        const y = (event.clientY - top - height / 2) / (height / 2);

        heroOrbs.forEach((orb) => {
          const depth = Number(orb.dataset.depth || 10);
          const translateX = x * depth;
          const translateY = y * depth;
          orb.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });
        heroTicking = false;
      });
    };

    heroSection.addEventListener("mousemove", handleHeroMove);
    heroSection.addEventListener("mouseleave", () => {
      heroOrbs.forEach((orb) => {
        orb.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  if (heroModal && heroModalVideo) {
    heroModal.addEventListener("shown.bs.modal", () => {
      heroModalVideo.currentTime = 0;
      heroModalVideo.muted = false;
      heroModalVideo.play().catch(() => {});
    });

    heroModal.addEventListener("hidden.bs.modal", () => {
      heroModalVideo.pause();
      heroModalVideo.currentTime = 0;
      heroModalVideo.muted = true;
    });
  }
})();
