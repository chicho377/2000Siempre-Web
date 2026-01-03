(() => {
  const container = document.getElementById("stats-particles");
  if (!container || typeof particlesJS === "undefined") return;

  particlesJS("stats-particles", {
    particles: {
      number: {
        value: 60,
        density: { enable: true, value_area: 900 },
      },
      color: { value: ["#ffffff", "#cfe6ff", "#9fc5ff"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.45,
        random: true,
        anim: { enable: true, speed: 0.6, opacity_min: 0.2, sync: false },
      },
      size: {
        value: 3.5,
        random: true,
        anim: { enable: true, speed: 1.2, size_min: 1.2, sync: false },
      },
      line_linked: {
        enable: true,
        distance: 130,
        color: "#8fb8ff",
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.1,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: false },
        onclick: { enable: false },
        resize: true,
      },
    },
    retina_detect: true,
  });
})();
