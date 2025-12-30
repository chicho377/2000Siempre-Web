AOS.init({
  duration: 900,
  easing: "ease-in-out",
  once: true,
});

const heroVideo = document.querySelector(".hero-video");
const heroVideoProgress = document.querySelector(".hero-video-progress__fill");

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
const botField = document.querySelector("#website");
const formStartTime = Date.now();
const submitButton = contactForm?.querySelector("button[type='submit']");
// Configura estos valores con tus credenciales de EmailJS.

const emailConfig = {
  serviceId: "service_cglw2gm",
  templateId: "template_dkvl05j",
  publicKey: "SgowLeMIqAxlzBs7s",
};
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
  if (typeof emailjs !== "undefined") {
    emailjs.init(emailConfig.publicKey);
  }

  Object.keys(formFields).forEach((fieldId) => {
    const element = document.querySelector(`#${fieldId}`);
    if (!element) return;
    const eventName =
      element.type === "checkbox" || element.tagName === "SELECT" ? "change" : "input";
    element.addEventListener(eventName, () => validateField(fieldId));
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errors = [];
    const elapsed = Date.now() - formStartTime;

    if (botField && botField.value.trim() !== "") {
      swal({
        title: "Verificación de seguridad",
        text: "Se detectó actividad automatizada. Intenta nuevamente.",
        icon: "error",
        button: "Entendido",
      });
      return;
    }

    if (elapsed < 2000) {
      swal({
        title: "Verificación de seguridad",
        text: "Por favor completa el formulario con calma antes de enviarlo.",
        icon: "warning",
        button: "Entendido",
      });
      return;
    }

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
      title: "Enviando...",
      text: "Estamos enviando tu solicitud. Por favor espera.",
      icon: "info",
      buttons: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    });

    if (typeof emailjs === "undefined") {
      swal({
        title: "Error al enviar",
        text: "El servicio de correo no está disponible. Intenta más tarde.",
        icon: "error",
        button: "Entendido",
      });
      return;
    }

    if (submitButton) submitButton.disabled = true;

    try {
      const templateParams = {
        nombre: document.querySelector("#nombre")?.value.trim() ?? "",
        empresa: document.querySelector("#empresa")?.value.trim() ?? "",
        correo: document.querySelector("#correo")?.value.trim() ?? "",
        telefono: document.querySelector("#telefono")?.value.trim() ?? "",
        proyecto: document.querySelector("#proyecto")?.value.trim() ?? "",
        mensaje: document.querySelector("#mensaje")?.value.trim() ?? "",
        reply_to: document.querySelector("#correo")?.value.trim() ?? "",
      };

      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

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
    } catch (error) {
      swal({
        title: "No pudimos enviar tu solicitud",
        text: "Verifica la configuración del correo y vuelve a intentarlo.",
        icon: "error",
        button: "Entendido",
      });
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
