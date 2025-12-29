AOS.init({
  duration: 900,
  easing: "ease-in-out",
  once: true,
});

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
