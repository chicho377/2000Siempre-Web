AOS.init({
  duration: 900,
  easing: "ease-in-out",
  once: true,
});

const heroVideo = document.querySelector(".hero-video");
const heroVideoProgress = document.querySelector(".hero-video-progress__fill");
const heroSection = document.querySelector(".hero");
const heroOrbs = document.querySelectorAll(".hero-orb");

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

const statsSection = document.querySelector("#estadisticas");
const counters = document.querySelectorAll(".stat-number");
let countersStarted = false;
const navbar = document.querySelector(".navbar");
const backToTopButton = document.querySelector(".back-to-top");
const tiltCards = document.querySelectorAll(".tilt-card");
const navbarCollapse = document.querySelector("#navbarNav");
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarLinks = document.querySelectorAll(".navbar .nav-link");

const updateNavbar = () => {
  if (!navbar) return;
  if (window.scrollY > 40) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
};

const updateBackToTop = () => {
  if (!backToTopButton) return;
  if (window.scrollY > 280) {
    backToTopButton.classList.add("is-visible");
  } else {
    backToTopButton.classList.remove("is-visible");
  }
};

const handleScroll = () => {
  updateNavbar();
  updateBackToTop();
};

window.addEventListener("scroll", handleScroll);
handleScroll();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (navbarCollapse && navbarToggler && navbarLinks.length) {
  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navbarCollapse.classList.contains("show")) return;
      const collapse = bootstrap.Collapse.getInstance(navbarCollapse) ||
        new bootstrap.Collapse(navbarCollapse, { toggle: false });
      collapse.hide();
    });
  });
}

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

if (tiltCards.length) {
  tiltCards.forEach((card) => {
    let rafId = null;

    const handleMove = (event) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 12;
        const rotateX = ((y / rect.height) - 0.5) * -12;
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
