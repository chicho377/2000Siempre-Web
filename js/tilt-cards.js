(() => {
  const tiltCards = document.querySelectorAll(".tilt-card");

  if (!tiltCards.length) return;

  tiltCards.forEach((card) => {
    let rafId = null;

    const handleMove = (event) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = (x / rect.width - 0.5) * 12;
        const rotateX = (y / rect.height - 0.5) * -12;
        card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        rafId = null;
      });
    };

    const resetTilt = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", resetTilt);
    card.addEventListener("blur", resetTilt);
  });
})();
