AOS.init({
  duration: 900,
  easing: "ease-in-out",
  once: true,
});

const statsSection = document.querySelector("#estadisticas");
const counters = document.querySelectorAll(".stat-number");
let countersStarted = false;

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    let current = 0;
    const totalFrames = 280;
    const increment = Math.max(1, Math.ceil(target / totalFrames));

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        return;
      }
      counter.textContent = current;
      requestAnimationFrame(updateCounter);
    };
    updateCounter();
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounters();
    }
  },
  { threshold: 0.4 }
);

if (statsSection) {
  observer.observe(statsSection);
}

const contactForm = document.querySelector("#contactForm");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  swal({
    title: "¡Mensaje enviado!",
    text: "Gracias por contactarnos. Un asesor se comunicará contigo pronto.",
    icon: "success",
    button: "Aceptar",
  });
  contactForm.reset();
});
