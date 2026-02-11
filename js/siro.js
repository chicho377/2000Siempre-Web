(() => {
  const siroModal = document.getElementById("siroModal");
  if (!siroModal || !window.bootstrap) return;

  const modalVideo = siroModal.querySelector(".siro-modal-video");
  const modalCarousel = siroModal.querySelector("#siroModalCarousel");

  const resetModalContent = () => {
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }

    if (modalCarousel) {
      const carouselInstance = window.bootstrap.Carousel.getOrCreateInstance(modalCarousel);
      carouselInstance.to(0);
    }
  };

  siroModal.addEventListener("shown.bs.modal", () => {
    if (!modalVideo) return;

    modalVideo.currentTime = 0;
    modalVideo.play().catch(() => {
      // Playback may require additional user interaction in some browsers.
    });
  });

  siroModal.addEventListener("hidden.bs.modal", resetModalContent);
})();
