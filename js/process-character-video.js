document.addEventListener("DOMContentLoaded", () => {
  const characterVideo = document.querySelector(".process-character__media");
  if (!characterVideo) return;

  const fallbackSrc = "./img/especialSiempre/Special SiempreSinFondo.png";
  const fallbackAlt = "Ciro en su forma principal";

  const renderFallbackImage = () => {
    const fallbackImage = document.createElement("img");
    fallbackImage.src = fallbackSrc;
    fallbackImage.alt = fallbackAlt;
    fallbackImage.className = "process-character__fallback";
    characterVideo.replaceWith(fallbackImage);
  };

  let fallbackRendered = false;
  const safeRenderFallback = () => {
    if (fallbackRendered) return;
    fallbackRendered = true;
    renderFallbackImage();
  };

  characterVideo.addEventListener("error", safeRenderFallback);
  characterVideo.querySelectorAll("source").forEach((source) => {
    source.addEventListener("error", safeRenderFallback);
  });

  const autoplayPromise = characterVideo.play();
  if (autoplayPromise && typeof autoplayPromise.catch === "function") {
    autoplayPromise.catch(() => {
      characterVideo.setAttribute("controls", "controls");
    });
  }
});
