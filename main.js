AOS.init({
  duration: 900,
  easing: "ease-in-out",
  once: true,
});

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.9, ease: "power3.out" },
  });

  heroTimeline
    .from(".navbar", { y: -20, opacity: 0 })
    .from(".hero .text-uppercase", { y: 20, opacity: 0 })
    .from(".hero-title", { y: 30, opacity: 0 })
    .from(".hero .lead", { y: 20, opacity: 0 })
    .from(".hero .hero-cta, .hero .hero-cta-outline", {
      y: 15,
      opacity: 0,
      stagger: 0.15,
    })
    .from(".hero-badges .hero-badge", {
      y: 20,
      opacity: 0,
      stagger: 0.12,
    })
    .from(".hero-stats > div", {
      y: 20,
      opacity: 0,
      stagger: 0.15,
    });

  const staggerSections = [
    { trigger: "#servicios", targets: "#servicios .card" },
    { trigger: "#proceso", targets: "#proceso .card" },
    { trigger: "#proyectos", targets: "#proyectos .carousel, #proyectos ul li" },
    { trigger: "#estadisticas", targets: "#estadisticas .stat-card" },
    { trigger: "#galeria", targets: "#galeria .gallery-card" },
    { trigger: "#contacto", targets: "#contacto .col-lg-5 > * , #contacto .contact-section" },
  ];

  staggerSections.forEach(({ trigger, targets }) => {
    gsap.from(targets, {
      scrollTrigger: {
        trigger,
        start: "top 75%",
      },
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
    });
  });
}

const statsSection = document.querySelector("#estadisticas");
const counters = document.querySelectorAll(".stat-number");
let countersStarted = false;
const navbar = document.querySelector(".navbar");

const updateNavbar = () => {
  if (!navbar) return;
  if (window.scrollY > 40) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
};

window.addEventListener("scroll", updateNavbar);
updateNavbar();

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    let current = 0;
    const totalFrames = 380;
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
const formFields = {
  nombre: {
    label: "Nombre",
    validator: (value) => value.trim().length >= 2,
  },
  correo: {
    label: "Correo",
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  },
  telefono: {
    label: "Teléfono",
    validator: (value) => /^[0-9+\s()-]{7,}$/.test(value.trim()),
  },
  proyecto: {
    label: "Tipo de proyecto",
    validator: (value) => value.trim() !== "",
  },
  mensaje: {
    label: "Mensaje",
    validator: (value) => value.trim().length >= 10,
  },
  terminos: {
    label: "Tratamiento de datos",
    validator: (value, element) => element.checked,
  },
};

const toggleFieldState = (element, isValid) => {
  if (!element) return;
  element.classList.toggle("is-invalid", !isValid);
  element.classList.toggle("is-valid", isValid);
};

const validateField = (fieldId) => {
  const config = formFields[fieldId];
  const element = document.querySelector(`#${fieldId}`);
  if (!config || !element) return true;
  const isValid = config.validator(element.value, element);
  toggleFieldState(element, isValid);
  return isValid;
};

if (contactForm) {
  Object.keys(formFields).forEach((fieldId) => {
    const element = document.querySelector(`#${fieldId}`);
    if (!element) return;
    const eventName =
      element.type === "checkbox" || element.tagName === "SELECT" ? "change" : "input";
    element.addEventListener(eventName, () => validateField(fieldId));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const errors = [];

    Object.keys(formFields).forEach((fieldId) => {
      const isValid = validateField(fieldId);
      if (!isValid) {
        errors.push(formFields[fieldId].label);
      }
    });

    if (errors.length > 0) {
      swal({
        title: "Revisa los campos pendientes",
        text: `Falta completar o corregir: ${errors.join(", ")}.`,
        icon: "warning",
        button: "Entendido",
      });
      return;
    }

    swal({
      title: "¡Mensaje enviado!",
      text: "Gracias por contactarnos. Un asesor se comunicará contigo pronto.",
      icon: "success",
      button: "Aceptar",
    });
    contactForm.reset();
    Object.keys(formFields).forEach((fieldId) => {
      const element = document.querySelector(`#${fieldId}`);
      if (element) {
        element.classList.remove("is-valid", "is-invalid");
      }
    });
  });
}
