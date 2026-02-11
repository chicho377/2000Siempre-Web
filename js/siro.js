(() => {
  const siroModal = document.getElementById("siroModal");
  if (!siroModal || !window.bootstrap) return;

  const modalCarousel = siroModal.querySelector("#siroModalCarousel");
  if (!modalCarousel) return;

  siroModal.addEventListener("hidden.bs.modal", () => {
    const carouselInstance = window.bootstrap.Carousel.getOrCreateInstance(modalCarousel);
    carouselInstance.to(0);
  });
})();
